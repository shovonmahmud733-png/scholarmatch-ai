from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ScholarshipModel, RecommendationFeedbackModel
from ..schemas import (
    MatchRequest,
    BatchRankRequest,
    RecommendationResultSchema,
    FeedbackCreate
)
from ..services.recommendation_engine import (
    evaluate_scholarship_match,
    rank_scholarships_for_profile
)
from .scholarships import model_to_schema

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("/match", response_model=RecommendationResultSchema)
def match_single_scholarship(req: MatchRequest, db: Session = Depends(get_db)):
    m = db.query(ScholarshipModel).filter(ScholarshipModel.id == req.scholarship_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    sch_schema = model_to_schema(m)
    return evaluate_scholarship_match(sch_schema, req.profile)

@router.post("/rank", response_model=List[RecommendationResultSchema])
def rank_scholarships(req: BatchRankRequest, db: Session = Depends(get_db)):
    query_obj = db.query(ScholarshipModel)
    if req.scholarship_ids:
        query_obj = query_obj.filter(ScholarshipModel.id.in_(req.scholarship_ids))
    
    scholarships = [model_to_schema(m) for m in query_obj.all()]
    return rank_scholarships_for_profile(scholarships, req.profile)

@router.post("/feedback")
def submit_feedback(fb: FeedbackCreate, db: Session = Depends(get_db)):
    m = RecommendationFeedbackModel(
        id=f"fb_{datetime.utcnow().timestamp()}",
        user_id="anonymous",
        scholarship_id=fb.scholarship_id,
        feedback_type=fb.feedback_type,
        notes=fb.notes
    )
    db.add(m)
    db.commit()
    return {"status": "success", "message": "Feedback recorded for engine calibration"}
