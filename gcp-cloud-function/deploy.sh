#!/bin/bash

# Configuration settings (Adjust as needed or override via environment)
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
FUNCTION_NAME="sonal-studio-catalog-pipeline"
REGION="us-central1"
SOURCE_BUCKET="sonal-studio-raw-uploads"
DEST_BUCKET="sonal-studio-catalog-ready"
MEMORY="2048Mi"
TIMEOUT="540s"

echo "=========================================================="
echo "Sonal Studio: Deploying GCP Cloud Function (Gen 2)"
echo "=========================================================="
echo "Function Name:  $FUNCTION_NAME"
echo "Project ID:     $PROJECT_ID"
echo "Region:         $REGION"
echo "Source Bucket:  gs://$SOURCE_BUCKET"
echo "Dest Bucket:    gs://$DEST_BUCKET"
echo "Memory:         $MEMORY"
echo "Timeout:        $TIMEOUT"
echo "=========================================================="

if [ -z "$PROJECT_ID" ]; then
  echo "WARNING: Could not auto-detect Active GCP Project."
  echo "Please verify by running: gcloud config set project <PROJECT_ID>"
  echo "Or configure manually in this script."
  echo ""
fi

# Confirming deploy action
echo "Run the following command to deploy or run this script directly:"
echo ""
echo "gcloud functions deploy $FUNCTION_NAME \\"
echo "  --gen2 \\"
echo "  --runtime=python310 \\"
echo "  --region=$REGION \\"
echo "  --entry-point=run_catalog_pipeline \\"
echo "  --memory=$MEMORY \\"
echo "  --timeout=$TIMEOUT \\"
echo "  --trigger-event-filters=\"type=google.cloud.storage.object.v1.finalized\" \\"
echo "  --trigger-event-filters=\"bucket=$SOURCE_BUCKET\" \\"
echo "  --set-env-vars=DEST_BUCKET=$DEST_BUCKET,GCP_LOCATION=$REGION,SEED=42"
echo ""

# To execute deployment from script:
# gcloud functions deploy $FUNCTION_NAME \
#   --gen2 \
#   --runtime=python310 \
#   --region=$REGION \
#   --entry-point=run_catalog_pipeline \
#   --memory=$MEMORY \
#   --timeout=$TIMEOUT \
#   --trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \
#   --trigger-event-filters="bucket=$SOURCE_BUCKET" \
#   --set-env-vars=DEST_BUCKET=$DEST_BUCKET,GCP_LOCATION=$REGION,SEED=42
