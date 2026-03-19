# Mental Health Companion API

A FastAPI-based backend for a mental health companion application similar to Replika. This AI-powered system provides personalized mental health support, tracks user wellness data, and offers evidence-based advice.

## Features

### 🤖 AI-Powered Mental Health Support
- **Intelligent Chat**: Context-aware conversations with AI companion
- **Emotion Detection**: Sentiment analysis and emotion recognition
- **Personalized Advice**: Tailored recommendations based on user data
- **Safety Monitoring**: Detection of concerning patterns or statements

### 📊 Comprehensive Health Tracking
- **Mood Tracking**: Daily mood entries with emotion logging
- **Sleep Monitoring**: Sleep duration, quality, and pattern analysis
- **Health Metrics**: Custom health data tracking (weight, heart rate, etc.)
- **Therapy Sessions**: Record and track therapy activities

### 📈 Advanced Analytics
- **Wellness Scoring**: Overall health and wellness assessment
- **Pattern Recognition**: AI-powered insights into user behavior
- **Trend Analysis**: Mood, sleep, and health trend tracking
- **Risk Assessment**: Identification of potential mental health concerns

### 🔐 Secure Authentication
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration, login, and profile management
- **Data Privacy**: User data isolation and security

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **OpenAI/Anthropic**: AI language models for mental health support
- **JWT**: Secure authentication tokens
- **Pydantic**: Data validation and serialization

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL
- Redis (optional, for caching)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental_ai
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/mental_health_db
   SECRET_KEY=your-super-secret-key-change-this-in-production
   OPENAI_API_KEY=your-openai-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   REDIS_URL=redis://localhost:6379
   ```

5. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb mental_health_db
   
   # Run the application to create tables
   python -m app.main
   ```

6. **Run the Application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update user profile

### Chat & AI
- `POST /api/chat/send` - Send message to AI companion
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/chat/insights` - Get AI-generated insights

### Health Data
- `POST /api/health/sleep` - Create sleep data entry
- `GET /api/health/sleep` - Get sleep data
- `POST /api/health/mood` - Create mood entry
- `GET /api/health/mood` - Get mood entries
- `POST /api/health/metrics` - Create health metric
- `GET /api/health/metrics` - Get health metrics
- `POST /api/health/therapy` - Create therapy session
- `GET /api/health/therapy` - Get therapy sessions

### Analytics
- `GET /api/analytics/mood` - Get mood analytics
- `GET /api/analytics/sleep` - Get sleep analytics
- `GET /api/analytics/overall` - Get overall health insights

## Usage Examples

### Register a User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword"
  }'
```

### Send Message to AI
```bash
curl -X POST "http://localhost:8000/api/chat/send" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I have been feeling anxious lately",
    "message_type": "text"
  }'
```

### Log Mood Entry
```bash
curl -X POST "http://localhost:8000/api/health/mood" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15T00:00:00",
    "mood_score": 6,
    "emotions": ["anxious", "tired"],
    "stress_level": 7,
    "anxiety_level": 8,
    "notes": "Feeling overwhelmed with work"
  }'
```

## AI Features

### Mental Health Companion
The AI companion provides:
- **Empathetic Responses**: Context-aware, supportive conversations
- **Evidence-Based Advice**: Mental health recommendations based on best practices
- **Crisis Detection**: Identification of concerning statements or patterns
- **Personalized Support**: Tailored advice based on user's history and data

### Data Analysis
- **Sentiment Analysis**: Real-time emotion and sentiment detection
- **Pattern Recognition**: Identification of mood, sleep, and behavior patterns
- **Risk Assessment**: Early detection of potential mental health concerns
- **Insight Generation**: AI-powered insights and recommendations

## Security & Privacy

- **JWT Authentication**: Secure token-based authentication
- **Data Encryption**: Sensitive data encryption at rest
- **User Isolation**: Complete data separation between users
- **Privacy Compliance**: GDPR-ready data handling
- **Secure Headers**: Security headers for all responses

## Development

### Project Structure
```
app/
├── __init__.py
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── database.py          # Database connection
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── auth.py              # Authentication logic
├── ai_service.py        # AI integration
├── middleware.py        # Custom middleware
└── routers/
    ├── __init__.py
    ├── auth.py          # Authentication endpoints
    ├── chat.py          # Chat and AI endpoints
    ├── health_data.py   # Health data endpoints
    └── analytics.py     # Analytics endpoints
```

### Adding New Features

1. **New Data Models**: Add to `models.py`
2. **API Schemas**: Add to `schemas.py`
3. **Endpoints**: Create new router in `routers/`
4. **AI Features**: Extend `ai_service.py`

### Testing
```bash
# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=app
```

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations
- Use environment variables for all secrets
- Set up proper database migrations with Alembic
- Configure reverse proxy (nginx)
- Set up monitoring and logging
- Use HTTPS in production
- Configure rate limiting
- Set up backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for informational and supportive purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about mental health conditions.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the code examples in this README

