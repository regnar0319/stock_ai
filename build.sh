#!/bin/bash
set -e

# Install Python dependencies
pip install -r requirements.txt

# Build frontend
npm install --prefix frontend
npm run build --prefix frontend

echo "Build complete"
