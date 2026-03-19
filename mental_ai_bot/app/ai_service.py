import google.generativeai as genai
import os
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from app.models import User, Message, SleepData, MoodEntry, HealthMetric
from app.schemas import ChatResponse, AIInsight
import re

logger = logging.getLogger(__name__)
GEMINI_API_KEY="AIzaSyBUh3q8NWKFxB7w_qk8oXLGN6Jf2InRpEY"

# Load environment variables
load_dotenv()
genai.configure(api_key="AIzaSyBUh3q8NWKFxB7w_qk8oXLGN6Jf2InRpEY")

# Use Gemini-1.5-Pro for better reasoning, or Flash for cheaper/faster results
MODEL_NAME = "gemini-2.5-flash"
model = genai.GenerativeModel(MODEL_NAME)


class MentalHealthAI:
    """Gemini-powered mental health AI companion."""

    def get_user_context(self, db: Session, user: User, days: int = 7) -> Dict[str, Any]:
        """Gather user's recent messages, moods, and health data for context."""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        recent_messages = db.query(Message).filter(
            Message.user_id == user.id, Message.created_at >= start_date
        ).order_by(Message.created_at.desc()).limit(10).all()

        recent_moods = db.query(MoodEntry).filter(
            MoodEntry.user_id == user.id, MoodEntry.date >= start_date
        ).order_by(MoodEntry.date.desc()).all()

        recent_sleep = db.query(SleepData).filter(
            SleepData.user_id == user.id, SleepData.date >= start_date
        ).order_by(SleepData.date.desc()).all()

        recent_health = db.query(HealthMetric).filter(
            HealthMetric.user_id == user.id, HealthMetric.date >= start_date
        ).order_by(HealthMetric.date.desc()).all()

        return {
            "user_info": {
                "name": f"{user.first_name} {user.last_name}" if user.first_name else user.username,
                "age": self._calculate_age(user.date_of_birth) if user.date_of_birth else None,
            },
            "recent_messages": [
                {
                    "content": msg.content,
                    "is_user": msg.is_user_message,
                    "emotion": msg.emotion_detected,
                    "sentiment": msg.sentiment_score,
                    "timestamp": msg.created_at.isoformat(),
                }
                for msg in recent_messages
            ],
            "recent_moods": [
                {
                    "date": mood.date.isoformat(),
                    "mood_score": mood.mood_score,
                    "emotions": mood.emotions,
                    "stress_level": mood.stress_level,
                    "anxiety_level": mood.anxiety_level,
                    "notes": mood.notes,
                }
                for mood in recent_moods
            ],
            "recent_sleep": [
                {
                    "date": sleep.date.isoformat(),
                    "duration": sleep.sleep_duration_hours,
                    "quality": sleep.sleep_quality_score,
                    "notes": sleep.sleep_notes,
                }
                for sleep in recent_sleep
            ],
            "recent_health": [
                {
                    "date": health.date.isoformat(),
                    "type": health.metric_type,
                    "value": health.value,
                    "unit": health.unit,
                }
                for health in recent_health
            ],
        }

    def _calculate_age(self, birth_date: datetime) -> Optional[int]:
        """Calculate age from date of birth."""
        today = datetime.now()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

    def analyze_sentiment_and_emotion(self, text: str) -> Dict[str, Any]:
        """Use Gemini to infer sentiment and emotion."""
        try:
            prompt = f"""
            Analyze the following text for emotional tone.
            Respond ONLY in JSON format with:
            {{
                "sentiment_score": number between -1 (negative) and 1 (positive),
                "emotion": one of ["happy","sad","anxious","angry","neutral","calm","excited"],
                "confidence": number between 0 and 1
            }}
            Text: "{text}"
            """
            response = model.generate_content(prompt)
            raw_output = response.text.strip()
            # ✅ Extract JSON safely (even if Gemini adds text around it)
            match = re.search(r"\{.*\}", raw_output, re.DOTALL)
            if not match:
             raise ValueError(f"Invalid Gemini output: {raw_output}")

            json_str = match.group(0)
            result = json.loads(json_str)
            return {
                "sentiment_score": result.get("sentiment_score", 0.0),
                "emotion": result.get("emotion", "neutral"),
                "confidence": result.get("confidence", 0.5),
            }
        except Exception as e:
            logger.error(f"Gemini sentiment analysis failed: {e}")
            return {"sentiment_score": 0.0, "emotion": "neutral", "confidence": 0.0}

    def generate_mental_health_response(
        self, user_message: str, user_context: Dict[str, Any], db: Session, user: User
    ) -> ChatResponse:
        """Generate an empathetic and supportive response using Gemini."""
        analysis = self.analyze_sentiment_and_emotion(user_message)
        context_prompt = self._build_context_prompt(user_context, user_message, analysis)

        try:
            response = model.generate_content(context_prompt)
            ai_text = response.text.strip()

            suggestions = self._generate_suggestions(analysis, user_context)
            follow_up = self._generate_follow_up_questions(analysis, user_message)

            return ChatResponse(
                message=ai_text,
                emotion_detected=analysis["emotion"],
                sentiment_score=analysis["sentiment_score"],
                suggestions=suggestions,
                follow_up_questions=follow_up,
            )

        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            return ChatResponse(
                message="I'm here for you. It sounds like you're going through something. Can you tell me more?",
                emotion_detected="neutral",
                sentiment_score=0.0,
                suggestions=["Try journaling your thoughts", "Take deep, mindful breaths"],
                follow_up_questions=["What’s been making you feel this way?", "How are you coping right now?"],
            )

    def _build_context_prompt(self, user_context: Dict[str, Any], user_message: str, analysis: Dict[str, Any]) -> str:
        """Build contextual prompt for Gemini."""
        prompt = f"""
        You are a compassionate mental health companion AI.

        User Info:
        Name: {user_context['user_info']['name']}
        Age: {user_context['user_info'].get('age', 'Not specified')}
        Emotion: {analysis['emotion']}
        Sentiment Score: {analysis['sentiment_score']}

        Recent message: "{user_message}"

        Respond empathetically in under 200 words.
        Include:
        1. Acknowledgment of emotion
        2. Supportive advice
        3. Encouragement
        4. A gentle follow-up question
        """
        return prompt

    def _generate_suggestions(self, analysis: Dict[str, Any], user_context: Dict[str, Any]) -> List[str]:
        """Simple suggestions based on emotion."""
        emotion = analysis.get("emotion", "neutral")
        if emotion in ["sad", "depressed"]:
            return ["Take a slow walk outdoors", "Listen to calming music", "Write down small positives today"]
        elif emotion in ["anxious", "worried"]:
            return ["Try deep breathing", "Focus on what’s in your control", "Stretch or do light exercise"]
        elif emotion in ["angry", "frustrated"]:
            return ["Pause and count to 10", "Release energy with movement", "Reflect before reacting"]
        else:
            return ["Keep nurturing your well-being", "Stay consistent with good habits", "Share positivity with others"]

    def _generate_follow_up_questions(self, analysis: Dict[str, Any], user_message: str) -> List[str]:
        """Create follow-up questions based on detected emotion."""
        emotion = analysis.get("emotion", "neutral")
        if emotion == "sad":
            return ["What has been weighing on you lately?", "Is there anything comforting that helps you?"]
        elif emotion == "anxious":
            return ["What thoughts are making you feel uneasy?", "Would grounding exercises help right now?"]
        elif emotion == "angry":
            return ["What triggered this feeling?", "How can you release this tension safely?"]
        elif emotion == "happy":
            return ["What’s been making you feel good lately?", "How can you continue this positivity?"]
        else:
            return ["How are you feeling overall?", "What would help you feel even better?"]

    def generate_insights(self, db: Session, user: User) -> List[AIInsight]:
        """Generate reflective insights using Gemini (optional enhancement)."""
        user_context = self.get_user_context(db, user, days=30)
        insight_prompt = f"""
        Based on the user's recent data (messages, moods, sleep, health),
        generate up to 3 short mental health insights or observations.
        Example: "Your mood has improved this week compared to last week."
        Data: {json.dumps(user_context)}
        """
        try:
            response = model.generate_content(insight_prompt)
            insights_text = [
                line for line in response.text.strip().split("\n")
                if line.strip() and not line.lower().startswith("here are")
            ]
            return [
                {
                   "user_id": user.id,
                    "insight_type": "reflection",
                    "title": f"Insight {i+1}",
                    "description": txt.strip(),
                    "confidence_score": 0.7,
                    "data_sources": ["user_context"],
                    "actionable_items": [],
                    "created_at": datetime.utcnow(),
                    "id": i + 1
            }
                for i, txt in enumerate(insights_text[:3])
                if txt.strip()
            ]
        except Exception as e:
            logger.error(f"Gemini insights generation failed: {e}")
            return []


# Global singleton
ai_service = MentalHealthAI()
