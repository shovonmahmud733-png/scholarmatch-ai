import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ScholarshipModel
from ..schemas import ScholarshipSchema

router = APIRouter(prefix="/api/scholarships", tags=["Scholarships"])

def model_to_schema(m: ScholarshipModel) -> ScholarshipSchema:
    return ScholarshipSchema(
        id=m.id,
        title=m.title,
        provider=m.provider,
        host_university=m.host_university,
        destination_country=m.destination_country,
        destination_city=m.destination_city,
        eligible_nationalities=json.loads(m.eligible_nationalities_json or "[]"),
        target_degrees=json.loads(m.target_degrees_json or "[]"),
        eligible_subjects=json.loads(m.eligible_subjects_json or "[]"),
        academic_requirements=json.loads(m.academic_requirements_json or "{}"),
        language_requirements=json.loads(m.language_requirements_json or "{}"),
        funding_details=json.loads(m.funding_details_json or "{}"),
        application_open_date=m.application_open_date,
        application_deadline=m.application_deadline,
        intake_year=m.intake_year,
        official_url=m.official_url,
        source_url=m.source_url,
        last_verified_at=m.last_verified_at,
        publication_status=m.publication_status,
        is_verified_data=m.is_verified_data,
        selection_criteria=json.loads(m.selection_criteria_json or "[]"),
        application_procedure=json.loads(m.application_procedure_json or "[]"),
        required_documents=json.loads(m.required_documents_json or "[]"),
        overview=m.overview,
        competitiveness=m.competitiveness,
        tags=json.loads(m.tags_json or "[]"),
    )

@router.get("", response_model=List[ScholarshipSchema])
def get_scholarships(
    query: Optional[str] = Query(None, description="Search keyword"),
    country: Optional[str] = Query(None, description="Destination country filter"),
    degree: Optional[str] = Query(None, description="Degree level filter"),
    funding: Optional[str] = Query(None, description="Funding type filter"),
    db: Session = Depends(get_db)
):
    query_obj = db.query(ScholarshipModel)
    if country:
        query_obj = query_obj.filter(ScholarshipModel.destination_country == country)
    
    scholarships = query_obj.all()
    results = [model_to_schema(s) for s in scholarships]

    if query:
        q = query.lower()
        results = [
            s for s in results
            if q in s.title.lower()
            or q in s.provider.lower()
            or q in s.destination_country.lower()
            or q in s.overview.lower()
            or any(q in sub.lower() for sub in s.eligible_subjects)
            or any(q in tag.lower() for tag in s.tags)
        ]

    if degree:
        results = [s for s in results if degree in s.target_degrees]

    if funding:
        results = [s for s in results if s.funding_details.funding_type == funding]

    return results

@router.get("/{scholarship_id}", response_model=ScholarshipSchema)
def get_scholarship_detail(scholarship_id: str, db: Session = Depends(get_db)):
    m = db.query(ScholarshipModel).filter(ScholarshipModel.id == scholarship_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return model_to_schema(m)
