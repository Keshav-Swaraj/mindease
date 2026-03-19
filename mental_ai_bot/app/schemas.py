from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, date

# User Schemas
class AIInsightBase(BaseModel):
    insight_type: str
    title: str
    description: str
    confidence_score: float
    data_sources: List[str]
    actionable_items: List[str]

class AIInsightCreate(AIInsightBase):
    pass

class AIInsightResponse(AIInsightBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[date] = None
    
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

# Message Schemas
class MessageBase(BaseModel):
    content: str
    message_type: str = "text"

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    user_id: int
    is_user_message: bool
    sentiment_score: Optional[float] = None
    emotion_detected: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Sleep Data Schemas
class SleepDataBase(BaseModel):
    date: datetime
    bedtime: Optional[datetime] = None
    wake_time: Optional[datetime] = None
    sleep_duration_hours: Optional[float] = None
    sleep_quality_score: Optional[int] = None
    deep_sleep_hours: Optional[float] = None
    rem_sleep_hours: Optional[float] = None
    light_sleep_hours: Optional[float] = None
    sleep_notes: Optional[str] = None

class SleepDataCreate(SleepDataBase):
    pass

class SleepData(SleepDataBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Mood Entry Schemas
class MoodEntryBase(BaseModel):
    date: datetime
    mood_score: int
    emotions: Optional[List[str]] = None
    energy_level: Optional[int] = None
    stress_level: Optional[int] = None
    anxiety_level: Optional[int] = None
    depression_level: Optional[int] = None
    notes: Optional[str] = None
    triggers: Optional[List[str]] = None
    activities: Optional[List[str]] = None

class MoodEntryCreate(MoodEntryBase):
    pass

class MoodEntry(MoodEntryBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Health Metric Schemas
class HealthMetricBase(BaseModel):
    date: datetime
    metric_type: str
    value: float
    unit: Optional[str] = None
    notes: Optional[str] = None

class HealthMetricCreate(HealthMetricBase):
    pass

class HealthMetric(HealthMetricBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Therapy Session Schemas
class TherapySessionBase(BaseModel):
    session_type: str
    duration_minutes: Optional[int] = None
    ai_advice_given: Optional[str] = None
    user_feedback: Optional[str] = None
    effectiveness_score: Optional[int] = None
    topics_discussed: Optional[List[str]] = None
    techniques_used: Optional[List[str]] = None

class TherapySessionCreate(TherapySessionBase):
    pass

class TherapySession(TherapySessionBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# AI Insight Schemas
class AIInsightBase(BaseModel):
    insight_type: str
    title: str
    description: str
    confidence_score: Optional[float] = None
    data_sources: Optional[List[str]] = None
    actionable_items: Optional[List[str]] = None

class AIInsightCreate(AIInsightBase):
    user_id: int

class AIInsight(AIInsightBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chat Response Schema
class ChatResponse(BaseModel):
    message: str
    emotion_detected: Optional[str] = None
    sentiment_score: Optional[float] = None
    suggestions: Optional[List[str]] = None
    follow_up_questions: Optional[List[str]] = None

# Analytics Schemas
class MoodAnalytics(BaseModel):
    average_mood: float
    mood_trend: str  # "improving", "declining", "stable"
    common_emotions: List[Dict[str, Any]]
    mood_patterns: Dict[str, Any]

class SleepAnalytics(BaseModel):
    average_sleep_duration: float
    sleep_quality_trend: str
    sleep_patterns: Dict[str, Any]
    recommendations: List[str]

class HealthInsights(BaseModel):
    overall_wellness_score: float
    key_insights: List[AIInsight]
    recommendations: List[str]
    risk_factors: List[str]

