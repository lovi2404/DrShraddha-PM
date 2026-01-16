"""
Extract company ID, name, and year from real NSE BRSR XBRL files - Simple version.
"""

import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from brsr_xbrl_extractor import BRSRExtractor, ParserConfig, setup_logging


def main():
    """Extract company information from real NSE XBRL URLs."""
    setup_logging("WARNING")  # Reduce log noise
    
    # Real NSE XBRL URLs
    urls = [
        "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml",
        "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467642_17062025052610_WEB.xml",
    ]
    
    # Configure extractor
    config = ParserConfig()
    config.enable_arelle = False
    
    extractor = BRSRExtractor(config)
    
    print("Extracting Company Information from NSE BRSR XBRL Files")
    print("=" * 70)
    
    results = []
    
    for i, url in enumerate(urls, 1):
        print(f"\n[{i}] Fetching: {url.split('/')[-1]}")
        
        try:
            content = extractor.fetcher.fetch(url)
            company_id, company_name, year, facts = extractor.lxml_parser.extract_facts(content)
            
            result = {
                'company_id': company_id,
                'company_name': company_name or 'Not Available',
                'reporting_year': year,
                'facts_count': len(facts),
                'url': url
            }
            
            results.append(result)
            
            print(f"    Company ID: {company_id}")
            print(f"    Company Name: {company_name or 'Not Available'}")
            print(f"    Year: {year}")
            print(f"    Facts: {len(facts)}")
            
        except Exception as e:
            print(f"    ERROR: {str(e)[:100]}")
            results.append({'url': url, 'error': str(e)})
    
    # Save to JSON
    output_file = Path("company_info_results.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n\nResults saved to: {output_file}")
    print("=" * 70)
    
    return results


if __name__ == "__main__":
    main()
