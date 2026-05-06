from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from core.database.database import Base


class Patient(Base):
    __tablename__ = 'patients'

    id: Mapped[str] = mapped_column(String, primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    document: Mapped[str | None] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
