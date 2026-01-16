# Insider Trading CSV - ESG Metrics Extraction Summary

## Overview

Successfully extracted ESG metrics from **2 companies** listed in the Insider_Trading.csv file, which contains **2,281 NSE-listed companies** with BRSR XBRL filings.

**Extraction Date**: 2026-01-07T22:43:26  
**Source**: Insider_Trading.csv  
**Output File**: [insider_trading_esg_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/insider_trading_esg_metrics.csv)  
**Total Records**: 177 ESG metrics  
**Data Quality**: 100% average score (all from XBRL source)

---

## Companies Extracted

### Company 1: International Gemmological Institute (India) Limited

**Company Details:**
- **Company Name**: International Gemmological Institute (India) Limited
- **CIN**: L46591MH1999PLC118476
- **Reporting Year**: 2023
- **State**: Maharashtra (incorporated 1999)
- **XBRL URL**: [View File](https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml)

**ESG Metrics Extracted:**
- **Total Records**: 83
- **Unique Indicators**: 13
- **Data Quality Score**: 100%

**Key Metrics:**
- Employee Turnover Rates: 0.12 - 0.20 (12-20%)
- Male Employees: 369, 341
- Energy Consumption: 2,081.3 - 2,045.47 GJ
- Energy Intensity: 2.65e-07 to 6.49 GJ/INR
- Water Intensity: 1.34e-06 to 27.63 KL/INR
- Zero waste in all categories (plastic, e-waste, biomedical, hazardous)
- LTIFR: 0.0 (excellent safety record)

### Company 2: Sanghi Industries Limited

**Company Details:**
- **Company Name**: Sanghi Industries Limited
- **CIN**: L18209GJ1985PLC157787
- **Reporting Year**: 2024
- **State**: Gujarat (incorporated 1985)
- **XBRL URL**: [View File](https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467642_17062025052610_WEB.xml)

**ESG Metrics Extracted:**
- **Total Records**: 94
- **Unique Indicators**: 13
- **Data Quality Score**: 100%

**Key Metrics:**
- Employee Turnover Rates: 0.20 - 1.0 (20-100%)
- Energy Consumption: 12,560,874.57 GJ (large industrial operation)
- Energy Intensity: 0.0013 to 4.76 GJ/INR
- Water Discharged: 2,603,917 - 2,278,291 KL
- Plastic Waste: 89.03 - 1,440 MT
- Biomedical Waste: 0.15 - 0.03 MT
- Hazardous Waste: 91,319.47 - 48,983 MT (significant industrial waste)
- LTIFR: 0.73 - 0.94 (moderate safety performance)

---

## ESG Indicators Mapped

The following 13 BRSR Core KPIs were successfully extracted:

### Environmental Metrics (8)
1. `energy_total` - Total energy consumed (GJ)
2. `energy_intensity` - Energy intensity per revenue (GJ/INR)
3. `water_intensity` - Water consumption intensity (KL/INR)
4. `water_discharged` - Water discharged (KL)
5. `waste_plastic` - Plastic waste generated (MT)
6. `waste_ewaste` - E-waste generated (MT)
7. `waste_biomedical` - Biomedical waste (MT)
8. `waste_hazardous` - Hazardous waste (MT)

### Social Metrics (5)
9. `employees_total` - Total employees (count)
10. `employees_permanent` - Permanent employees (count)
11. `employees_male` - Male employees (count)
12. `turnover_rate` - Employee turnover rate (percentage)
13. `ltifr` - Lost Time Injury Frequency Rate

---

## Comparative Analysis

| Metric | Company 1 (IGI India) | Company 2 (Sanghi Industries) |
|--------|----------------------|-------------------------------|
| **Year** | 2023 | 2024 |
| **Records** | 83 | 94 |
| **Energy (GJ)** | ~2,081 | ~12.5M |
| **Water Discharged (KL)** | 0 | ~2.6M |
| **Plastic Waste (MT)** | 0 | 89-1,440 |
| **Hazardous Waste (MT)** | 0 | 48,983-91,319 |
| **LTIFR** | 0.0 | 0.73-0.94 |
| **Turnover Rate** | 12-20% | 20-100% |

