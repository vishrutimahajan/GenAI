import os
import io
import docx
import google.generativeai as genai
from fastapi import HTTPException, UploadFile, status
from PIL import Image
from pypdf import PdfReader
from google.cloud import translate_v2 as translate
from google.cloud import storage  # ✅ For GCS

# --- AI Configuration ---
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel('gemini-1.5-flash')
except KeyError:
    raise RuntimeError("GEMINI_API_KEY environment variable not set.")

# --- Initialize the Translation client ---
try:
    translate_client = translate.Client()
except Exception as e:
    raise RuntimeError(f"Failed to initialize Google Translate client. Ensure authentication is configured. Error: {str(e)}")

# --- Initialize the GCS client ---
try:
    storage_client = storage.Client()
    bucket_name = os.environ.get("GCS_BUCKET_NAME")  # ✅ set in your env
    bucket = storage_client.bucket(bucket_name)
except Exception as e:
    raise RuntimeError(f"Failed to initialize GCS client. Error: {str(e)}")


def upload_file_to_gcs(user_id: str, filename: str, file_data: bytes, content_type: str) -> str:
    """
    Uploads file to Google Cloud Storage in path docs/{user_id}/{filename}.
    Returns the public GCS URL.
    """
    try:
        blob_path = f"docs/{user_id}/{filename}"
        blob = bucket.blob(blob_path)
        blob.upload_from_string(file_data, content_type=content_type)
        return blob.public_url
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GCS upload failed: {str(e)}"
        )


def extract_text_from_file(file: UploadFile) -> str:
    """Extracts text from a DOCX file."""
    try:
        file.file.seek(0)
        doc = docx.Document(io.BytesIO(file.file.read()))
        file.file.seek(0)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process DOCX file: {str(e)}"
        )


def translate_text(text: str, target_language: str) -> str:
    """Translates text into the target language using Google Cloud Translation API."""
    if not text or not target_language:
        return text
    try:
        result = translate_client.translate(text, target_language=target_language)
        return result['translatedText']
    except Exception as e:
        print(f"Warning: Translation to '{target_language}' failed: {str(e)}")
        return text


def generate_chat_response(
    prompt: str,
    document_text: str | None = None,
    file_data: bytes | None = None,
    mime_type: str | None = None,
    target_language: str | None = None
) -> str:
    """
    Generates a response from the Gemini AI based on the user prompt and optional context.
    """
    system_prompt = """
    You are 'Doqulio', a friendly and helpful AI legal assistant. Your main goal is to demystify complex legal jargon and answer legal questions for users.

    1. **If a document is provided:** Analyze and summarize it. Generate a detailed report with key findings. Assess authenticity as a percentage. Highlight clauses needing attention.
    2. **If NO document is provided:** Answer the user's question directly in clear, simple language.

    Always be friendly and professional.
    """

    contents = [system_prompt]

    if document_text:
        contents.append(f"--- DOCUMENT CONTEXT ---\n{document_text}\n--- END OF DOCUMENT ---\n")
    
    if file_data and mime_type:
        if "image" in mime_type:
            contents.append(Image.open(io.BytesIO(file_data)))
        elif "pdf" in mime_type:
            contents.append({
                'mime_type': mime_type,
                'data': file_data
            })

    contents.append(f"User's question: {prompt}")

    try:
        response = model.generate_content(contents)
        generated_text = response.text

        if target_language:
            return translate_text(generated_text, target_language)
        
        return generated_text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error communicating with AI service: {str(e)}"
        )
