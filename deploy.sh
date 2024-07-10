gcloud run deploy chatbot-kitchen \
    --source . \
    --region us-east4 \
    --env-vars-file="./env.yaml" \
    --allow-unauthenticated