"""
Quick script to convert sample_brsr.xml to CSV.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging, export_outputs
import pandas as pd
from dataclasses import asdict


def convert_sample_to_csv():
    """Convert sample_brsr.xml to CSV."""
    setup_logging("INFO")
    
    # Configure extractor
    config = ParserConfig()
    config.enable_arelle = False  # Use lxml
    config.output_dir = "./output/sample"
    
    extractor = BRSRExtractor(config)
    
    # Read sample file
    sample_file = Path(__file__).parent.parent / "tests" / "fixtures" / "sample_brsr.xml"
    
    print(f"Reading: {sample_file}")
    
    with open(sample_file, 'rb') as f:
        content = f.read()
    
    # Parse with lxml
    company_id, company_name, year, facts = extractor.lxml_parser.extract_facts(content)
    
    print(f"\nCompany: {company_name} ({company_id})")
    print(f"Year: {year}")
    print(f"Facts extracted: {len(facts)}")
    
    # Transform to records
    records = extractor._transform_facts_to_records(
        facts, company_id, company_name, year, "xbrl"
    )
    
    print(f"ESG records: {len(records)}")
    
    # Convert to DataFrame
    df = pd.DataFrame([asdict(r) for r in records])
    
    # Export
    output_dir = Path(config.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    csv_path = output_dir / "sample_brsr_metrics.csv"
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    
    print(f"\n✓ CSV exported to: {csv_path}")
    print(f"\nPreview of extracted metrics:")
    print(df[['indicator_name', 'indicator_value', 'value_unit', 'data_quality_score']].head(10).to_string())
    
    return csv_path


if __name__ == "__main__":
    convert_sample_to_csv()
