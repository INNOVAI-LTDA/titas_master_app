from pydantic import BaseModel, Field


class PatientCreate(BaseModel):
    full_name: str = Field(min_length=2)
    document: str | None = None


class PatientRead(BaseModel):
    id: str
    full_name: str
    document: str | None = None
    is_active: bool = True
