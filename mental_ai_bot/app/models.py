from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    messages = relationship("Message", back_populates="user")
    sleep_data = relationship("SleepData", back_populates="user")
    mood_entries = relationship("MoodEntry", back_populates="user")
    health_metrics = relationship("HealthMetric", back_populates="user")
    therapy_sessions = relationship("TherapySession", back_populates="user")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_user_message = Column(Boolean, nullable=False)  # True for user, False for AI
    message_type = Column(String, default="text")  # text, image, voice, etc.
    sentiment_score = Column(Float)  # -1 to 1
    emotion_detected = Column(String)  # happy, sad, anxious, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="messages")

class SleepData(Base):
    __tablename__ = "sleep_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    bedtime = Column(DateTime)
    wake_time = Column(DateTime)
    sleep_duration_hours = Column(Float)
    sleep_quality_score = Column(Integer)  # 1-10
    deep_sleep_hours = Column(Float)
    rem_sleep_hours = Column(Float)
    light_sleep_hours = Column(Float)
    sleep_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sleep_data")

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    mood_score = Column(Integer, nullable=False)  # 1-10
    emotions = Column(JSON)  # List of emotions: ["happy", "anxious", "calm"]
    energy_level = Column(Integer)  # 1-10
    stress_level = Column(Integer)  # 1-10
    anxiety_level = Column(Integer)  # 1-10
    depression_level = Column(Integer)  # 1-10
    notes = Column(Text)
    triggers = Column(JSON)  # List of triggers
    activities = Column(JSON)  # List of activities done
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="mood_entries")

class HealthMetric(Base):
    __tablename__ = "health_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    metric_type = Column(String, nullable=False)  # weight, heart_rate, blood_pressure, etc.
    value = Column(Float, nullable=False)
    unit = Column(String)  # kg, bpm, mmHg, etc.
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="health_metrics")

class TherapySession(Base):
    __tablename__ = "therapy_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_type = Column(String, nullable=False)  # chat, meditation, exercise, etc.
    duration_minutes = Column(Integer)
    ai_advice_given = Column(Text)
    user_feedback = Column(Text)
    effectiveness_score = Column(Integer)  # 1-10
    topics_discussed = Column(JSON)  # List of topics
    techniques_used = Column(JSON)  # List of therapeutic techniques
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="therapy_sessions")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    insight_type = Column(String, nullable=False)  # pattern, recommendation, warning, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    confidence_score = Column(Float)  # 0-1
    data_sources = Column(JSON)  # List of data sources used
    actionable_items = Column(JSON)  # List of actionable recommendations
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")

