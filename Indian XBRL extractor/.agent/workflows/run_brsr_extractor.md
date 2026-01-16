---
description: Run BRSR XBRL ESG metrics extractor
---

# Run BRSR XBRL Extractor

This workflow guides you through running the BRSR XBRL ESG metrics extractor.

## Prerequisites

Ensure you're in the project directory:
```powershell
cd "c:\Users\DELL\PM-Portfolio-Shraddha\Indian XBRL extractor"
```

## Steps

### 1. Create and activate virtual environment (first time only)

```powershell
python -m venv venv
```

### 2. Activate virtual environment

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies (first time only)

// turbo
```powershell
pip install -r requirements.txt
```

### 4. Run tests to verify installation

// turbo
```powershell
python -m pytest tests/ -v
```

### 5. Run example script

```powershell
python examples/extract_sample.py
```

### 6. Run main extractor with default URLs

```powershell
python brsr_xbrl_extractor.py
```

### 7. Check output files

```powershell
Get-ChildItem -Path .\output -Recurse
```

Expected output files:
- `brsr_esg_metrics.csv`
- `brsr_esg_metrics.parquet`
- `brsr_esg_metrics.json`

### 8. View CSV output

```powershell
Get-Content .\output\brsr_esg_metrics.csv | Select-Object -First 20
```

## Customization

### Process custom URLs

Edit `brsr_xbrl_extractor.py` and modify the `urls` list in the `main()` function:

```python
urls = [
    "https://nsearchives.nseindia.com/corporate/xbrl/YOUR_FILE.xml",
]
```

### Adjust configuration

Create a custom `config.json` and load it:

```python
from config import ConfigManager
manager = ConfigManager("config.json")
config = manager.get_config()
```

## Troubleshooting

If you encounter errors:

1. **Check Python version:** `python --version` (should be 3.8+)
2. **Reinstall dependencies:** `pip install -r requirements.txt --force-reinstall`
3. **Enable debug logging:** Edit script and change `setup_logging("DEBUG")`
4. **Check network connectivity:** Ensure you can access NSE archives

## Deactivate virtual environment

When done:
```powershell
deactivate
```
