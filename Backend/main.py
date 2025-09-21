import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your routers
from features.auth.router import router as auth_router
from features.documents.router import router as docs_router
from features.chat.router import router as chat_router
from features.verification.router import router as verification_router
from features.Media.router import router as media_router

app = FastAPI(title="Docqulio Chatbot API")

# CORS configuration
origins = ["http://localhost:5173"]  # Frontend URL(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(docs_router)
app.include_router(chat_router)
app.include_router(verification_router)
app.include_router(media_router)

# Health check endpoint
@app.get("/")
def root():
    return {"message": "Backend running ✅"}

@app.get("/test-integration")
def test_integration():
    return {"status": "success", "message": "Connection successful!"}

# No __main__ block needed; Cloud Run uses CMD in Dockerfile
