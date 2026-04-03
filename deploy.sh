#!/bin/bash

# 100 Great Humans - Vercel Deployment Script

echo "🚀 Starting deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the Next.js app
echo "📦 Building Next.js app..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📱 Your app should be available at: https://100-great-humans.vercel.app"
