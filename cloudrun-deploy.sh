#!/usr/bin/env bash
# Deploy the Expo web Docker image to Google Cloud Run
# Usage: ./cloudrun-deploy.sh <SERVICE_NAME>
set -e
PROJECT_ID="omnitask-496621"
SERVICE_NAME="omnitask"
REGION=us-central1
IMAGE=gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest

# Build Docker image
docker build -t ${IMAGE} .
# Push to Artifact Registry / Container Registry
docker push ${IMAGE}
# Deploy to Cloud Run (managed)
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080

# Output the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform managed --region ${REGION} --format='value(status.url)')
echo "Deployed to: ${SERVICE_URL}"
