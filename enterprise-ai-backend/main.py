
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import uuid

app = FastAPI(title="Northstar Backend")

# Allow requests from our Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory where uploaded documents will be saved
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


@app.get("/")
def home():
    return {"message": "Northstar backend is running!"}


@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):

    # 1. Validate file extension
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and TXT files are allowed."
        )

    # 2. Generate a unique filename
    stored_filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_DIR / stored_filename

    # 3. Save the uploaded file
    size = 0

    try:
        with file_path.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)

                if size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="File exceeds the 25 MB limit."
                    )

                buffer.write(chunk)

    except Exception:
        file_path.unlink(missing_ok=True)
        raise

    finally:
        await file.close()

    # 4. Return upload information
    return {
        "message": "File uploaded successfully!",
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "size": size,
        "status": "uploaded"
    }
