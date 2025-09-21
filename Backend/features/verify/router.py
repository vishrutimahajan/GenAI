# router.py

import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import Dict, Any

# Import the service and schemas
from features.verification.service import verification_service
from features.verification.schemas import VerificationReport, ReportLanguage


# --- NEW: Mapping from full language name to ISO code ---
LANGUAGE_CODE_MAP = {
    "English": "en",
    "Hindi": "hi",
    "Bengali": "bn",
    "Marathi": "mr",
    "Telugu": "te",
    "Tamil": "ta",
    "Gujarati": "gu",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Punjabi": "pa",
}


router = APIRouter(
    prefix="/documents",
    tags=["Document Verification"]
)

@router.post(
    "/verify",
    summary="Verify a document and get a translated PDF report",
    description="Upload a document and select a regional language for the analysis report from the dropdown menu. "
)
async def verify_document_endpoint(
    file: UploadFile = File(..., description="The document file to be verified (PDF, JPG, PNG)."),
    description: str = Form(
        ..., 
        description="A short description of what the document is supposed to be (e.g., 'An invoice from ACME Corp')."
    ),
    # --- MODIFIED: The parameter now uses the Enum to create a dropdown ---
    output_language: ReportLanguage = Form(
        ReportLanguage.ENGLISH, # Default value
        description="Select the language for the final analysis report."
    ),
        user_id: str = Form(..., description="Firebase user ID for organizing docs in GCS")

):
    """
    Handles file upload, calls the verification service with a target language from the dropdown, and returns a PDF report.
        - Stores only the redacted file in GCS: docs/{user_id}/{filename}.txt
        - Returns the PDF report as a downloadable file.
        - Logs key events and errors for monitoring.
    """
    try:
        language_code = LANGUAGE_CODE_MAP[output_language.value]
        logging.info(
            f"Received request for document: {file.filename}. "
            f"User: {user_id}, Language: {output_language.value} ({language_code})"
        )

        file_content = await file.read()

        report_data: VerificationReport = verification_service.verify_document(
            file_content=file_content,
            filename=file.filename,
            description=description,
            output_language=language_code,
            user_id=user_id
        )
        pdf_buffer = verification_service.generate_pdf_report(report_data)
        
        safe_filename = "".join(c for c in file.filename if c.isalnum() or c in ('.', '_')).rstrip()
        report_filename = f"verification_report_{language_code}_{safe_filename}.pdf"

        logging.info(f"Successfully generated '{language_code}' report for {file.filename}.")

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={report_filename}"}
        )

    except Exception as e:
        logging.error(f"An unexpected error occurred during document verification for {file.filename}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An internal error occurred while processing the document. Details: {str(e)}"
        )
        
@router.post(
    "/simple-analyze",
    summary="Perform a simple text analysis and get a JSON response",
    description="Analyzes the document for plausibility and returns a quick, simple JSON verification report. No PDF is generated."
)
async def simple_analyze_endpoint(
    file: UploadFile = File(..., description="The document file to analyze."),
    description: str = Form(
        ..., 
        description="A short description of what the document is supposed to be (e.g., 'An invoice from ACME Corp')."
    ),
) -> Dict[str, Any]:
    """
    A lightweight endpoint for quick text analysis.
    """
    try:
        logging.info(f"Received request for simple analysis of document: {file.filename}")

        file_content = await file.read()
        status_map = {
    "VERIFIED": "authentic",
    "SUSPICIOUS": "suspicious",
    "INDETERMINATE": "fake",
    "ERROR": "fake"
}
        analysis_result = verification_service.simple_analyze(
            file_content=file_content,
            filename=file.filename,
            description=description
        )
        response = {
    "status": status_map.get(
        getattr(analysis_result, "verification_status", "ERROR"), 
        "fake"
    ),
    "confidence": getattr(analysis_result, "confidence_score", 0),
    "findings": getattr(analysis_result, "analysis_details", "").split("\n"),
    "recommendations": ["Cross-check with source", "Keep an audit log"]
}

        logging.info(f"Successfully completed simple analysis for {file.filename}.")
        return response
    except Exception as e:
        logging.error(f"An unexpected error occurred during simple analysis for {file.filename}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An internal error occurred while processing the document. Details: {str(e)}"
        )