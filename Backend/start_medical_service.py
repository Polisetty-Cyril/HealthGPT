#!/usr/bin/env python3
"""
Startup script for the Medical RAG Service
This script handles the initialization and startup of the Python medical service
"""

import subprocess
import sys
import os
import time
import requests
from pathlib import Path

def check_python_dependencies():
    """Check if required Python packages are installed"""
    required_packages = [
        'flask', 'flask_cors', 'numpy', 'faiss', 'sentence_transformers', 
        'transformers', 'torch', 'datasets'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("📦 Installing missing packages...")
        
        # Install missing packages
        for package in missing_packages:
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✅ Installed {package}")
            except subprocess.CalledProcessError:
                print(f"❌ Failed to install {package}")
                return False
    
    return True

def start_medical_service():
    """Start the medical RAG service"""
    print("🚀 Starting Medical RAG Service...")
    
    # Check if we're in the right directory
    if not os.path.exists('medical_rag_service.py'):
        print("❌ medical_rag_service.py not found. Please run this script from the Backend directory.")
        return False
    
    # Check dependencies
    if not check_python_dependencies():
        print("❌ Failed to install required dependencies")
        return False
    
    try:
        # Start the Flask service
        print("🔧 Initializing Medical RAG Service...")
        print("⏳ This may take a few minutes for first-time setup (downloading models)...")
        
        # Run the medical service
        subprocess.run([sys.executable, 'medical_rag_service.py'], check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Medical RAG Service stopped by user")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start Medical RAG Service: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🏥 Medical RAG Service Startup Script")
    print("=" * 50)
    
    success = start_medical_service()
    
    if success:
        print("✅ Medical RAG Service started successfully!")
    else:
        print("❌ Failed to start Medical RAG Service")
        sys.exit(1)
