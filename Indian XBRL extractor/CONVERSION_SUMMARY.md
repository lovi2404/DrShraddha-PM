# Sample BRSR XBRL to CSV Conversion - Summary

## Conversion Results

✅ **Successfully converted** [sample_brsr.xml](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/tests/fixtures/sample_brsr.xml) to CSV format

### Output File
📄 **[sample_brsr_metrics.csv](file:///c:/Users/DELL/PM-Portfolio-Shraddha/Indian%20XBRL%20extractor/sample_brsr_metrics.csv)**
- **Location**: `c:\Users\DELL\PM-Portfolio-Shraddha\Indian XBRL extractor\sample_brsr_metrics.csv`
- **Size**: 4,969 bytes
- **Records**: 42 ESG metrics
- **Format**: UTF-8 CSV with headers

## Extracted Data Summary

### Company Information
- **Company ID**: L12345MH2000PLC123456
- **Company Name**: Sample BRSR Company Ltd
- **Reporting Year**: 2024
- **Data Source**: XBRL
- **Data Quality Score**: 100% (all metrics)

### ESG Metrics Breakdown

#### Environmental Metrics (17)
| Indicator | Value | Unit |
|-----------|-------|------|
| GHG Scope 1 Emissions | 5,000.5 | tCO2e |
| GHG Scope 2 Emissions | 3,000.25 | tCO2e |
| GHG Scope 3 Emissions | 12,000.75 | tCO2e |
| GHG Intensity | 0.0025 | tCO2e/INR |
| Total Energy Consumed | 150,000 | GJ |
| Energy Intensity | 0.0015 | GJ/INR |
| Renewable Energy | 45,000 | GJ |
| Non-Renewable Energy | 105,000 | GJ |
| Total Water Consumed | 250,000 | KL |
| Water Intensity | 0.002 | KL/INR |
| Water Discharged | 200,000 | KL |
| Plastic Waste | 50.25 | MT |
| E-Waste | 15.5 | MT |
| Hazardous Waste | 100.75 | MT |
| Non-Hazardous Waste | 500 | MT |
| Waste Recycled | 400 | MT |

#### Social Metrics (16)
| Indicator | Value | Unit |
|-----------|-------|------|
| Total Employees | 5,000 | count |
| Permanent Employees | 4,500 | count |
| Male Employees | 3,000 | count |
| Female Employees | 2,000 | count |
| Women in Workforce | 40% | percentage |
| Women in Management | 35% | percentage |
| Turnover Rate | 12.5% | percentage |
| Training Hours (Avg) | 40 | hours |
| Employees Trained on ESG | 4,800 | count |
| Workplace Accidents | 5 | count |
| LTIFR | 0.5 | rate |
| Wages Paid to Women | ₹500,000,000 | INR |
| Jobs in Small Towns | 150 | count |
| Disabled Employees | 50 | count |
| Customer Complaints | 25 | count |
| Data Privacy Breaches | 0 | count |

#### Governance Metrics (9)
| Indicator | Value | Unit |
|-----------|-------|------|
| Board Meetings | 12 | count |
| Independent Directors | 6 | count |
| Women Directors | 3 | count |
| Anti-Corruption Training | 5,000 | count |
| Ethics Violations | 2 | count |
| Supplier ESG Assessments | 100 | count |
| CSR Spending | ₹50,000,000 | INR |
| CSR Spending % | 2.5% | percentage |
| Stakeholder Sessions | 20 | count |

## CSV Format

The CSV file contains the following columns:
1. `company_id` - Company identifier (CIN)
2. `company_name` - Company name
3. `reporting_year` - Reporting year
4. `indicator_name` - Standardized ESG indicator name
5. `indicator_value` - Metric value
6. `value_unit` - Unit of measurement
7. `data_quality_score` - Quality score (0-100)
8. `data_source` - Data source (xbrl, public_api, manual)
9. `extraction_timestamp` - ISO 8601 timestamp

## Key Insights

### Environmental Performance
- **Total GHG Emissions**: 20,001.5 tCO2e (Scope 1+2+3)
- **Renewable Energy %**: 30% (45,000 / 150,000 GJ)
- **Waste Recycling Rate**: 80% (400 / 500 MT non-hazardous)

### Social Performance
- **Gender Diversity**: 40% women in workforce, 35% in management
- **Employee Engagement**: 96% trained on ESG (4,800 / 5,000)
- **Safety**: Low LTIFR of 0.5, only 5 workplace accidents

### Governance Performance
- **Board Diversity**: 50% independent directors (6/12), 25% women (3/12)
- **CSR Compliance**: 2.5% spending meets regulatory requirements
- **Ethics**: Only 2 violations reported, strong anti-corruption training

## How to Use This CSV

### Open in Excel
```powershell
Start-Process "sample_brsr_metrics.csv"
```

### Import into Python
```python
import pandas as pd
df = pd.read_csv('sample_brsr_metrics.csv')
print(df.head())
```

### Filter by Category
```python
# Environmental metrics
env_metrics = df[df['indicator_name'].str.contains('ghg|energy|water|waste')]

# Social metrics  
social_metrics = df[df['indicator_name'].str.contains('employee|women|training|accident')]

# Governance metrics
gov_metrics = df[df['indicator_name'].str.contains('board|director|csr|ethics')]
```

## Next Steps

1. **Analyze Trends**: Compare with previous years' data
2. **Benchmark**: Compare against industry peers
3. **Report**: Use for ESG reporting and disclosures
4. **Improve**: Identify areas for improvement based on metrics

---

**Generated**: 2026-01-07T21:03:10
**Tool**: BRSR XBRL ESG Metrics Extractor
