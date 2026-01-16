# BRSR XBRL ESG Metrics Extractor

A comprehensive Python tool for extracting ESG (Environmental, Social, Governance) metrics from BRSR (Business Responsibility and Sustainability Reporting) XBRL filings from NSE (National Stock Exchange of India).

## Features

✨ **Robust XBRL Parsing**
- Primary parsing with Arelle (industry-standard XBRL processor)
- Automatic fallback to lxml for simpler documents
- Support for SEBI in-capmkt taxonomy (2025-05-31)

🔄 **Intelligent Fallback**
- Public ESG data sources when XBRL parsing fails
- Exponential backoff retry logic for network requests
- Comprehensive error handling and logging

📊 **Data Quality Scoring**
- Automatic quality assessment (0-100 score)
- Factors: data type, units, context, source
- Transparency in data provenance

🎯 **49 BRSR Core KPIs**
- Environmental: GHG emissions, energy, water, waste
- Social: Employees, diversity, training, safety
- Governance: Board composition, CSR, ethics

📁 **Multiple Export Formats**
- CSV (Excel-compatible)
- Parquet (efficient storage)
- JSON (API-friendly)

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. **Clone or navigate to the project directory:**
   ```powershell
   cd "c:\Users\DELL\PM-Portfolio-Shraddha\Indian XBRL extractor"
   ```

2. **Create a virtual environment (recommended):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

## Quick Start

### Web Application (New!)

The easiest way to use the extractor is via the new user-friendly web interface.

1.  **Start the App:**
    Double-click `start_app.bat` (Windows) or run:
    ```powershell
    python app.py
    ```

2.  **Open in Browser:**
    Go to `http://localhost:8000`

    Features:
    *   **URL Fetch:** Paste an NSE XBRL link to extract metrics locally.
    *   **File Upload:** Upload `.xml` or `.xbrl` files directly from your computer.
    *   **Interactive Results:** View data quality scores and metrics in a sortable table.
    *   **Export:** Download results as CSV or JSON with one click.

### Basic Usage (Library)

```python
from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging, export_outputs
from pathlib import Path

# Setup logging
setup_logging("INFO")

# Create extractor with default config
config = ParserConfig()
extractor = BRSRExtractor(config)

# Process single URL
url = "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml"
records = extractor.process_url(url)

print(f"Extracted {len(records)} ESG records")
```

### Batch Processing

```python
# Process multiple URLs
urls = [
    "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml",
    "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467642_17062025052610_WEB.xml",
]

df = extractor.process_urls(urls)

# Export to CSV, Parquet, and JSON
export_outputs(df, out_dir=Path("./output"))
```

### Command Line

```powershell
# Run the main script
python brsr_xbrl_extractor.py
```

## Configuration

### Configuration Options

```python
config = ParserConfig()
config.request_timeout = 30           # HTTP request timeout (seconds)
config.max_retries = 3                # Maximum retry attempts
config.retry_backoff_factor = 2.0     # Exponential backoff multiplier
config.verify_ssl = True              # SSL certificate verification
config.data_quality_base = 80         # Base quality score
config.enable_arelle = True           # Use Arelle parser
config.enable_public_data_fallback = True  # Fallback to public data
config.output_dir = "./output"        # Output directory
```

### Custom Configuration File

Create a `config.json`:

```json
{
  "request_timeout": 60,
  "max_retries": 5,
  "data_quality_base": 85,
  "output_dir": "./my_output"
}
```

Load it:

```python
from config import ConfigManager

manager = ConfigManager("config.json")
config = manager.get_config()
extractor = BRSRExtractor(config)
```

## BRSR Taxonomy Mapping

The extractor uses `brsr_taxonomy_mapping.json` to map XBRL QNames to standardized ESG indicators.

### Mapping Structure

```json
{
  "mappings": {
    "environmental": {
      "GreenhouseGasEmissionsScope1": {
        "indicator_name": "ghg_scope1_total",
        "description": "Total Scope 1 GHG emissions",
        "unit": "tCO2e",
        "data_type": "float",
        "category": "environmental"
      }
    }
  }
}
```

