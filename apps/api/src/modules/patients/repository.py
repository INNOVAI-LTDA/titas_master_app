from uuid import uuid4
from sqlalchemy.orm import Session
from .models import Patient
from .schemas import PatientCreate


class PatientRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Patient]:
        return self.db.query(Patient).order_by(Patient.full_name.asc()).all()

    def create(self, data: PatientCreate) -> Patient:
        patient = Patient(id=str(uuid4()), full_name=data.full_name, document=data.document)
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient
