#!/usr/bin/env python3
"""
Test script for the Mental Health Companion API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing Mental Health Companion API")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Root endpoint
    print("\n2. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Register a user
    print("\n3. Testing user registration...")
    try:
        user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("User registered successfully!")
            user_info = response.json()
            print(f"User ID: {user_info['id']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 4: Login
    print("\n4. Testing user login...")
    try:
        login_data = {
            "username": "testuser",
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            token_info = response.json()
            token = token_info["access_token"]
            print("Login successful!")
            print(f"Token: {token[:50]}...")
            return token
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    return None

def test_authenticated_endpoints(token):
    if not token:
        print("\nSkipping authenticated tests - no token available")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 5: Get user info
    print("\n5. Testing get user info...")
    try:
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            user_info = response.json()
            print(f"User: {user_info['username']} ({user_info['email']})")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 6: Send a message to AI
    print("\n6. Testing AI chat...")
    try:
        message_data = {
            "content": "I've been feeling anxious lately. Can you help me?",
            "message_type": "text"
        }
        response = requests.post(f"{BASE_URL}/api/chat/send", json=message_data, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            ai_response = response.json()
            print(f"AI Response: {ai_response['message']}")
            print(f"Emotion detected: {ai_response.get('emotion_detected', 'N/A')}")
            print(f"Sentiment score: {ai_response.get('sentiment_score', 'N/A')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 7: Log mood entry
    print("\n7. Testing mood entry...")
    try:
        mood_data = {
            "date": "2024-01-15T00:00:00",
            "mood_score": 6,
            "emotions": ["anxious", "tired"],
            "stress_level": 7,
            "anxiety_level": 8,
            "notes": "Feeling overwhelmed with work"
        }
        response = requests.post(f"{BASE_URL}/api/health/mood", json=mood_data, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            mood_entry = response.json()
            print(f"Mood entry created with ID: {mood_entry['id']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 8: Get mood analytics
    print("\n8. Testing mood analytics...")
    try:
        response = requests.get(f"{BASE_URL}/api/analytics/mood", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            analytics = response.json()
            print(f"Average mood: {analytics['average_mood']}")
            print(f"Mood trend: {analytics['mood_trend']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    token = test_api()
    test_authenticated_endpoints(token)
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")
    print("\nTo explore the API further:")
    print("- Visit http://localhost:8000/docs for interactive documentation")
    print("- Visit http://localhost:8000/redoc for alternative documentation")
    print("- Use the token from login to test authenticated endpoints")




