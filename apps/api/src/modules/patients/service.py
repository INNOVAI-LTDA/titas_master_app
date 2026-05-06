from sqlalchemy.orm import Session
from .repository import PatientRepository
from .schemas import PatientCreate


class PatientService:
    def __init__(self, db: Session):
        self.repository = PatientRepository(db)

    def list_patients(self):
        return self.repository.list()

    def create_patient(self, data: PatientCreate):
        # Regras de negocio do modulo ficam aqui.
        return self.repository.create(data)
