#!/usr/bin/env python3
"""
Complete System Startup Script for ARAGOG Medical RAG System
This script starts both the Python Medical RAG service and the Node.js backend
"""

import subprocess
import sys
import os
import time
import threading
import requests
from pathlib import Path

class SystemManager:
    def __init__(self):
        self.medical_process = None
        self.backend_process = None
        self.frontend_process = None
        
    def check_requirements(self):
        """Check if all required tools are installed"""
        print("🔍 Checking system requirements...")
        
        # Check Python
        try:
            python_version = subprocess.check_output([sys.executable, '--version']).decode().strip()
            print(f"✅ Python: {python_version}")
        except:
            print("❌ Python not found")
            return False
        
        # Check Node.js
        try:
            node_version = subprocess.check_output(['node', '--version']).decode().strip()
            print(f"✅ Node.js: {node_version}")
        except:
            print("❌ Node.js not found")
            return False
        
        # Check npm
        try:
            npm_version = subprocess.check_output(['npm', '--version']).decode().strip()
            print(f"✅ npm: {npm_version}")
        except:
            print("❌ npm not found")
            return False
        
        return True
    
    def install_backend_dependencies(self):
        """Install Node.js backend dependencies"""
        print("📦 Installing backend dependencies...")
        try:
            os.chdir('Backend')
            subprocess.check_call(['npm', 'install'])
            print("✅ Backend dependencies installed")
            os.chdir('..')
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install backend dependencies")
            return False
    
    def install_frontend_dependencies(self):
        """Install frontend dependencies"""
        print("📦 Installing frontend dependencies...")
        try:
            frontend_path = 'Frontend/medirag-ai-main/medirag-ai-main'
            os.chdir(frontend_path)
            subprocess.check_call(['npm', 'install'])
            print("✅ Frontend dependencies installed")
            os.chdir('../../..')
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install frontend dependencies")
            return False
    
    def start_medical_service(self):
        """Start the Python Medical RAG service"""
        print("🏥 Starting Medical RAG Service...")
        try:
            os.chdir('Backend')
            self.medical_process = subprocess.Popen([
                sys.executable, 'medical_rag_service.py'
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            os.chdir('..')
            
            # Wait a bit for the service to start
            time.sleep(5)
            
            # Check if service is running
            try:
                response = requests.get('http://localhost:5001/health', timeout=10)
                if response.status_code == 200:
                    print("✅ Medical RAG Service started successfully")
                    return True
            except:
                print("⏳ Medical RAG Service is starting up...")
                return True
                
        except Exception as e:
            print(f"❌ Failed to start Medical RAG Service: {e}")
            return False
    
    def start_backend_service(self):
        """Start the Node.js backend service"""
        print("🔧 Starting Node.js Backend...")
        try:
            os.chdir('Backend')
            self.backend_process = subprocess.Popen([
                'npm', 'run', 'dev'
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            os.chdir('..')
            
            # Wait a bit for the service to start
            time.sleep(3)
            
            # Check if service is running
            try:
                response = requests.get('http://localhost:5000/api/health', timeout=10)
                if response.status_code == 200:
                    print("✅ Backend service started successfully")
                    return True
            except:
                print("⏳ Backend service is starting up...")
                return True
                
        except Exception as e:
            print(f"❌ Failed to start Backend Service: {e}")
            return False
    
    def start_frontend_service(self):
        """Start the React frontend service"""
        print("🎨 Starting Frontend Service...")
        try:
            frontend_path = 'Frontend/medirag-ai-main/medirag-ai-main'
            os.chdir(frontend_path)
            self.frontend_process = subprocess.Popen([
                'npm', 'run', 'dev'
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            os.chdir('../../..')
            
            # Wait a bit for the service to start
            time.sleep(5)
            
            print("✅ Frontend service started successfully")
            return True
                
        except Exception as e:
            print(f"❌ Failed to start Frontend Service: {e}")
            return False
    
    def stop_all_services(self):
        """Stop all running services"""
        print("\n🛑 Stopping all services...")
        
        if self.medical_process:
            self.medical_process.terminate()
            print("✅ Medical RAG Service stopped")
        
        if self.backend_process:
            self.backend_process.terminate()
            print("✅ Backend Service stopped")
        
        if self.frontend_process:
            self.frontend_process.terminate()
            print("✅ Frontend Service stopped")
    
    def run_system(self):
        """Run the complete system"""
        print("🚀 ARAGOG Medical RAG System Startup")
        print("=" * 50)
        
        # Check requirements
        if not self.check_requirements():
            print("❌ System requirements not met")
            return False
        
        # Install dependencies
        if not self.install_backend_dependencies():
            return False
        
        if not self.install_frontend_dependencies():
            return False
        
        # Start services
        if not self.start_medical_service():
            return False
        
        if not self.start_backend_service():
            return False
        
        if not self.start_frontend_service():
            return False
        
        print("\n🎉 All services started successfully!")
        print("=" * 50)
        print("📱 Frontend: http://localhost:5173")
        print("🔧 Backend API: http://localhost:5000")
        print("🏥 Medical RAG: http://localhost:5001")
        print("=" * 50)
        print("Press Ctrl+C to stop all services")
        
        try:
            # Keep the script running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop_all_services()
            print("\n👋 System stopped. Goodbye!")
            return True

if __name__ == "__main__":
    manager = SystemManager()
    success = manager.run_system()
    
    if not success:
        print("❌ Failed to start system")
        sys.exit(1)
