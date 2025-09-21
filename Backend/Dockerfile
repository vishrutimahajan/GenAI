# ---- Base Image ----
FROM python:3.11-slim AS base

# Set working directory
WORKDIR /app

# Install system dependencies required by PyMuPDF, Pillow, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmupdf-dev \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# ---- Dependencies Layer ----
COPY requirements.txt .

RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy Application ----
COPY . .

# Expose Cloud Run default port
EXPOSE 8080

# ---- Run Application ----
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
