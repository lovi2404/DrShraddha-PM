"""
Integration tests for BRSRExtractor.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from brsr_xbrl_extractor import (
    BRSRExtractor, 
    ParserConfig, 
    ESGRecord,
    FetchError,
    ParseError
)


@pytest.fixture
def config():
    """Create a test configuration."""
    cfg = ParserConfig()
    cfg.enable_arelle = False  # Use lxml for tests
    cfg.enable_public_data_fallback = False
    return cfg


@pytest.fixture
def extractor(config):
    """Create a BRSRExtractor instance for testing."""
    return BRSRExtractor(config)


class TestBRSRExtractor:
    """Test suite for BRSRExtractor."""
    
    def test_extractor_initialization(self, extractor):
        """Test that extractor initializes correctly."""
        assert extractor is not None
        assert extractor.fetcher is not None
        assert extractor.mapper is not None
        assert extractor.scorer is not None
    
    @patch('brsr_xbrl_extractor.requests.get')
    def test_fetch_success(self, mock_get, extractor):
        """Test successful XBRL fetch."""
        # Mock successful response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.content = b'<?xml version="1.0"?><root></root>'
        mock_get.return_value = mock_response
        
        url = "https://nsearchives.nseindia.com/corporate/xbrl/test.xml"
        content = extractor.fetcher.fetch(url)
        
        assert content == b'<?xml version="1.0"?><root></root>'
        assert mock_get.called
    
    @patch('brsr_xbrl_extractor.requests.get')
    def test_fetch_retry_on_failure(self, mock_get, extractor):
        """Test retry logic on fetch failure."""
        # Mock failed responses followed by success
        mock_response_fail = Mock()
        mock_response_fail.status_code = 500
        
        mock_response_success = Mock()
        mock_response_success.status_code = 200
        mock_response_success.content = b'<?xml version="1.0"?><root></root>'
        
        mock_get.side_effect = [
            mock_response_fail,
            mock_response_success
        ]
        
        url = "https://nsearchives.nseindia.com/corporate/xbrl/test.xml"
        
        with pytest.raises(FetchError):
            # First call fails
            extractor.fetcher.fetch(url)
    
    def test_lxml_parser_basic(self, extractor):
        """Test lxml parser with minimal XBRL."""
        sample_xbrl = b'''<?xml version="1.0" encoding="UTF-8"?>
<xbrl xmlns:xbrli="http://www.xbrl.org/2003/instance"
      xmlns:sebi="https://www.sebi.gov.in/xbrl/2025-05-31/in-capmkt">
    <xbrli:context id="ctx_2024">
        <xbrli:entity>
            <xbrli:identifier scheme="CIN">L12345MH2000PLC123456</xbrli:identifier>
        </xbrli:entity>
        <xbrli:period>
            <xbrli:endDate>2024-03-31</xbrli:endDate>
        </xbrli:period>
    </xbrli:context>
    <sebi:TotalEmployees contextRef="ctx_2024">1000</sebi:TotalEmployees>
    <sebi:GreenhouseGasEmissionsScope1 contextRef="ctx_2024" unitRef="tCO2e">5000.5</sebi:GreenhouseGasEmissionsScope1>
</xbrl>
'''
        
        company_id, company_name, year, facts = extractor.lxml_parser.extract_facts(sample_xbrl)
        
        assert company_id == "L12345MH2000PLC123456"
        assert year == 2024
        assert len(facts) >= 2
        
        # Check that facts were extracted
        fact_names = [f["local_name"] for f in facts]
        assert "TotalEmployees" in fact_names
        assert "GreenhouseGasEmissionsScope1" in fact_names
    
    def test_transform_facts_to_records(self, extractor):
        """Test transformation of facts to ESG records."""
        raw_facts = [
            {
                "local_name": "TotalEmployees",
                "value": "1000",
                "unit": "count",
                "context_id": "ctx_2024"
            },
            {
                "local_name": "GreenhouseGasEmissionsScope1",
                "value": "5000.5",
                "unit": "tCO2e",
                "context_id": "ctx_2024"
            }
        ]
        
        records = extractor._transform_facts_to_records(
            raw_facts=raw_facts,
            company_id="L12345MH2000PLC123456",
            company_name="Test Company",
            year=2024,
            data_source="xbrl"
        )
        
        assert len(records) >= 1  # At least one should be mapped
        
        for record in records:
            assert isinstance(record, ESGRecord)
            assert record.company_id == "L12345MH2000PLC123456"
            assert record.company_name == "Test Company"
            assert record.reporting_year == 2024
            assert record.data_source == "xbrl"
            assert 0 <= record.data_quality_score <= 100
    
    @patch.object(BRSRExtractor, 'process_url')
    def test_process_urls_batch(self, mock_process_url, extractor):
        """Test batch processing of multiple URLs."""
        # Mock process_url to return sample records
        mock_records = [
            ESGRecord(
                company_id="TEST001",
                company_name="Test Co",
                reporting_year=2024,
                indicator_name="ghg_scope1_total",
                indicator_value=1000.0,
                value_unit="tCO2e",
                data_quality_score=95,
                data_source="xbrl",
                extraction_timestamp="2024-01-01T00:00:00"
            )
        ]
        mock_process_url.return_value = mock_records
        
        urls = [
            "https://nsearchives.nseindia.com/corporate/xbrl/test1.xml",
            "https://nsearchives.nseindia.com/corporate/xbrl/test2.xml"
        ]
        
        df = extractor.process_urls(urls)
        
        assert not df.empty
        assert len(df) == 2  # One record per URL
        assert "company_id" in df.columns
        assert "indicator_name" in df.columns
        assert "data_quality_score" in df.columns
    
    def test_validation_error_handling(self, extractor):
        """Test handling of validation errors."""
        # Invalid XBRL without company ID
        invalid_xbrl = b'''<?xml version="1.0" encoding="UTF-8"?>
<xbrl xmlns:xbrli="http://www.xbrl.org/2003/instance">
    <xbrli:context id="ctx_2024">
        <xbrli:period>
            <xbrli:endDate>2024-03-31</xbrli:endDate>
        </xbrli:period>
    </xbrli:context>
</xbrl>
'''
        
        with pytest.raises(Exception):  # Should raise ValidationError or ParseError
            extractor.lxml_parser.extract_facts(invalid_xbrl)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
