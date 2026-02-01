#!/bin/bash

# Test CI Pipeline Locally
# This script mimics the GitHub Actions workflow

set -e  # Exit on any error

echo "🚀 Testing CI Pipeline Locally..."

echo "📦 Installing dependencies..."
npm ci

echo "🔍 Running linter..."
npm run lint

echo "🔨 Building project..."
npm run build

echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

echo "🧪 Running E2E tests..."
npm run test:e2e

echo "✅ All CI steps passed successfully!"
echo "🎉 Your pipeline is ready for GitHub Actions!"