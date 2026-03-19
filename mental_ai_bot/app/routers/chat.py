from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Message
from app.schemas import MessageCreate, Message as MessageSchema, ChatResponse
from app.auth import get_current_active_user
from app.ai_service import ai_service
import logging
from app.schemas import AIInsightResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/send", response_model=ChatResponse)
async def send_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message to the AI companion and get a response."""
    try:
        # Save user message to database
        user_message = Message(
            user_id=current_user.id,
            content=message.content,
            is_user_message=True,
            message_type=message.message_type
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)
        
        # Get user context for AI
        user_context = ai_service.get_user_context(db, current_user)
        
        # Generate AI response
        ai_response = ai_service.generate_mental_health_response(
            message.content, user_context, db, current_user
        )
        
        # Save AI response to database
        ai_message = Message(
            user_id=current_user.id,
            content=ai_response.message,
            is_user_message=False,
            message_type="text",
            sentiment_score=ai_response.sentiment_score,
            emotion_detected=ai_response.emotion_detected
        )
        db.add(ai_message)
        db.commit()
        
        return ai_response
        
    except Exception as e:
        logger.error(f"Error in send_message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message"
        )

@router.get("/history", response_model=List[MessageSchema])
async def get_chat_history(
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get chat history for the current user."""
    messages = db.query(Message).filter(
        Message.user_id == current_user.id
    ).order_by(Message.created_at.desc()).limit(limit).all()
    
    return messages

@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Clear chat history for the current user."""
    db.query(Message).filter(Message.user_id == current_user.id).delete()
    db.commit()
    
    return {"message": "Chat history cleared successfully"}

@router.get("/insights", response_model=List[AIInsightResponse])
async def get_ai_insights(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated insights based on user data."""
    try:
        insights = ai_service.generate_insights(db, current_user)
        return insights  # ✅ return the list directly
    except Exception as e:
        logger.error(f"Error generating insights: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate insights"
        )

@router.get("/suggestions")
async def get_suggestions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get suggested replies based on conversation context."""
    try:
        # Get user context
        user_context = ai_service.get_user_context(db, current_user)
        
        # Get the last message to understand context
        last_message = db.query(Message).filter(
            Message.user_id == current_user.id
        ).order_by(Message.created_at.desc()).first()
        
        if last_message:
            # Analyze the last message to get emotion
            analysis = ai_service.analyze_sentiment_and_emotion(last_message.content)
            suggestions = ai_service._generate_suggestions(analysis, user_context)
            follow_up = ai_service._generate_follow_up_questions(analysis, last_message.content)
            
            return {
                "suggestions": suggestions[:4],  # Return max 4 suggestions
                "follow_up_questions": follow_up
            }
        else:
            # Return default suggestions for new users
            return {
                "suggestions": [
                    "I'm feeling anxious",
                    "I need motivation",
                    "Help me relax",
                    "I'm stressed about work"
                ],
                "follow_up_questions": []
            }
    except Exception as e:
        logger.error(f"Error generating suggestions: {e}")
        # Return default suggestions on error
        return {
            "suggestions": [
                "I'm feeling anxious",
                "I need motivation",
                "Help me relax",
                "I'm stressed about work"
            ],
            "follow_up_questions": []
        }


