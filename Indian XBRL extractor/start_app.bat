@echo off
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting BRSR XBRL Intelligence App...
echo Please open http://localhost:8000 in your browser if it doesn't open automatically.
python app.py
pause
