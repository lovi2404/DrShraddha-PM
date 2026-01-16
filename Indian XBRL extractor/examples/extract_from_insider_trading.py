"""
Extract ESG data from companies listed in Insider_Trading.csv
"""

import sys
from pathlib import Path
import pandas as pd
from dataclasses import asdict

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging, export_outputs


def extract_from_insider_trading_csv():
    """Extract ESG data from companies in Insider_Trading.csv."""
    setup_logging("INFO")
    
    # Read the Insider_Trading.csv file
    csv_path = Path(__file__).parent.parent / "Insider_Trading.csv"
    
    print(f"Reading: {csv_path}")
    df_companies = pd.read_csv(csv_path)
    
    print(f"Total companies in CSV: {len(df_companies)}")
    print(f"\nColumns: {df_companies.columns.tolist()}")
    
    # Select first 2 companies with valid XBRL URLs
    selected_companies = df_companies.head(2)
    
    print("\n" + "=" * 80)
    print("Selected Companies for ESG Extraction")
    print("=" * 80)
    
    for idx, row in selected_companies.iterrows():
        print(f"\n[{idx+1}] {row['COMPANY']}")
        print(f"    Company ID: {row['Company ID']}")
        print(f"    Year: {row['YEAR']}")
        print(f"    XBRL URL: {row['XBRL']}")
    
    # Configure extractor
    config = ParserConfig()
    config.enable_arelle = False  # Use lxml
    config.output_dir = "./output/insider_trading"
    
    extractor = BRSRExtractor(config)
    
    all_records = []
    
    print("\n" + "=" * 80)
    print("Extracting ESG Metrics")
    print("=" * 80)
    
    for idx, row in selected_companies.iterrows():
        company_name = row['COMPANY']
        company_id = row['Company ID']
        year = row['YEAR']
        xbrl_url = row['XBRL']
        
        print(f"\n[{idx+1}] Processing: {company_name}")
        print(f"    URL: {xbrl_url}")
        
        try:
            records = extractor.process_url(xbrl_url)
            
            # Update company name in records
            for record in records:
                record.company_name = company_name
            
            all_records.extend(records)
            print(f"    ✓ Extracted: {len(records)} ESG records")
            
        except Exception as e:
            print(f"    ✗ Error: {str(e)[:100]}")
    
    if not all_records:
        print("\n⚠ No ESG records extracted.")
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
    output_dir = Path(config.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    export_outputs(df, output_dir)
    
    # Also create a copy in the root for easy access
    root_csv = Path("insider_trading_esg_metrics.csv")
    df.to_csv(root_csv, index=False, encoding='utf-8-sig')
    print(f"\n✓ CSV also saved to: {root_csv}")
    
    # Show sample of extracted data
    print("\n" + "=" * 80)
    print("SAMPLE EXTRACTED METRICS (First 15 records)")
    print("=" * 80)
    print(df[['company_name', 'reporting_year', 'indicator_name', 'indicator_value', 'value_unit', 'data_quality_score']].head(15).to_string(index=False))
    
    # Show breakdown by company
    print("\n" + "=" * 80)
    print("BREAKDOWN BY COMPANY")
    print("=" * 80)
    for company_name in df['company_name'].unique():
        company_df = df[df['company_name'] == company_name]
        print(f"\n{company_name}:")
        print(f"  Records: {len(company_df)}")
        print(f"  Indicators: {company_df['indicator_name'].nunique()}")
        print(f"  Year: {company_df['reporting_year'].iloc[0]}")
    
    return df


if __name__ == "__main__":
    extract_from_insider_trading_csv()
