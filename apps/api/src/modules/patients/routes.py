from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database.database import get_db
from .schemas import PatientCreate, PatientRead
from .service import PatientService

router = APIRouter()


@router.get('', response_model=list[PatientRead])
def list_patients(db: Session = Depends(get_db)):
    return PatientService(db).list_patients()


@router.post('', response_model=PatientRead)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    return PatientService(db).create_patient(payload)
