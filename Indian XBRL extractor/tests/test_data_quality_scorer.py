"""
Unit tests for DataQualityScorer class.
"""

import pytest
from brsr_xbrl_extractor import DataQualityScorer


@pytest.fixture
def scorer():
    """Create a DataQualityScorer instance for testing."""
    return DataQualityScorer(base_score=80)


class TestDataQualityScorer:
    """Test suite for DataQualityScorer."""
    
    def test_score_null_value(self, scorer):
        """Test scoring with null value."""
        score = scorer.score(None, None, None)
        assert score == 0
    
    def test_score_basic_string(self, scorer):
        """Test scoring with basic string value."""
        score = scorer.score("some text", None, None)
        assert score == 80  # Base score only
    
    def test_score_numeric_value(self, scorer):
        """Test scoring with numeric value."""
        score = scorer.score(123, None, None)
        assert score == 90  # Base + 10 for numeric
    
    def test_score_with_unit(self, scorer):
        """Test scoring with unit."""
        score = scorer.score(123, "tCO2e", None)
        assert score == 95  # Base + 10 (numeric) + 5 (unit)
    
    def test_score_with_context(self, scorer):
        """Test scoring with context."""
        score = scorer.score(123, "tCO2e", "ctx_2024")
        assert score == 100  # Base + 10 (numeric) + 5 (unit) + 5 (context)
    
    def test_score_xbrl_source(self, scorer):
        """Test scoring with XBRL data source."""
        score = scorer.score(123, "tCO2e", "ctx_2024", "xbrl")
        assert score == 100  # Highest quality
    
    def test_score_public_api_source(self, scorer):
        """Test scoring with public API data source."""
        score = scorer.score(123, "tCO2e", "ctx_2024", "public_api")
        assert score == 90  # -10 for public API
    
    def test_score_manual_source(self, scorer):
        """Test scoring with manual data source."""
        score = scorer.score(123, "tCO2e", "ctx_2024", "manual")
        assert score == 80  # -20 for manual
    
    def test_score_bounds_max(self, scorer):
        """Test that score doesn't exceed 100."""
        # Even with all bonuses, should cap at 100
        score = scorer.score(123.45, "unit", "context", "xbrl")
        assert score <= 100
    
    def test_score_bounds_min(self, scorer):
        """Test that score doesn't go below 0."""
        # Null value should give 0
        score = scorer.score(None, None, None)
        assert score >= 0
    
    def test_score_float_value(self, scorer):
        """Test scoring with float value."""
        score = scorer.score(123.45, None, None)
        assert score == 90  # Base + 10 for numeric
    
    def test_score_complete_record(self, scorer):
        """Test scoring with complete record (all fields present)."""
        score = scorer.score(
            value=1234.56,
            unit="tCO2e",
            context_id="ctx_2024_annual",
            data_source="xbrl"
        )
        assert score == 100
    
    def test_score_minimal_record(self, scorer):
        """Test scoring with minimal record."""
        score = scorer.score(
            value="text value",
            unit=None,
            context_id=None,
            data_source="xbrl"
        )
        assert score == 80  # Only base score
    
    def test_custom_base_score(self):
        """Test scorer with custom base score."""
        custom_scorer = DataQualityScorer(base_score=70)
        score = custom_scorer.score("text", None, None)
        assert score == 70


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
