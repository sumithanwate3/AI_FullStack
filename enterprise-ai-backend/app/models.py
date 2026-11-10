
import uuid

from sqlalchemy import String, BigInteger, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Uuid

from app.database import Base


class Document(Base):

    __tablename__ = "documents"

    # Unique identifier
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # Original filename
    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # Unique filename stored on the server
    stored_filename: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    # File information
    file_size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False
    )

    file_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    # Actual storage location
    storage_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    # Upload status
    status: Mapped[str] = mapped_column(
        String(30),
        default="uploaded",
        nullable=False
    )

    # Upload timestamp
    uploaded_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
