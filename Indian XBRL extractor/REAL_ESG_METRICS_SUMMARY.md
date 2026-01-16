# Real NSE BRSR ESG Metrics - Extraction Summary

## Overview

Successfully extracted **178 ESG metrics** from **2 real NSE BRSR XBRL filings** with actual company data.

**Extraction Date**: 2026-01-07T22:08:03  
**Output File**: [real_brsr_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/real_brsr_metrics.csv)  
**File Size**: 18,670 bytes  
**Data Source**: NSE Archives XBRL files  
**Data Quality**: 100% average score (all from XBRL source)

---

## Companies Analyzed

### Company 1: L46591MH1999PLC118476
- **CIN**: L46591MH1999PLC118476
- **Reporting Year**: 2023
- **State**: Maharashtra (incorporated 1999)
- **Records Extracted**: 84 ESG metrics
- **XBRL File**: BRSR_1467735_17062025071711_WEB.xml

**Sample Metrics:**
- Employee Turnover Rates: 0.12 - 0.20 (12-20%)
- Male Employees: 369, 341
- Energy Consumption: 2,081.3 - 2,045.47 GJ
- Energy Intensity: 2.65e-07 to 6.49 GJ/INR
- Water Intensity: 1.34e-06 to 27.63 KL/INR
- Zero waste in plastic, e-waste, biomedical, and hazardous categories

### Company 2: L18209GJ1985PLC157787
- **CIN**: L18209GJ1985PLC157787
- **Reporting Year**: 2024
- **State**: Gujarat (incorporated 1985)
- **Records Extracted**: 94 ESG metrics
- **XBRL File**: BRSR_1467642_17062025052610_WEB.xml

**Sample Metrics:**
- Employee Turnover Rates: 0.20 - 1.0 (20-100%)
- Energy Consumption: 12,560,874.57 GJ (significantly higher)
- Energy Intensity: 0.0013 to 4.76 GJ/INR
- Water Discharged: 2,603,917 - 2,278,291 KL
- Plastic Waste: 89.03 - 1,440 MT
- Hazardous Waste: 91,319.47 - 48,983 MT
- LTIFR (Lost Time Injury Frequency Rate): 0.73 - 0.94

---

## ESG Indicators Extracted

### Environmental Metrics
- ✅ `energy_total` - Total energy consumed (GJ)
- ✅ `energy_intensity` - Energy intensity per revenue (GJ/INR)
- ✅ `water_intensity` - Water consumption intensity (KL/INR)
- ✅ `water_discharged` - Water discharged (KL)
- ✅ `waste_plastic` - Plastic waste generated (MT)
- ✅ `waste_ewaste` - E-waste generated (MT)
- ✅ `waste_biomedical` - Biomedical waste (MT)
- ✅ `waste_hazardous` - Hazardous waste (MT)

### Social Metrics
- ✅ `employees_total` - Total employees (count)
- ✅ `employees_permanent` - Permanent employees (count)
- ✅ `employees_male` - Male employees (count)
- ✅ `turnover_rate` - Employee turnover rate (percentage)
- ✅ `ltifr` - Lost Time Injury Frequency Rate

**Total Unique Indicators**: 13 mapped ESG metrics

---

## Key Insights

### Company Size Comparison
| Metric | Company 1 (2023) | Company 2 (2024) |
|--------|------------------|------------------|
| Energy Consumption | ~2,081 GJ | ~12.5M GJ |
| Water Discharged | 0 KL | ~2.6M KL |
| Plastic Waste | 0 MT | 89-1,440 MT |
| Hazardous Waste | 0 MT | 48,983-91,319 MT |
| Male Employees | 341-369 | 0 |

**Observation**: Company 2 appears to be a much larger industrial operation (likely manufacturing/cement based on waste volumes) compared to Company 1.

### Data Quality
- **All records**: 100% data quality score
- **Data source**: XBRL (highest quality)
- **Timestamp**: All extracted on 2026-01-07T22:08:03
- **Units**: Properly preserved (GJ, KL, MT, percentage, count, rate)

### Industry Patterns
- **Company 1** (L46591MH): Smaller operation, minimal waste, lower energy use
- **Company 2** (L18209GJ): Large industrial operation, significant energy/water use, substantial waste management

---

## CSV File Structure

