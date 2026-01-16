"""
Configuration management for BRSR XBRL extractor.
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional

from brsr_xbrl_extractor import ParserConfig


class ConfigManager:
    """Manages configuration loading and validation."""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path
        self.config = ParserConfig()
        
        if config_path:
            self.load_from_file(config_path)
    
    def load_from_file(self, path: str) -> None:
        """Load configuration from JSON file."""
        config_file = Path(path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {path}")
        
        with open(config_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Update config with loaded values
        for key, value in data.items():
            if hasattr(self.config, key):
                setattr(self.config, key, value)
    
    def save_to_file(self, path: str) -> None:
        """Save current configuration to JSON file."""
        config_dict = {
            "request_timeout": self.config.request_timeout,
            "max_retries": self.config.max_retries,
            "retry_backoff_factor": self.config.retry_backoff_factor,
            "verify_ssl": self.config.verify_ssl,
            "taxonomy_expected": self.config.taxonomy_expected,
            "data_quality_base": self.config.data_quality_base,
            "enable_arelle": self.config.enable_arelle,
            "arelle_log_level": self.config.arelle_log_level,
            "taxonomy_mapping_path": self.config.taxonomy_mapping_path,
            "enable_public_data_fallback": self.config.enable_public_data_fallback,
            "output_dir": self.config.output_dir
        }
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(config_dict, f, indent=2)
    
    def get_config(self) -> ParserConfig:
        """Get the current configuration."""
        return self.config


def create_default_config(output_path: str = "config.json") -> None:
    """Create a default configuration file."""
    manager = ConfigManager()
    manager.save_to_file(output_path)
    print(f"Created default config at: {output_path}")


if __name__ == "__main__":
    create_default_config()
