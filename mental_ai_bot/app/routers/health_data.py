from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.models import User, SleepData, MoodEntry, HealthMetric, TherapySession
from app.schemas import (
    SleepDataCreate, SleepData as SleepDataSchema,
    MoodEntryCreate, MoodEntry as MoodEntrySchema,
    HealthMetricCreate, HealthMetric as HealthMetricSchema,
    TherapySessionCreate, TherapySession as TherapySessionSchema
)
from app.auth import get_current_active_user

router = APIRouter()

# Sleep Data Endpoints
@router.post("/sleep", response_model=SleepDataSchema)
async def create_sleep_data(
    sleep_data: SleepDataCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new sleep data entry."""
    db_sleep = SleepData(
        user_id=current_user.id,
        **sleep_data.dict()
    )
    db.add(db_sleep)
    db.commit()
    db.refresh(db_sleep)
    return db_sleep

@router.get("/sleep", response_model=List[SleepDataSchema])
async def get_sleep_data(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get sleep data for the current user."""
    query = db.query(SleepData).filter(SleepData.user_id == current_user.id)
    
    if start_date:
        query = query.filter(SleepData.date >= start_date)
    if end_date:
        query = query.filter(SleepData.date <= end_date)
    
    sleep_data = query.order_by(SleepData.date.desc()).limit(limit).all()
    return sleep_data

@router.put("/sleep/{sleep_id}", response_model=SleepDataSchema)
async def update_sleep_data(
    sleep_id: int,
    sleep_data: SleepDataCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update sleep data entry."""
    db_sleep = db.query(SleepData).filter(
        SleepData.id == sleep_id,
        SleepData.user_id == current_user.id
    ).first()
    
    if not db_sleep:
        raise HTTPException(status_code=404, detail="Sleep data not found")
    
    for field, value in sleep_data.dict().items():
        setattr(db_sleep, field, value)
    
    db.commit()
    db.refresh(db_sleep)
    return db_sleep

@router.delete("/sleep/{sleep_id}")
async def delete_sleep_data(
    sleep_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete sleep data entry."""
    db_sleep = db.query(SleepData).filter(
        SleepData.id == sleep_id,
        SleepData.user_id == current_user.id
    ).first()
    
    if not db_sleep:
        raise HTTPException(status_code=404, detail="Sleep data not found")
    
    db.delete(db_sleep)
    db.commit()
    return {"message": "Sleep data deleted successfully"}

# Mood Entry Endpoints
@router.post("/mood", response_model=MoodEntrySchema)
async def create_mood_entry(
    mood_entry: MoodEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new mood entry."""
    db_mood = MoodEntry(
        user_id=current_user.id,
        **mood_entry.dict()
    )
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)
    return db_mood

@router.get("/mood", response_model=List[MoodEntrySchema])
async def get_mood_entries(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get mood entries for the current user."""
    query = db.query(MoodEntry).filter(MoodEntry.user_id == current_user.id)
    
    if start_date:
        query = query.filter(MoodEntry.date >= start_date)
    if end_date:
        query = query.filter(MoodEntry.date <= end_date)
    
    mood_entries = query.order_by(MoodEntry.date.desc()).limit(limit).all()
    return mood_entries

@router.put("/mood/{mood_id}", response_model=MoodEntrySchema)
async def update_mood_entry(
    mood_id: int,
    mood_entry: MoodEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update mood entry."""
    db_mood = db.query(MoodEntry).filter(
        MoodEntry.id == mood_id,
        MoodEntry.user_id == current_user.id
    ).first()
    
    if not db_mood:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    
    for field, value in mood_entry.dict().items():
        setattr(db_mood, field, value)
    
    db.commit()
    db.refresh(db_mood)
    return db_mood

@router.delete("/mood/{mood_id}")
async def delete_mood_entry(
    mood_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete mood entry."""
    db_mood = db.query(MoodEntry).filter(
        MoodEntry.id == mood_id,
        MoodEntry.user_id == current_user.id
    ).first()
    
    if not db_mood:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    
    db.delete(db_mood)
    db.commit()
    return {"message": "Mood entry deleted successfully"}

# Health Metrics Endpoints
@router.post("/metrics", response_model=HealthMetricSchema)
async def create_health_metric(
    health_metric: HealthMetricCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new health metric entry."""
    db_metric = HealthMetric(
        user_id=current_user.id,
        **health_metric.dict()
    )
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.get("/metrics", response_model=List[HealthMetricSchema])
async def get_health_metrics(
    metric_type: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get health metrics for the current user."""
    query = db.query(HealthMetric).filter(HealthMetric.user_id == current_user.id)
    
    if metric_type:
        query = query.filter(HealthMetric.metric_type == metric_type)
    if start_date:
        query = query.filter(HealthMetric.date >= start_date)
    if end_date:
        query = query.filter(HealthMetric.date <= end_date)
    
    health_metrics = query.order_by(HealthMetric.date.desc()).limit(limit).all()
    return health_metrics

# Therapy Session Endpoints
@router.post("/therapy", response_model=TherapySessionSchema)
async def create_therapy_session(
    therapy_session: TherapySessionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new therapy session entry."""
    db_session = TherapySession(
        user_id=current_user.id,
        **therapy_session.dict()
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/therapy", response_model=List[TherapySessionSchema])
async def get_therapy_sessions(
    session_type: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get therapy sessions for the current user."""
    query = db.query(TherapySession).filter(TherapySession.user_id == current_user.id)
    
    if session_type:
        query = query.filter(TherapySession.session_type == session_type)
    if start_date:
        query = query.filter(TherapySession.created_at >= start_date)
    if end_date:
        query = query.filter(TherapySession.created_at <= end_date)
    
    therapy_sessions = query.order_by(TherapySession.created_at.desc()).limit(limit).all()
    return therapy_sessions