### Customizing Mappings

Edit `brsr_taxonomy_mapping.json` to:
- Add new indicators
- Update indicator names
- Change expected units or data types
- Add alternative names

## Output Format

### CSV/Parquet/JSON Schema

| Column | Type | Description |
|--------|------|-------------|
| `company_id` | string | Company identifier (CIN) |
| `company_name` | string | Company name |
| `reporting_year` | integer | Reporting year |
| `indicator_name` | string | Standardized ESG indicator |
| `indicator_value` | any | Metric value |
| `value_unit` | string | Unit of measurement |
| `data_quality_score` | integer | Quality score (0-100) |
| `data_source` | string | Source: xbrl, public_api, manual |
| `extraction_timestamp` | string | ISO 8601 timestamp |

### Example Output

```csv
company_id,company_name,reporting_year,indicator_name,indicator_value,value_unit,data_quality_score,data_source,extraction_timestamp
L12345MH2000PLC123456,Sample Company,2024,ghg_scope1_total,5000.5,tCO2e,100,xbrl,2024-01-07T20:00:00
L12345MH2000PLC123456,Sample Company,2024,employees_total,5000,count,100,xbrl,2024-01-07T20:00:00
```

## Testing

### Run All Tests

```powershell
pytest tests/ -v
```

### Run Specific Test Suite

```powershell
pytest tests/test_metric_mapper.py -v
pytest tests/test_data_quality_scorer.py -v
pytest tests/test_brsr_extractor.py -v
```

### Run with Coverage

```powershell
pytest tests/ --cov=brsr_xbrl_extractor --cov-report=html
```

## Examples

See `examples/extract_sample.py` for comprehensive usage examples:

```powershell
python examples/extract_sample.py
```

Examples include:
1. Single URL extraction
2. Batch processing
3. Local file processing
4. Custom configuration

## Project Structure

```
Indian XBRL extractor/
├── app.py                      # Web application backend (FastAPI)
├── static/                     # Web frontend assets
│   ├── index.html              # Web UI
│   ├── style.css               # Premium styles
│   └── script.js               # Frontend logic
├── start_app.bat               # Windows startup script
├── brsr_xbrl_extractor.py      # Main extractor library
├── brsr_taxonomy_mapping.json  # BRSR taxonomy mappings
├── config.py                   # Configuration management
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── tests/
│   ├── __init__.py
│   ├── test_metric_mapper.py
│   ├── test_data_quality_scorer.py
│   ├── test_brsr_extractor.py
│   └── fixtures/
│       └── sample_brsr.xml     # Sample XBRL for testing
├── examples/
│   └── extract_sample.py       # Usage examples
└── output/                     # Generated output files
```

## Troubleshooting

### Arelle Installation Issues

If Arelle fails to install:
```powershell
pip install arelle-release --no-cache-dir
```

The extractor will automatically fall back to lxml if Arelle is unavailable.

### SSL Certificate Errors

Disable SSL verification (not recommended for production):
```python
config.verify_ssl = False
```

### Network Timeouts

Increase timeout and retries:
```python
config.request_timeout = 60
config.max_retries = 5
```

### No Data Extracted

1. Check that the XBRL URL is valid and accessible
2. Verify taxonomy mapping includes the indicators you need
3. Enable debug logging: `setup_logging("DEBUG")`
4. Enable public data fallback: `config.enable_public_data_fallback = True`

## Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add more BRSR indicators to taxonomy mapping
- [ ] Implement CIN-to-ticker mapping for public data fallback
- [ ] Add support for additional public ESG data sources
- [ ] Improve error messages and logging
- [ ] Add data validation rules

## License

This project is part of the PM-Portfolio-Shraddha project.

## Acknowledgments

- SEBI for BRSR framework and taxonomy
- NSE for XBRL filing infrastructure
- Arelle project for XBRL processing
- BRSR Core framework (49 KPIs)

## Contact

For questions or issues, please create an issue in the project repository.

---

**Last Updated:** 2026-01-07
