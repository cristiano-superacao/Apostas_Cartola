#!/bin/bash
# Build script for Netlify

echo "🚀 Starting SuperMittos build..."

# Go to frontend directory
cd frontend

echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

echo "🔧 Building React + Vite app..."
npm run build

echo "✅ Build completed!"
ls -la dist/

echo "📊 Build size:"
du -sh dist/