import logging
import uvicorn
from typing import List, Optional, Any
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dataclasses import asdict
import json

# Try to import the extractor logic
try:
    from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging
    EXTRACTOR_AVAILABLE = True
    IMPORT_ERROR = None
    # Setup logging
    setup_logging("INFO")
except Exception as e:
    EXTRACTOR_AVAILABLE = False
    IMPORT_ERROR = str(e)
    # Fallback logging
    logging.basicConfig(level=logging.INFO)
    print(f"CRITICAL ERROR: Failed to import brsr_xbrl_extractor: {e}")

logger = logging.getLogger("brsr_webapp")

app = FastAPI(title="BRSR XBRL ESG Extractor Premium")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Extractor if available
if EXTRACTOR_AVAILABLE:
    config = ParserConfig()
    extractor = BRSRExtractor(config)
else:
    logger.error(f"Extractor not initialized due to import error: {IMPORT_ERROR}")
    extractor = None

class ExtractionResultResponse(BaseModel):
    company_id: str
    company_name: str
    reporting_year: int
    indicator_name: str
    indicator_value: Any
    value_unit: Optional[str]
    data_quality_score: int
    data_source: str
    extraction_timestamp: str

@app.get("/")
async def root():
    status = "healthy" if EXTRACTOR_AVAILABLE else "degraded"
    return {
        "status": status,
        "service": "BRSR XBRL Extractor",
        "extractor_loaded": EXTRACTOR_AVAILABLE,
        "error": IMPORT_ERROR
    }

@app.post("/api/extract-url", response_model=List[ExtractionResultResponse])
async def extract_url(url: str = Form(...)):
    logger.info("Received URL extraction request: %s", url)
    if not EXTRACTOR_AVAILABLE:
        raise HTTPException(status_code=500, detail=f"Extractor not available: {IMPORT_ERROR}")
    
    try:
        records = extractor.process_url(url)
        return [asdict(r) for r in records]
    except Exception as e:
        logger.error("Error processing URL: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract-file", response_model=List[ExtractionResultResponse])
async def extract_file(file: UploadFile = File(...)):
    logger.info("Received file extraction request: %s", file.filename)
    if not EXTRACTOR_AVAILABLE:
        raise HTTPException(status_code=500, detail=f"Extractor not available: {IMPORT_ERROR}")

    try:
        content = await file.read()
        records = extractor.process_content(content, source_name=file.filename)
        return [asdict(r) for r in records]
    except Exception as e:
        logger.error("Error processing file: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

# Mount static files for the frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    print("Starting server at http://localhost:8000")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
