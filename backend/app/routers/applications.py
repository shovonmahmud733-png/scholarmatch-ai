import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ApplicationModel, ScholarshipModel
from ..schemas import ApplicationTrackerItemSchema, ApplicationStage
from .scholarships import model_to_schema

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationTrackerItemSchema])
def get_user_applications(user_id: str = "demo-student-001", db: Session = Depends(get_db)):
    apps = db.query(ApplicationModel).filter(ApplicationModel.user_id == user_id).all()
    results = []
    for a in apps:
        sch = db.query(ScholarshipModel).filter(ScholarshipModel.id == a.scholarship_id).first()
        results.append(
            ApplicationTrackerItemSchema(
                id=a.id,
                scholarship_id=a.scholarship_id,
                scholarship=model_to_schema(sch) if sch else None,
                status=a.status,
                personal_notes=a.personal_notes or "",
                custom_deadline=a.custom_deadline,
                checklist=json.loads(a.checklist_json or "[]"),
                applied_date=a.applied_date,
                updated_at=a.updated_at.isoformat() if a.updated_at else None,
            )
        )
    return results

@router.post("", response_model=ApplicationTrackerItemSchema)
def create_application(app_in: ApplicationTrackerItemSchema, user_id: str = "demo-student-001", db: Session = Depends(get_db)):
    existing = db.query(ApplicationModel).filter(
        ApplicationModel.user_id == user_id,
        ApplicationModel.scholarship_id == app_in.scholarship_id
    ).first()
    
    if existing:
        existing.status = app_in.status
        existing.personal_notes = app_in.personal_notes
        existing.custom_deadline = app_in.custom_deadline
        existing.checklist_json = json.dumps([c.model_dump() for c in app_in.checklist])
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        sch = db.query(ScholarshipModel).filter(ScholarshipModel.id == existing.scholarship_id).first()
        return ApplicationTrackerItemSchema(
            id=existing.id,
            scholarship_id=existing.scholarship_id,
            scholarship=model_to_schema(sch) if sch else None,
            status=existing.status,
            personal_notes=existing.personal_notes,
            custom_deadline=existing.custom_deadline,
            checklist=json.loads(existing.checklist_json or "[]"),
            updated_at=existing.updated_at.isoformat()
        )

    new_app = ApplicationModel(
        id=app_in.id or f"app_{int(datetime.utcnow().timestamp()*1000)}",
        user_id=user_id,
        scholarship_id=app_in.scholarship_id,
        status=app_in.status,
        personal_notes=app_in.personal_notes,
        custom_deadline=app_in.custom_deadline,
        checklist_json=json.dumps([c.model_dump() for c in app_in.checklist]),
        updated_at=datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    sch = db.query(ScholarshipModel).filter(ScholarshipModel.id == new_app.scholarship_id).first()
    return ApplicationTrackerItemSchema(
        id=new_app.id,
        scholarship_id=new_app.scholarship_id,
        scholarship=model_to_schema(sch) if sch else None,
        status=new_app.status,
        personal_notes=new_app.personal_notes,
        custom_deadline=new_app.custom_deadline,
        checklist=json.loads(new_app.checklist_json or "[]"),
        updated_at=new_app.updated_at.isoformat()
    )

@router.delete("/{application_id}")
def delete_application(application_id: str, db: Session = Depends(get_db)):
    app_obj = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app_obj)
    db.commit()
    return {"status": "success", "message": "Application removed"}
