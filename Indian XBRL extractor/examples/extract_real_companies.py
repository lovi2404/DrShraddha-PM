"""
Extract ESG metrics from real NSE BRSR XBRL files and create CSV output.
"""

import sys
from pathlib import Path
import pandas as pd
from dataclasses import asdict

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging, export_outputs


def extract_real_company_data():
    """Extract ESG metrics from real NSE BRSR XBRL files."""
    setup_logging("INFO")
    
    # Real NSE XBRL URLs with company information
    urls = [
        {
            'url': "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml",
            'cin': "L46591MH1999PLC118476",
            'year': 2023
        },
        {
            'url': "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467642_17062025052610_WEB.xml",
            'cin': "L18209GJ1985PLC157787",
            'year': 2024
        }
    ]
    
    # Configure extractor
    config = ParserConfig()
    config.enable_arelle = False
    config.output_dir = "./output/real_companies"
    
    extractor = BRSRExtractor(config)
    
    print("=" * 80)
    print("Extracting ESG Metrics from Real NSE BRSR XBRL Files")
    print("=" * 80)
    
    all_records = []
    
    for i, company_info in enumerate(urls, 1):
        url = company_info['url']
        print(f"\n[{i}] Processing: {url.split('/')[-1]}")
        print(f"    CIN: {company_info['cin']}")
        print(f"    Year: {company_info['year']}")
        print("-" * 80)
        
        try:
            records = extractor.process_url(url)
            all_records.extend(records)
            print(f"    Extracted: {len(records)} ESG records")
            
        except Exception as e:
            print(f"    ERROR: {e}")
    
    if not all_records:
        print("\nNo ESG records extracted.")
        return None
    
    # Convert to DataFrame
    df = pd.DataFrame([asdict(r) for r in all_records])
    
    print("\n" + "=" * 80)
    print("EXTRACTION SUMMARY")
    print("=" * 80)
    print(f"Total records: {len(df)}")
    print(f"Companies: {df['company_id'].nunique()}")
    print(f"Unique indicators: {df['indicator_name'].nunique()}")
    print(f"Average quality score: {df['data_quality_score'].mean():.1f}")
    
    # Export results
    export_outputs(df, Path(config.output_dir))
    
    # Also create a copy in the root for easy access
    root_csv = Path("real_brsr_metrics.csv")
    df.to_csv(root_csv, index=False, encoding='utf-8-sig')
    print(f"\n[OK] CSV also saved to: {root_csv}")
    
    # Show sample of extracted data
    print("\n" + "=" * 80)
    print("SAMPLE EXTRACTED METRICS (First 10 records)")
    print("=" * 80)
    print(df[['company_id', 'reporting_year', 'indicator_name', 'indicator_value', 'value_unit', 'data_quality_score']].head(10).to_string(index=False))
    
    return df


if __name__ == "__main__":
    extract_real_company_data()
