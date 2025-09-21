from google.cloud import storage
import os
from google.cloud import translate

client = translate.TranslationServiceClient()

# Use service account key locally if provided, else Cloud Run default credentials
key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if key_path:
    client = storage.Client.from_service_account_json(key_path)
else:
    client = storage.Client()  # Cloud Run automatically provides credentials

def upload_file(local_path: str, bucket_name: str, destination_blob_name: str):
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(local_path)
    return f"gs://{bucket_name}/{destination_blob_name}"

def download_file(blob_name: str, bucket_name: str, local_path: str):
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.download_to_filename(local_path)
    return local_path