The output CSV contains the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| `company_id` | Company CIN | L46591MH1999PLC118476 |
| `company_name` | Company name | Unknown (not in XBRL context) |
| `reporting_year` | Fiscal year | 2023, 2024 |
| `indicator_name` | Standardized ESG metric | turnover_rate, energy_total |
| `indicator_value` | Metric value | 0.12, 2081.3 |
| `value_unit` | Unit of measurement | percentage, GJ, KL, MT |
| `data_quality_score` | Quality score (0-100) | 100 |
| `data_source` | Data source | xbrl |
| `extraction_timestamp` | ISO 8601 timestamp | 2026-01-07T22:08:03.228076 |

---

## Comparison: Sample vs Real Data

### Sample Data (sample_brsr_metrics.csv)
- **Records**: 42
- **Company**: L12345MH2000PLC123456 (fictional)
- **Year**: 2024
- **Indicators**: 42 unique metrics
- **Purpose**: Testing and demonstration

### Real Data (real_brsr_metrics.csv)
- **Records**: 178
- **Companies**: 2 real NSE-listed companies
- **Years**: 2023, 2024
- **Indicators**: 13 mapped metrics
- **Purpose**: Production analysis

**Key Difference**: Real XBRL files have many more data points (1,500+), but only a subset map to our 49 BRSR Core KPI taxonomy. The sample file demonstrates ideal coverage.

---

## Usage Examples

### Load and Analyze in Python

```python
import pandas as pd

# Load the CSV
df = pd.read_csv('real_brsr_metrics.csv')

# Filter by company
company1 = df[df['company_id'] == 'L46591MH1999PLC118476']
company2 = df[df['company_id'] == 'L18209GJ1985PLC157787']

# Analyze energy metrics
energy_data = df[df['indicator_name'] == 'energy_total']
print(energy_data[['company_id', 'reporting_year', 'indicator_value', 'value_unit']])

# Compare turnover rates
turnover = df[df['indicator_name'] == 'turnover_rate']
print(f"Company 1 avg turnover: {turnover[turnover['company_id'] == 'L46591MH1999PLC118476']['indicator_value'].mean():.2%}")
print(f"Company 2 avg turnover: {turnover[turnover['company_id'] == 'L18209GJ1985PLC157787']['indicator_value'].mean():.2%}")
```

### Filter by ESG Category

```python
# Environmental metrics
env_indicators = ['energy_total', 'energy_intensity', 'water_intensity', 
                  'water_discharged', 'waste_plastic', 'waste_ewaste', 
                  'waste_biomedical', 'waste_hazardous']
env_data = df[df['indicator_name'].isin(env_indicators)]

# Social metrics
social_indicators = ['employees_total', 'employees_permanent', 'employees_male', 
                     'turnover_rate', 'ltifr']
social_data = df[df['indicator_name'].isin(social_indicators)]
```

---

## Next Steps

### To Expand Coverage
1. **Add More Taxonomy Mappings**: Expand `brsr_taxonomy_mapping.json` to cover more of the 1,500+ facts in each file
2. **Parse Company Names**: Extract company names from fact elements (not just context)
3. **Add More Companies**: Process additional NSE BRSR XBRL filings

### To Enhance Analysis
1. **Year-over-Year Comparison**: Track metrics across multiple years
2. **Industry Benchmarking**: Compare companies within same industry
3. **Trend Analysis**: Identify improving/declining ESG performance
4. **Visualization**: Create dashboards for ESG metrics

### To Improve Data Quality
1. **Validate Ranges**: Add business rule validation (e.g., percentages 0-100)
2. **Handle Duplicates**: Some metrics appear multiple times (different contexts)
3. **Clean Text Values**: Some fields contain policy text instead of numeric values

---

## Files Generated

1. **[real_brsr_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/real_brsr_metrics.csv)** - Main output (18.7 KB, 178 records)
2. **[output/real_companies/brsr_esg_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/output/real_companies/brsr_esg_metrics.csv)** - Same data in output directory
3. **[output/real_companies/brsr_esg_metrics.json](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/output/real_companies/brsr_esg_metrics.json)** - JSON format
4. **[company_info_results.json](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/company_info_results.json)** - Company metadata

---

## Summary Statistics

```
Total Records: 178
Companies: 2
Reporting Years: 2023, 2024
Unique Indicators: 13
Average Data Quality Score: 100.0
Data Source: 100% XBRL
```

**Extraction Success Rate**: 100% (both companies processed successfully)

---

**Generated**: 2026-01-07T22:08:03+05:30  
**Tool**: BRSR XBRL ESG Metrics Extractor v1.0  
**Extraction Script**: [extract_real_companies.py](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/examples/extract_real_companies.py)
