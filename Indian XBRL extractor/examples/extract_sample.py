"""
Example script demonstrating BRSR XBRL extractor usage.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging, export_outputs


def example_single_url():
    """Example: Extract ESG metrics from a single XBRL URL."""
    print("=" * 80)
    print("Example 1: Single URL Extraction")
    print("=" * 80)
    
    setup_logging("INFO")
    
    # Configure extractor
    config = ParserConfig()
    config.enable_arelle = False  # Use lxml for simplicity
    config.output_dir = "./output/single"
    
    extractor = BRSRExtractor(config)
    
    # Process single URL
    url = "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml"
    records = extractor.process_url(url)
    
    print(f"\nExtracted {len(records)} ESG records")
    
    if records:
        print("\nSample records:")
        for record in records[:5]:
            print(f"  - {record.indicator_name}: {record.indicator_value} {record.value_unit or ''}")


def example_batch_processing():
    """Example: Extract ESG metrics from multiple XBRL URLs."""
    print("\n" + "=" * 80)
    print("Example 2: Batch Processing")
    print("=" * 80)
    
    setup_logging("INFO")
    
    # Configure extractor
    config = ParserConfig()
    config.output_dir = "./output/batch"
    
    extractor = BRSRExtractor(config)
    
    # Process multiple URLs
    urls = [
        "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml",
        "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467642_17062025052610_WEB.xml",
    ]
    
    df = extractor.process_urls(urls)
    
    if not df.empty:
        print(f"\nExtracted {len(df)} total records")
        print(f"Companies: {df['company_id'].nunique()}")
        print(f"Indicators: {df['indicator_name'].nunique()}")
        print(f"\nData quality summary:")
        print(df['data_quality_score'].describe())
        
        # Export results
        export_outputs(df, Path(config.output_dir))


def example_local_file():
    """Example: Extract ESG metrics from a local XBRL file."""
    print("\n" + "=" * 80)
    print("Example 3: Local File Processing")
    print("=" * 80)
    
    setup_logging("INFO")
    
    # Use sample fixture
    sample_file = Path(__file__).parent.parent / "tests" / "fixtures" / "sample_brsr.xml"
    
    if not sample_file.exists():
        print(f"Sample file not found: {sample_file}")
        return
    
    config = ParserConfig()
    config.enable_arelle = False
    config.output_dir = "./output/local"
    
    extractor = BRSRExtractor(config)
    
    # Read local file
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
    
    if records:
        print("\nSample ESG metrics:")
        for record in records[:10]:
            print(f"  - {record.indicator_name}: {record.indicator_value} {record.value_unit or ''}")


def example_custom_config():
    """Example: Using custom configuration."""
    print("\n" + "=" * 80)
    print("Example 4: Custom Configuration")
    print("=" * 80)
    
    setup_logging("DEBUG")  # More verbose logging
    
    # Create custom configuration
    config = ParserConfig()
    config.request_timeout = 60  # Longer timeout
    config.max_retries = 5  # More retries
    config.retry_backoff_factor = 1.5  # Slower backoff
    config.data_quality_base = 85  # Higher base quality score
    config.enable_public_data_fallback = True  # Enable fallback
    config.output_dir = "./output/custom"
    
    extractor = BRSRExtractor(config)
    
    print("\nCustom configuration:")
    print(f"  Timeout: {config.request_timeout}s")
    print(f"  Max retries: {config.max_retries}")
    print(f"  Base quality score: {config.data_quality_base}")
    print(f"  Public data fallback: {config.enable_public_data_fallback}")


if __name__ == "__main__":
    # Run all examples
    try:
        example_single_url()
    except Exception as e:
        print(f"Example 1 failed: {e}")
    
    try:
        example_batch_processing()
    except Exception as e:
        print(f"Example 2 failed: {e}")
    
    try:
        example_local_file()
    except Exception as e:
        print(f"Example 3 failed: {e}")
    
    try:
        example_custom_config()
    except Exception as e:
        print(f"Example 4 failed: {e}")
    
    print("\n" + "=" * 80)
    print("Examples complete!")
    print("=" * 80)
