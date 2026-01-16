"""
Unit tests for MetricMapper class.
"""

import pytest
from brsr_xbrl_extractor import MetricMapper, ParserConfig


@pytest.fixture
def mapper():
    """Create a MetricMapper instance for testing."""
    config = ParserConfig()
    return MetricMapper(config)


class TestMetricMapper:
    """Test suite for MetricMapper."""
    
    def test_map_fact_direct_match(self, mapper):
        """Test mapping with direct local_name match."""
        fact = {
            "local_name": "TotalEmployees",
            "value": "1000",
            "unit": "count"
        }
        
        result = mapper.map_fact(fact)
        assert result is not None
        indicator_name, metadata = result
        assert indicator_name == "employees_total"
        assert metadata["category"] == "social"
    
    def test_map_fact_alternative_name(self, mapper):
        """Test mapping with alternative name."""
        fact = {
            "local_name": "NumberOfEmployees",
            "value": "1000",
            "unit": "count"
        }
        
        result = mapper.map_fact(fact)
        assert result is not None
        indicator_name, _ = result
        assert indicator_name == "employees_total"
    
    def test_map_fact_unmapped(self, mapper):
        """Test mapping with unmapped fact."""
        fact = {
            "local_name": "UnknownMetric",
            "value": "123",
            "unit": None
        }
        
        result = mapper.map_fact(fact)
        # Should return None for unmapped facts
        assert result is None
    
    def test_normalize_value_integer(self, mapper):
        """Test value normalization for integers."""
        assert mapper.normalize_value("123", "integer") == 123
        assert mapper.normalize_value("123.0", "integer") == 123
        assert mapper.normalize_value("123.5", "integer") == 123
    
    def test_normalize_value_float(self, mapper):
        """Test value normalization for floats."""
        assert mapper.normalize_value("123.45", "float") == 123.45
        assert mapper.normalize_value("1.23e5", "float") == 123000.0
    
    def test_normalize_value_boolean(self, mapper):
        """Test value normalization for booleans."""
        assert mapper.normalize_value("yes", "boolean") is True
        assert mapper.normalize_value("true", "boolean") is True
        assert mapper.normalize_value("no", "boolean") is False
        assert mapper.normalize_value("false", "boolean") is False
    
    def test_normalize_value_string(self, mapper):
        """Test value normalization for strings."""
        assert mapper.normalize_value("Some text", "string") == "Some text"
        assert mapper.normalize_value("  Trimmed  ", "string") == "Trimmed"
    
    def test_normalize_value_empty(self, mapper):
        """Test value normalization for empty strings."""
        assert mapper.normalize_value("", "string") is None
        assert mapper.normalize_value("   ", "string") is None
    
    def test_normalize_value_auto_detect(self, mapper):
        """Test auto-detection of numeric values."""
        assert mapper.normalize_value("123") == 123
        assert mapper.normalize_value("123.45") == 123.45
        assert mapper.normalize_value("not a number") == "not a number"
    
    def test_environmental_metrics(self, mapper):
        """Test mapping of environmental metrics."""
        ghg_fact = {
            "local_name": "GreenhouseGasEmissionsScope1",
            "value": "1000.5",
            "unit": "tCO2e"
        }
        
        result = mapper.map_fact(ghg_fact)
        assert result is not None
        indicator_name, metadata = result
        assert indicator_name == "ghg_scope1_total"
        assert metadata["category"] == "environmental"
        assert metadata["unit"] == "tCO2e"
    
    def test_social_metrics(self, mapper):
        """Test mapping of social metrics."""
        women_fact = {
            "local_name": "FemaleEmployees",
            "value": "450",
            "unit": "count"
        }
        
        result = mapper.map_fact(women_fact)
        assert result is not None
        indicator_name, metadata = result
        assert indicator_name == "employees_female"
        assert metadata["category"] == "social"
    
    def test_governance_metrics(self, mapper):
        """Test mapping of governance metrics."""
        csr_fact = {
            "local_name": "CSRSpending",
            "value": "5000000",
            "unit": "INR"
        }
        
        result = mapper.map_fact(csr_fact)
        assert result is not None
        indicator_name, metadata = result
        assert indicator_name == "csr_spending"
        assert metadata["category"] == "governance"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
