from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, date
from app.database import get_db
from app.models import User, SleepData, MoodEntry, HealthMetric, Message, TherapySession
from app.schemas import MoodAnalytics, SleepAnalytics, HealthInsights
from app.auth import get_current_active_user
from app.ai_service import ai_service
import statistics

router = APIRouter()

@router.get("/mood", response_model=MoodAnalytics)
async def get_mood_analytics(
    days: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get mood analytics for the current user."""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Get mood entries
    mood_entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id,
        MoodEntry.date >= start_date
    ).order_by(MoodEntry.date.asc()).all()
    
    if not mood_entries:
        return MoodAnalytics(
            average_mood=5.0,
            mood_trend="stable",
            common_emotions=[],
            mood_patterns={}
        )
    
    # Calculate average mood
    mood_scores = [entry.mood_score for entry in mood_entries]
    average_mood = statistics.mean(mood_scores)
    
    # Determine mood trend
    if len(mood_scores) >= 7:
        recent_avg = statistics.mean(mood_scores[-7:])  # Last week
        older_avg = statistics.mean(mood_scores[:-7]) if len(mood_scores) > 7 else recent_avg
        
        if recent_avg > older_avg + 0.5:
            mood_trend = "improving"
        elif recent_avg < older_avg - 0.5:
            mood_trend = "declining"
        else:
            mood_trend = "stable"
    else:
        mood_trend = "stable"
    
    # Get common emotions
    all_emotions = []
    for entry in mood_entries:
        if entry.emotions:
            all_emotions.extend(entry.emotions)
    
    emotion_counts = {}
    for emotion in all_emotions:
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
    
    common_emotions = [
        {"emotion": emotion, "count": count, "percentage": (count / len(all_emotions)) * 100}
        for emotion, count in sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    ]
    
    # Mood patterns
    mood_patterns = {
        "daily_average": average_mood,
        "highest_mood": max(mood_scores),
        "lowest_mood": min(mood_scores),
        "mood_volatility": statistics.stdev(mood_scores) if len(mood_scores) > 1 else 0,
        "total_entries": len(mood_entries)
    }
    
    return MoodAnalytics(
        average_mood=round(average_mood, 2),
        mood_trend=mood_trend,
        common_emotions=common_emotions,
        mood_patterns=mood_patterns
    )

@router.get("/sleep", response_model=SleepAnalytics)
async def get_sleep_analytics(
    days: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get sleep analytics for the current user."""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Get sleep data
    sleep_entries = db.query(SleepData).filter(
        SleepData.user_id == current_user.id,
        SleepData.date >= start_date
    ).order_by(SleepData.date.asc()).all()
    
    if not sleep_entries:
        return SleepAnalytics(
            average_sleep_duration=7.0,
            sleep_quality_trend="stable",
            sleep_patterns={},
            recommendations=[]
        )
    
    # Calculate average sleep duration
    sleep_durations = [entry.sleep_duration_hours for entry in sleep_entries if entry.sleep_duration_hours]
    average_sleep_duration = statistics.mean(sleep_durations) if sleep_durations else 7.0
    
    # Determine sleep quality trend
    quality_scores = [entry.sleep_quality_score for entry in sleep_entries if entry.sleep_quality_score]
    if len(quality_scores) >= 7:
        recent_avg = statistics.mean(quality_scores[-7:])  # Last week
        older_avg = statistics.mean(quality_scores[:-7]) if len(quality_scores) > 7 else recent_avg
        
        if recent_avg > older_avg + 0.5:
            sleep_quality_trend = "improving"
        elif recent_avg < older_avg - 0.5:
            sleep_quality_trend = "declining"
        else:
            sleep_quality_trend = "stable"
    else:
        sleep_quality_trend = "stable"
    
    # Sleep patterns
    sleep_patterns = {
        "average_duration": round(average_sleep_duration, 2),
        "average_quality": round(statistics.mean(quality_scores), 2) if quality_scores else 0,
        "total_entries": len(sleep_entries),
        "consistent_sleep": len([d for d in sleep_durations if 6.5 <= d <= 8.5]) / len(sleep_durations) * 100 if sleep_durations else 0
    }
    
    # Generate recommendations
    recommendations = []
    if average_sleep_duration < 6:
        recommendations.append("Try to get at least 7-8 hours of sleep per night")
    elif average_sleep_duration > 9:
        recommendations.append("Consider if you're getting too much sleep - aim for 7-9 hours")
    
    if quality_scores and statistics.mean(quality_scores) < 6:
        recommendations.extend([
            "Create a relaxing bedtime routine",
            "Avoid screens 1 hour before bed",
            "Keep your bedroom cool and dark"
        ])
    
    if sleep_patterns["consistent_sleep"] < 70:
        recommendations.append("Try to maintain a consistent sleep schedule")
    
    return SleepAnalytics(
        average_sleep_duration=round(average_sleep_duration, 2),
        sleep_quality_trend=sleep_quality_trend,
        sleep_patterns=sleep_patterns,
        recommendations=recommendations
    )

@router.get("/overall", response_model=HealthInsights)
async def get_overall_health_insights(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get overall health insights and AI-generated recommendations."""
    try:
        # Get AI insights
        ai_insights = ai_service.generate_insights(db, current_user)
        
        # Calculate overall wellness score
        wellness_score = await _calculate_wellness_score(db, current_user)
        
        # Generate recommendations based on data
        recommendations = await _generate_recommendations(db, current_user)
        
        # Identify risk factors
        risk_factors = await _identify_risk_factors(db, current_user)
        
        return HealthInsights(
            overall_wellness_score=wellness_score,
            key_insights=ai_insights,
            recommendations=recommendations,
            risk_factors=risk_factors
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate health insights"
        )

async def _calculate_wellness_score(db: Session, user: User) -> float:
    """Calculate overall wellness score based on various metrics."""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    # Get recent data
    mood_entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user.id,
        MoodEntry.date >= start_date
    ).all()
    
    sleep_entries = db.query(SleepData).filter(
        SleepData.user_id == user.id,
        SleepData.date >= start_date
    ).all()
    
    # Calculate mood component (0-40 points)
    mood_score = 0
    if mood_entries:
        avg_mood = statistics.mean([entry.mood_score for entry in mood_entries])
        mood_score = (avg_mood / 10) * 40
    
    # Calculate sleep component (0-30 points)
    sleep_score = 0
    if sleep_entries:
        durations = [entry.sleep_duration_hours for entry in sleep_entries if entry.sleep_duration_hours]
        qualities = [entry.sleep_quality_score for entry in sleep_entries if entry.sleep_quality_score]
        
        if durations:
            avg_duration = statistics.mean(durations)
            duration_score = min(15, max(0, 15 - abs(avg_duration - 7.5) * 2))
        else:
            duration_score = 0
        
        if qualities:
            avg_quality = statistics.mean(qualities)
            quality_score = (avg_quality / 10) * 15
        else:
            quality_score = 0
        
        sleep_score = duration_score + quality_score
    
    # Calculate activity component (0-20 points) - based on therapy sessions
    therapy_sessions = db.query(TherapySession).filter(
        TherapySession.user_id == user.id,
        TherapySession.created_at >= start_date
    ).all()
    
    activity_score = min(20, len(therapy_sessions) * 2)
    
    # Calculate consistency component (0-10 points)
    consistency_score = 0
    if mood_entries and len(mood_entries) >= 7:
        mood_volatility = statistics.stdev([entry.mood_score for entry in mood_entries])
        consistency_score = max(0, 10 - mood_volatility)
    
    total_score = mood_score + sleep_score + activity_score + consistency_score
    return round(total_score, 1)

async def _generate_recommendations(db: Session, user: User) -> List[str]:
    """Generate personalized recommendations based on user data."""
    recommendations = []
    
    # Get recent data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    mood_entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user.id,
        MoodEntry.date >= start_date
    ).all()
    
    sleep_entries = db.query(SleepData).filter(
        SleepData.user_id == user.id,
        SleepData.date >= start_date
    ).all()
    
    # Mood-based recommendations
    if mood_entries:
        avg_mood = statistics.mean([entry.mood_score for entry in mood_entries])
        if avg_mood < 4:
            recommendations.extend([
                "Consider speaking with a mental health professional",
                "Try to maintain social connections",
                "Engage in activities you used to enjoy"
            ])
        elif avg_mood < 6:
            recommendations.extend([
                "Practice gratitude journaling",
                "Try some gentle exercise",
                "Maintain a regular routine"
            ])
    
    # Sleep-based recommendations
    if sleep_entries:
        durations = [entry.sleep_duration_hours for entry in sleep_entries if entry.sleep_duration_hours]
        if durations:
            avg_duration = statistics.mean(durations)
            if avg_duration < 6:
                recommendations.append("Prioritize getting 7-8 hours of sleep")
            elif avg_duration > 9:
                recommendations.append("Consider if you're oversleeping")
    
    # General recommendations
    recommendations.extend([
        "Stay hydrated throughout the day",
        "Take regular breaks from screens",
        "Practice mindfulness or meditation"
    ])
    
    return recommendations[:5]  # Return top 5 recommendations

async def _identify_risk_factors(db: Session, user: User) -> List[str]:
    """Identify potential risk factors based on user data."""
    risk_factors = []
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    # Check mood patterns
    mood_entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user.id,
        MoodEntry.date >= start_date
    ).all()
    
    if mood_entries:
        mood_scores = [entry.mood_score for entry in mood_entries]
        if statistics.mean(mood_scores) < 3:
            risk_factors.append("Persistently low mood")
        
        if len(mood_scores) > 1 and statistics.stdev(mood_scores) > 3:
            risk_factors.append("High mood volatility")
    
    # Check sleep patterns
    sleep_entries = db.query(SleepData).filter(
        SleepData.user_id == user.id,
        SleepData.date >= start_date
    ).all()
    
    if sleep_entries:
        durations = [entry.sleep_duration_hours for entry in sleep_entries if entry.sleep_duration_hours]
        if durations:
            avg_duration = statistics.mean(durations)
            if avg_duration < 5:
                risk_factors.append("Chronic sleep deprivation")
    
    # Check for concerning messages
    messages = db.query(Message).filter(
        Message.user_id == user.id,
        Message.is_user_message == True,
        Message.created_at >= start_date
    ).all()
    
    concerning_keywords = ["suicide", "kill myself", "end it all", "not worth living"]
    for message in messages:
        if any(keyword in message.content.lower() for keyword in concerning_keywords):
            risk_factors.append("Expressed suicidal ideation")
            break
    
    return risk_factors
