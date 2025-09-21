#Legal Document Analysis App

A full-stack AI-powered application that allows users to upload, scan, and analyze legal documents.
The system uses FastAPI backend, React.js frontend, and AI integration to provide risk detection, clause extraction, and compliance validation.

🚀 Features
🔹 Frontend (React.js)

Modern UI with smooth animations (Framer Motion, custom components).

File Upload – Drag & drop or select legal documents.

Scanning Effects – Animated scanning line & verified stamp for user feedback.

Insights Display – Risky clauses, key points, and compliance summaries.

Report Download – Export results as PDF.

Authentication – Firebase-based login/signup.

🔹 Backend (FastAPI + AI + PDF Processing)

PDF Parsing: Extracts text using PyMuPDF.

AI-Powered Analysis: Uses OpenAI/Groq models for:

Clause classification

Risk detection

Compliance verification

PDF Report Generation: Uses ReportLab for downloadable summaries.

Authentication: Integrated with Firebase Admin SDK.

🔹 Deployment

Dockerized frontend & backend.

Deployable on Google Cloud Run (or any container environment).

🛠️ Tech Stack

Frontend

React.js

TailwindCSS + Framer Motion

Lucide Icons

Firebase (auth)

Backend

FastAPI

PyMuPDF (PDF parsing)

ReportLab (PDF generation)

OpenAI/Groq API for analysis

Firebase Admin SDK

DevOps

Docker

Cloud Run

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/your-username/legal-doc-analysis.git
cd legal-doc-analysis

2. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate
pip install -r requirements.txt


Create a .env file inside backend/:

OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
FIREBASE_CREDENTIALS=./firebase-admin-key.json


Run backend:

uvicorn main:app --reload

3. Frontend Setup
cd frontend
npm install


Create a .env file inside frontend/:

REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key


Run frontend:

npm start

📊 Usage Flow

Login via Firebase authentication.

Upload legal document (PDF).

The app parses and analyzes the document.

View highlighted risks, key clauses, and compliance summaries.

Download PDF report with structured analysis.

🐳 Docker Setup (Optional)
docker-compose up --build


Services included:

backend (FastAPI)

frontend (React.js)

🏆 USP (Unique Selling Proposition)

✅ AI-powered risk & clause detection in contracts/legal docs.
✅ End-to-end automation: from upload → scan → analyze → report.
✅ User-friendly UI with real-time scanning effects.
✅ Cloud-native (scalable, deployable via Docker & Cloud Run).

📌 Future Improvements

Highlight risks inside the original PDF

Add multi-user roles (lawyer, client, admin)

Integration with contract management systems

Support for multiple languages

📄 License

MIT License.