**Key Observations:**
- **Company 2 (Sanghi Industries)** is a large industrial operation (likely cement/construction materials) with significant environmental footprint
- **Company 1 (IGI India)** is a smaller service-oriented business (gemological testing) with minimal environmental impact
- Both companies have 100% data quality scores from XBRL sources

---

## Insider_Trading.csv Overview

**Total Companies**: 2,281  
**Columns**: COMPANY, FROM YEAR, YEAR, ATTACHMENT, XBRL, ORIGINAL SUBMISSION DATE, Company ID

**Sample Companies Available:**
1. International Gemmological Institute (India) Limited
2. Sanghi Industries Limited
3. Network18 Media & Investments Limited
4. Jupiter Life Line Hospitals Limited
5. Dalmia Bharat Sugar and Industries Limited
6. TATA COMMUNICATIONS LIMITED
7. ALEMBIC PHARMACEUTICALS LIMITED
8. ADANI POWER LIMITED
9. Kalpataru Projects International Limited
10. ... and 2,271 more companies

---

## Output Files Generated

1. **[insider_trading_esg_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/insider_trading_esg_metrics.csv)** - Main CSV (24 KB, 177 records)
2. **[output/insider_trading/brsr_esg_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/output/insider_trading/brsr_esg_metrics.csv)** - Same data in output directory
3. **[output/insider_trading/brsr_esg_metrics.json](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/output/insider_trading/brsr_esg_metrics.json)** - JSON format
4. **[output/insider_trading/brsr_esg_metrics.parquet](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/output/insider_trading/brsr_esg_metrics.parquet)** - Parquet format

---

## CSV Format

| Column | Description | Example |
|--------|-------------|---------|
| `company_id` | Company CIN | L46591MH1999PLC118476 |
| `company_name` | Company name from CSV | International Gemmological Institute (India) Limited |
| `reporting_year` | Fiscal year | 2023, 2024 |
| `indicator_name` | Standardized ESG metric | turnover_rate, energy_total |
| `indicator_value` | Metric value | 0.12, 2081.3 |
| `value_unit` | Unit of measurement | percentage, GJ, KL, MT |
| `data_quality_score` | Quality score (0-100) | 100 |
| `data_source` | Data source | xbrl |
| `extraction_timestamp` | ISO 8601 timestamp | 2026-01-07T22:43:26.837435 |

---

## Next Steps

### To Extract More Companies
Modify `extract_from_insider_trading.py` to process more companies:

```python
# Change this line to extract more companies
selected_companies = df_companies.head(10)  # Extract first 10 companies
```

### To Filter Specific Industries
Filter the Insider_Trading.csv by company name or CIN patterns:

```python
# Example: Extract only cement companies
cement_companies = df_companies[df_companies['COMPANY'].str.contains('Cement|Industries', case=False)]
```

### To Process All Companies
**Warning**: Processing all 2,281 companies will take significant time and resources:

```python
# Process all companies (use with caution)
selected_companies = df_companies  # All 2,281 companies
```

---

## Usage Example

```python
import pandas as pd

# Load the extracted data
df = pd.read_csv('insider_trading_esg_metrics.csv')

# Filter by company
igi_data = df[df['company_name'].str.contains('International Gemmological')]
sanghi_data = df[df['company_name'].str.contains('Sanghi')]

# Analyze energy metrics
energy_metrics = df[df['indicator_name'] == 'energy_total']
print(energy_metrics[['company_name', 'indicator_value', 'value_unit']])

# Compare turnover rates
turnover = df[df['indicator_name'] == 'turnover_rate']
avg_turnover = turnover.groupby('company_name')['indicator_value'].mean()
print(avg_turnover)
```

---

## Summary Statistics

```
Total Records: 177
Companies: 2
Reporting Years: 2023, 2024
Unique Indicators: 13
Average Data Quality Score: 100.0
Data Source: 100% XBRL
```

**Extraction Success Rate**: 100% (both companies processed successfully)

---

**Generated**: 2026-01-07T22:43:26+05:30  
**Tool**: BRSR XBRL ESG Metrics Extractor  
**Source CSV**: [Insider_Trading.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/Insider_Trading.csv)  
**Extraction Script**: [extract_from_insider_trading.py](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/examples/extract_from_insider_trading.py)
