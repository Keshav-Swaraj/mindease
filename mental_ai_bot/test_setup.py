#!/usr/bin/env python3
"""
Simple test script to verify the Mental Health Companion API setup
"""
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported successfully."""
    try:
        from app.config import settings
        print("Config imported successfully")
        
        from app.database import engine, Base
        print("Database imported successfully")
        
        from app.models import User, Message, SleepData, MoodEntry
        print("Models imported successfully")
        
        from app.schemas import UserCreate, MessageCreate, ChatResponse
        print("Schemas imported successfully")
        
        from app.auth import authenticate_user, create_access_token
        print("Auth imported successfully")
        
        from app.ai_service import ai_service
        print("AI service imported successfully")
        
        from app.routers import auth, chat, health_data, analytics
        print("Routers imported successfully")
        
        from app.main import app
        print("Main app imported successfully")
        
        print("\nAll imports successful! The API is ready to run.")
        return True
        
    except ImportError as e:
        print(f"Import error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def test_config():
    """Test configuration values."""
    try:
        from app.config import settings
        print(f"\nConfiguration:")
        print(f"  Database URL: {settings.DATABASE_URL}")
        print(f"  Debug mode: {settings.DEBUG}")
        print(f"  Log level: {settings.LOG_LEVEL}")
        print(f"  OpenAI API key configured: {'Yes' if settings.OPENAI_API_KEY else 'No'}")
        print(f"  Anthropic API key configured: {'Yes' if settings.ANTHROPIC_API_KEY else 'No'}")
        return True
    except Exception as e:
        print(f"Configuration error: {e}")
        return False

if __name__ == "__main__":
    print("Mental Health Companion API - Setup Test")
    print("=" * 50)
    
    success = True
    success &= test_imports()
    success &= test_config()
    
    if success:
        print("\nSetup test completed successfully!")
        print("\nTo run the API:")
        print("  python run.py")
        print("  or")
        print("  uvicorn app.main:app --reload")
        print("\nAPI will be available at: http://localhost:8000")
        print("Documentation at: http://localhost:8000/docs")
    else:
        print("\nSetup test failed. Please check the errors above.")
        sys.exit(1)
