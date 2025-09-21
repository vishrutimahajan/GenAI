 
import json
import datetime,re,pdfplumber
from docx import Document
from firebase_admin import firestore
from core.gcs import upload_file, download_file
import google.generativeai as gemini
from core.firebase import db  # <- import the already initialized db ///////
from core.config import GEMINI_API_KEY
from google.cloud import storage
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status 
import tempfile
import os
# --- Patterns for redaction --- ########
patterns = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "phone": r"\b\d{10}\b",
    "aadhaar": r"\b\d{4}\s\d{4}\s\d{4}\b",
    "pan": r"[A-Z]{5}[0-9]{4}[A-Z]{1}",
     "pincode": r"\b\d{6}\b",  # Indian postal codes
    "house_no": r"\b(?:Flat|House|Plot|No\.?|#)\s?\d+[A-Za-z0-9/-]*\b",
    "street": r"\b(?:Street|St|Road|Rd|Nagar|Colony|Avenue|Ave|Lane|Ln|Block)\b.*"
}

db = firestore.client()
gemini.api_key = ".."

storage_client = storage.Client()
BUCKET_NAME = "docquliobucket"

# ... other functions ...



def redact_text(text: str) -> str:
    """Apply regex patterns to redact sensitive info"""
    for _, pattern in patterns.items():
        text = re.sub(pattern, "[HIDDEN]", text)
    return text


def extract_text_from_file(local_path: str, mime_type: str) -> str:
    """Read file from local path and extract text based on type"""
    if mime_type == "application/pdf":
        text = ""
        with pdfplumber.open(local_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text

    elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = Document(local_path)
        return "\n".join([p.text for p in doc.paragraphs])

    elif mime_type.startswith("text/"):
        with open(local_path, "r", encoding="utf-8") as f:
            return f.read()

    else:
        raise ValueError(f"Unsupported file type: {mime_type}")


def parse_and_redact(local_path: str, mime_type: str) -> str:
    """Main function to parse and redact document"""
    raw_text = extract_text_from_file(local_path, mime_type)
    return redact_text(raw_text)




def upload_file_to_gcs(file_data: bytes, file_name: str, mime_type: str) -> str:
    """Uploads a file to GCS and returns its public URL."""
    try:
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(file_name)
        
        blob.upload_from_string(file_data, content_type=mime_type)
        
        # Make the file publicly accessible
        
        return f"https://storage.googleapis.com/{BUCKET_NAME}/{file_name}"
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file to cloud storage: {str(e)}"
        )

def download_file_from_gcs(blob_name: str, local_path: str):
    try:
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(blob_name)
        blob.download_to_filename(local_path)
        return local_path
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GCS download failed: {str(e)}"
        )

# --- Main Service Function ---
def process_document(user_id: str, file_data: bytes, filename: str, document_type: str, mime_type: str):
    """
    Handles the entire document analysis pipeline.
    This function is the core business logic.
    """
    gcs_path = f"docs/{user_id}/{filename}"

    # Step 1: Upload file to GCS
    gcs_url = upload_file_to_gcs(file_data, gcs_path, mime_type)

    # Step 2: Save initial metadata in Firestore
    doc_ref = db.collection("users").document(user_id).collection("documents").document()
    doc_ref.set({
        "filename": filename,
        "document_type": document_type,
        "mime_type": mime_type,
        "gcs_url": gcs_url,
        "uploaded_at": datetime.datetime.utcnow(),
        "analysis_report": None
    })

    # Step 3: Extract and redact content
    local_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{filename.split('.')[-1]}") as temp_file:
            temp_file.write(file_data)
            local_path = temp_file.name
        content = extract_text_from_file(local_path, mime_type)
        redacted_content = redact_text(content)
    except Exception as e:
        doc_ref.update({"status": "failed", "error": f"Text extraction failed: {str(e)}"})
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Text extraction failed: {str(e)}")
    finally:
        if local_path and os.path.exists(local_path):
            os.remove(local_path)

    # Step 4: Call Gemini for structured report
    prompt = f"""
    Analyze the following {document_type} document and provide a structured JSON response.

    1. **Summary**: A concise, executive summary of the document's content.
    2. **Key Points**: A list of the most important clauses or facts.
    3. **Risks**: A list of potential legal or financial risks.
    4. **Recommendations**: A list of recommendations for the user.
    5. **Legal Terms**: A list of key legal terms with simple, clear definitions.
    6. **Confidence**: A numerical confidence score (0-100) indicating the reliability of the analysis.

    Document content:
    ---
    {redacted_content}
    ---
    """
    generation_config = {
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "OBJECT",
            "properties": {
                "summary": {"type": "STRING"},
                "keyPoints": {"type": "ARRAY", "items": {"type": "STRING"}},
                "risks": {"type": "ARRAY", "items": {"type": "STRING"}},
                "recommendations": {"type": "ARRAY", "items": {"type": "STRING"}},
                "legalTerms": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "term": {"type": "STRING"},
                            "definition": {"type": "STRING"}
                        }
                    }
                },
                "confidence": {"type": "INTEGER"}
            }
        }
    }

    try:
        model = gemini.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt, generation_config=generation_config)
        analysis_report_json = response.text
        analysis_report_dict = json.loads(analysis_report_json)
        
        # Step 5: Update Firestore with the complete report
        doc_ref.update({
            "status": "complete",
            "analysis_report": analysis_report_dict,
            "summary_generated_at": datetime.datetime.utcnow()
        })
    except Exception as e:
        doc_ref.update({"status": "failed", "error": f"Gemini analysis failed: {str(e)}"})
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Gemini analysis failed: {str(e)}")

    # Step 6: Return results
    return {
        "doc_id": doc_ref.id,
        "gcs_url": gcs_url,
        "analysis_report": analysis_report_dict
    }