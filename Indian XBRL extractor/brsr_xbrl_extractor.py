#!/usr/bin/env python3
"""
BRSR XBRL ESG metrics extractor for NSE filings.

- Parses NSE BRSR XBRL (SEBI in-capmkt taxonomy) with Arelle.
- Falls back to public ESG data sources if Arelle parsing fails.
- Outputs normalized ESG metrics with data quality scores to CSV.
"""

from __future__ import annotations

import json
import logging
import sys
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import pandas as pd
import requests
from lxml import etree

# Optional: arelle-release (pip install arelle-release)
try:
    from arelle.Cntlr import Cntlr  # type: ignore
    from arelle.ModelManager import ModelManager  # type: ignore
    from arelle.ModelXbrl import ModelXbrl  # type: ignore
    ARELLE_AVAILABLE = True
except ImportError:
    ARELLE_AVAILABLE = False
    logging.warning("Arelle not available. Install with: pip install arelle-release")

# Public ESG data fallback
try:
    import yfinance as yf
    YFINANCE_AVAILABLE = True
except ImportError:
    YFINANCE_AVAILABLE = False
    logging.warning("yfinance not available. Install with: pip install yfinance")


# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------

@dataclass
class ParserConfig:
    """Configuration options for BRSR XBRL parsing."""
    request_timeout: int = 30
    max_retries: int = 3
    retry_backoff_factor: float = 2.0
    verify_ssl: bool = True
    taxonomy_expected: str = "https://www.sebi.gov.in/xbrl/2025-05-31/in-capmkt"
    data_quality_base: int = 80
    enable_arelle: bool = ARELLE_AVAILABLE
    arelle_log_level: str = "ERROR"
    taxonomy_mapping_path: str = "brsr_taxonomy_mapping.json"
    enable_public_data_fallback: bool = True
    output_dir: str = "./output"


# -------------------------------------------------------------------
# Logging setup
# -------------------------------------------------------------------

def setup_logging(level: str = "INFO") -> None:
    """Configure root logger with structured output."""
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)-8s] %(name)-20s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


logger = logging.getLogger("brsr_parser")


# -------------------------------------------------------------------
# Custom Exceptions
# -------------------------------------------------------------------

class BRSRParserError(Exception):
    """Base exception for BRSR parser errors."""
    pass


class FetchError(BRSRParserError):
    """Error fetching XBRL document."""
    pass


class ParseError(BRSRParserError):
    """Error parsing XBRL document."""
    pass


class ValidationError(BRSRParserError):
    """Error validating extracted data."""
    pass


# -------------------------------------------------------------------
# Data model
# -------------------------------------------------------------------

@dataclass
class ESGRecord:
    """Normalized ESG metric record."""
    company_id: str
    company_name: str
    reporting_year: int
    indicator_name: str
    indicator_value: Any
    value_unit: Optional[str]
    data_quality_score: int
    data_source: str  # 'xbrl', 'public_api', 'manual'
    extraction_timestamp: str


# -------------------------------------------------------------------
# Fetcher with retry logic
# -------------------------------------------------------------------

class XbrlFetcher:
    """Fetches and validates XBRL instance documents from URLs."""

    def __init__(self, config: ParserConfig) -> None:
        self.config = config

    def fetch(self, url: str) -> bytes:
        """Fetch XBRL content from a URL with exponential backoff retries."""
        self._validate_url(url)
        
        for attempt in range(self.config.max_retries + 1):
            try:
                logger.info("Fetching XBRL from %s (attempt %d/%d)", 
                           url, attempt + 1, self.config.max_retries + 1)
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
                
                resp = requests.get(
                    url,
                    timeout=self.config.request_timeout,
                    verify=self.config.verify_ssl,
                    headers=headers
                )
                
                if resp.status_code != 200:
                    raise FetchError(f"HTTP {resp.status_code} for {url}")
                
                if not resp.content.strip().startswith(b"<"):
                    raise FetchError(f"Response from {url} is not XML-like")
                
                logger.info("Successfully fetched %d bytes from %s", len(resp.content), url)
                return resp.content
                
            except requests.exceptions.Timeout as exc:
                logger.warning("Timeout fetching %s (attempt %d): %s", url, attempt + 1, exc)
                if attempt < self.config.max_retries:
                    sleep_time = self.config.retry_backoff_factor ** attempt
                    logger.info("Retrying in %.1f seconds...", sleep_time)
                    time.sleep(sleep_time)
                else:
                    raise FetchError(f"Timeout after {self.config.max_retries + 1} attempts") from exc
                    
            except requests.exceptions.RequestException as exc:
                logger.warning("Request failed for %s (attempt %d): %s", url, attempt + 1, exc)
                if attempt < self.config.max_retries:
                    sleep_time = self.config.retry_backoff_factor ** attempt
                    logger.info("Retrying in %.1f seconds...", sleep_time)
                    time.sleep(sleep_time)
                else:
                    raise FetchError(f"Failed after {self.config.max_retries + 1} attempts") from exc
        
        raise FetchError(f"Failed to fetch {url} after all retries")

    @staticmethod
    def _validate_url(url: str) -> None:
        """Validate URL format and host."""
        if not url.lower().startswith(("https://nsearchives.nseindia.com/", "http://localhost")):
            logger.warning("Unexpected XBRL host: %s", url)
        if not url.lower().endswith(".xml"):
            raise ValidationError(f"Expected .xml XBRL instance: {url}")


# -------------------------------------------------------------------
# Arelle-based parser
# -------------------------------------------------------------------

class BRSRParserArelle:
    """Parses BRSR XBRL using Arelle."""

    def __init__(self, config: ParserConfig) -> None:
        self.config = config
        if not ARELLE_AVAILABLE:
            raise ImportError("Arelle is not available. Install with: pip install arelle-release")
        self.cntlr = Cntlr(logFileName=None, logFileMode="w")
        if hasattr(self.cntlr, "logger") and self.cntlr.logger is not None:
            self.cntlr.logger.logLevel = self.config.arelle_log_level

    def parse_bytes(self, content: bytes) -> ModelXbrl:
        """Load an XBRL instance from bytes into Arelle's ModelXbrl."""
        try:
            import io
            model_manager: ModelManager = ModelManager.initialize(self.cntlr)
            stream = io.BytesIO(content)
            model_xbrl = model_manager.load(stream=stream, openFileSource=True)
            
            if model_xbrl is None:
                raise ParseError("Arelle failed to load XBRL instance")
            
            logger.info("Successfully parsed XBRL with Arelle")
            return model_xbrl
            
        except Exception as exc:
            raise ParseError(f"Arelle parsing failed: {exc}") from exc

    @staticmethod
    def extract_company_and_year(model_xbrl: ModelXbrl) -> Tuple[str, str, int]:
        """Extract company identifier (CIN), name, and reporting year from contexts."""
        company_id = ""
        company_name = ""
        year = 0
        
        for ctx in model_xbrl.contexts.values():
            if ctx.entityIdentifier:
                company_id = ctx.entityIdentifier[1] or company_id
            if ctx.isPeriodEnd:
                try:
                    year = ctx.endDatetime.year
                except Exception:  # noqa: BLE001
                    continue
        
        # Try to extract company name from facts
        for fact in model_xbrl.facts:
            if fact.qname and "CompanyName" in fact.qname.localName:
                company_name = fact.value or company_name
                break
        
        if not company_id:
            raise ValidationError("Could not determine company_id from contexts")
        if not year:
            raise ValidationError("Could not determine reporting_year from contexts")
        
        return company_id, company_name, year

    def extract_facts(self, model_xbrl: ModelXbrl) -> List[Dict[str, Any]]:
        """Extract raw facts from a ModelXbrl instance."""
        facts: List[Dict[str, Any]] = []
        
        for fact in model_xbrl.facts:
            if fact.isNil:
                continue
            
            qname = fact.qname
            if qname is None:
                continue
            
            value = fact.value
            unit = None
            if fact.unit:
                unit = str(fact.unit.measures[0][0]) if fact.unit.measures else None
            
            context_id = fact.contextID
            
            facts.append({
                "qname": f"{qname.namespaceURI}:{qname.localName}",
                "local_name": qname.localName,
                "namespace": qname.namespaceURI,
                "value": value,
                "unit": unit,
                "context_id": context_id,
            })
        
        logger.info("Extracted %d facts from XBRL", len(facts))
        return facts


# -------------------------------------------------------------------
# lxml fallback parser
# -------------------------------------------------------------------

class BRSRParserLxml:
    """Fallback parser using lxml for basic fact extraction."""

    def __init__(self, config: ParserConfig) -> None:
        self.config = config

    def extract_facts(self, content: bytes) -> Tuple[str, str, int, List[Dict[str, Any]]]:
        """Minimal QName-based extraction using lxml as a fallback."""
        try:
            root = etree.fromstring(content)
            nsmap = root.nsmap or {}
            
            # Determine company_id and year from xbrli:context
            xbrli = nsmap.get("xbrli", "http://www.xbrl.org/2003/instance")
            company_id = ""
            company_name = ""
            year = 0
            
            for ctx in root.findall(f".//{{{xbrli}}}context"):
                ident = ctx.find(f".//{{{xbrli}}}identifier")
                if ident is not None and ident.text:
                    company_id = ident.text
                period = ctx.find(f".//{{{xbrli}}}endDate")
                if period is not None and period.text:
                    try:
                        year = int(period.text[:4])
                    except ValueError:
                        pass
            
            if not company_id:
                raise ValidationError("Could not determine company_id in lxml fallback")
            if not year:
                raise ValidationError("Could not determine reporting_year in lxml fallback")

            # Extract all element facts in SEBI namespace
            facts: List[Dict[str, Any]] = []
            for el in root.iter():
                if el.prefix and el.prefix in nsmap:
                    ns = nsmap[el.prefix]
                    if "sebi.gov.in/xbrl" not in ns:
                        continue
                    if len(el) == 0 and el.text not in (None, ""):
                        local_name = el.tag.split('}', 1)[1] if '}' in el.tag else el.tag
                        qname = f"{ns}:{local_name}"
                        
                        # Extract company name if found
                        if "CompanyName" in local_name and not company_name:
                            company_name = el.text.strip()
                        
                        facts.append({
                            "qname": qname,
                            "local_name": local_name,
                            "namespace": ns,
                            "value": el.text.strip(),
                            "unit": None,
                            "context_id": el.get("contextRef"),
                        })
            
            logger.info("Extracted %d facts using lxml fallback", len(facts))
            return company_id, company_name, year, facts
            
        except Exception as exc:
            raise ParseError(f"lxml parsing failed: {exc}") from exc


# -------------------------------------------------------------------
# Public ESG data fallback
# -------------------------------------------------------------------

class PublicESGDataFetcher:
    """Fetches ESG data from public sources when XBRL parsing fails."""
    
    def __init__(self, config: ParserConfig) -> None:
        self.config = config
    
    def fetch_esg_data(self, company_id: str, company_name: str = "") -> List[Dict[str, Any]]:
        """Fetch ESG data from public sources (Yahoo Finance, etc.)."""
        if not YFINANCE_AVAILABLE:
            logger.warning("yfinance not available for public ESG data fallback")
            return []
        
        try:
            # Try to find ticker symbol from company name or CIN
            ticker = self._find_ticker(company_id, company_name)
            if not ticker:
                logger.warning("Could not find ticker for %s", company_id)
                return []
            
            logger.info("Fetching public ESG data for ticker: %s", ticker)
            stock = yf.Ticker(ticker)
            
            # Get sustainability data
            sustainability = stock.sustainability
            if sustainability is None or sustainability.empty:
                logger.warning("No sustainability data available for %s", ticker)
                return []
            
            # Convert to fact-like structure
            facts = []
            for index, value in sustainability.items():
                if pd.notna(value):
                    facts.append({
                        "local_name": str(index),
                        "value": str(value),
                        "unit": None,
                        "source": "yahoo_finance"
                    })
            
            logger.info("Fetched %d ESG metrics from public sources", len(facts))
            return facts
            
        except Exception as exc:
            logger.error("Failed to fetch public ESG data: %s", exc)
            return []
    
    @staticmethod
    def _find_ticker(company_id: str, company_name: str) -> Optional[str]:
        """Try to find NSE ticker from company info."""
        # This is a simplified version - in production, you'd maintain a CIN-to-ticker mapping
        # For now, we'll try common patterns
        if company_name:
            # Try searching by company name
            try:
                search_results = yf.Ticker(company_name.split()[0] + ".NS")
                if search_results.info:
                    return company_name.split()[0] + ".NS"
            except:
                pass
        return None


# -------------------------------------------------------------------
# Taxonomy mapping and transformation
# -------------------------------------------------------------------

class MetricMapper:
    """Maps BRSR taxonomy QNames / local names to standardized ESG indicators."""

    def __init__(self, config: ParserConfig) -> None:
        self.config = config
        self.mapping: Dict[str, Dict[str, Any]] = {}
        self.alternative_names: Dict[str, str] = {}
        self.taxonomy_labels: Dict[str, str] = {}
        self._load_mapping()
        self._load_taxonomy_labels()

    def _load_mapping(self) -> None:
        """Load taxonomy mapping from JSON file."""
        mapping_path = Path(self.config.taxonomy_mapping_path)
        
        if not mapping_path.exists():
            logger.warning("Taxonomy mapping file not found: %s", mapping_path)
            # We continue even if mapping fails, relying on taxonomy file
        
        try:
            with open(mapping_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Flatten the nested structure
            for category, metrics in data.get("mappings", {}).items():
                for local_name, details in metrics.items():
                    self.mapping[local_name] = details
            
            self.alternative_names = data.get("alternative_names", {})
            
            logger.info("Loaded %d curated mappings", len(self.mapping))
            
        except Exception as exc:
            logger.error("Failed to load taxonomy mapping: %s", exc)

    def _load_taxonomy_labels(self) -> None:
        """Load official taxonomy labels from the Taxonomy_BRSR folder."""
        # Path determined from user request/file structure
        # Taxonomy_BRSR/core/in-capmkt-lab.xml
        lab_path = Path("Taxonomy_BRSR/core/in-capmkt-lab.xml")
        
        if not lab_path.exists():
            logger.warning("Taxonomy label file not found: %s", lab_path)
            return

        try:
            tree = etree.parse(str(lab_path))
            root = tree.getroot()
            
            # Namespaces likely needed for finding elements, but lxml local-name() is easier
            # XML Structure:
            # <link:loc xlink:href="in-capmkt.xsd#in-capmkt_ScripCode" xlink:label="ScripCode" ... />
            # <link:labelArc ... xlink:from="ScripCode" xlink:to="label_ScripCode" ... />
            # <link:label ... xlink:label="label_ScripCode" ... >Scrip code</link:label>

            # Map label_id -> Label Text
            label_map = {}
            ns = {"link": "http://www.xbrl.org/2003/linkbase"}
            
            # Extract all labels
            for label_node in root.findall(".//link:label", ns):
                label_id = label_node.get("{http://www.w3.org/1999/xlink}label")
                text = label_node.text
                if label_id and text:
                    label_map[label_id] = text.strip()

            # Map locators to labels via arcs
            # 1. Map ConceptName (from loc) -> LabelID (from arc)
            
            # First, build local_name -> label_id map from arcs? 
            # Actually, arcs map from "loc label" to "resource label".
            # loc has: href="...#in-capmkt_ScripCode" label="ScripCode"
            # arc has: from="ScripCode" to="label_ScripCode"
            # label has: label="label_ScripCode" text="Scrip code"
            
            # Let's build map: ArcFrom -> ArcTo
            arc_map = {}
            for arc in root.findall(".//link:labelArc", ns):
                frm = arc.get("{http://www.w3.org/1999/xlink}from")
                to = arc.get("{http://www.w3.org/1999/xlink}to")
                if frm and to:
                    arc_map[frm] = to
            
            # Now iterate locators to connect ElementName -> LabelText
            count = 0
            for loc in root.findall(".//link:loc", ns):
                href = loc.get("{http://www.w3.org/1999/xlink}href")
                loc_label = loc.get("{http://www.w3.org/1999/xlink}label")
                
                if href and "#" in href:
                    # Parse element name from href, e.g. "in-capmkt.xsd#in-capmkt_ScripCode"
                    elem_id = href.split("#")[1]
                    # Usually "Prefix_Name", we want "Name" if prefix matches standard
                    # But extraction logic uses local_name. 
                    # If href is "in-capmkt.xsd#in-capmkt_ScripCode", local_name is "ScripCode" (usually)
                    
                    # Remove "in-capmkt_" prefix if present to get clean local_name
                    clean_name = elem_id.replace("in-capmkt_", "")
                    
                    if loc_label in arc_map:
                        target_label_id = arc_map[loc_label]
                        if target_label_id in label_map:
                            self.taxonomy_labels[clean_name] = label_map[target_label_id]
                            count += 1
            
            logger.info("Loaded %d taxonomy labels from %s", count, lab_path)
            
        except Exception as exc:
            logger.error("Failed to parse taxonomy labels: %s", exc)

    def map_fact(self, fact: Dict[str, Any]) -> Optional[Tuple[str, Dict[str, Any]]]:
        """Return standardized indicator_name and metadata for a fact or None if not mapped."""
        local_name = fact.get("local_name", "")
        
        # 1. Try curated JSON mapping (highest priority)
        if local_name in self.mapping:
            meta = self.mapping[local_name].copy()
            meta["mapping_source"] = "curated"
            return self.mapping[local_name]["indicator_name"], meta
        
        # 2. Try alternative names from JSON
        if local_name in self.alternative_names:
            canonical_name = self.alternative_names[local_name]
            if canonical_name in self.mapping:
                meta = self.mapping[canonical_name].copy()
                meta["mapping_source"] = "curated"
                return self.mapping[canonical_name]["indicator_name"], meta

        # 3. Try official taxonomy label (fallback)
        if local_name in self.taxonomy_labels:
            # Construct a minimal metadata dict
            indicator_name = self.taxonomy_labels[local_name]
            # Heuristic: If indicator name sounds like a header/abstract, we might want to skip or mark it
            # But for now we return it.
            return indicator_name, {
                "indicator_name": indicator_name,
                "data_type": "string", # Default to string as we don't know type from label linkbase
                "unit": None,
                "mapping_source": "taxonomy"
            }
        
        # 4. Try partial matching for curated mapping (lowest priority)
        for mapped_name, details in self.mapping.items():
            if mapped_name.lower() in local_name.lower() or local_name.lower() in mapped_name.lower():
                logger.debug("Partial match: %s -> %s", local_name, mapped_name)
                meta = details.copy()
                meta["mapping_source"] = "partial"
                return details["indicator_name"], meta
        
        return None

    @staticmethod
    def normalize_value(raw: str, expected_type: str = "string") -> Any:
        """Convert string value to appropriate type based on expected_type."""
        val = raw.strip()
        if val == "":
            return None
        
        low = val.lower()
        
        # Boolean conversion
        if expected_type == "boolean" or low in {"yes", "true", "no", "false"}:
            return low in {"yes", "true"}
        
        # Numeric conversion
        if expected_type in {"integer", "float"}:
            try:
                if expected_type == "integer":
                    return int(float(val))  # Handle "123.0" -> 123
                return float(val)
            except ValueError:
                logger.warning("Could not convert '%s' to %s", val, expected_type)
                return val
        
        # Auto-detect numeric
        try:
            if "." in val or "e" in low:
                return float(val)
            return int(val)
        except ValueError:
            return val


# -------------------------------------------------------------------
# Data quality scoring
# -------------------------------------------------------------------

class DataQualityScorer:
    """Computes a 0–100 data quality score for each fact."""

    def __init__(self, base_score: int = 80) -> None:
        self.base_score = base_score

    def score(
        self, 
        value: Any, 
        unit: Optional[str], 
        context_id: Optional[str],
        data_source: str = "xbrl"
    ) -> int:
        """Calculate data quality score based on multiple factors."""
        score = self.base_score
        
        # Null value check
        if value is None:
            return 0
        
        # Data type bonus
        if isinstance(value, (int, float)):
            score += 10
        
        # Unit presence bonus
        if unit:
            score += 5
        
        # Context presence bonus
        if context_id:
            score += 5
        
        # Data source adjustment
        if data_source == "xbrl":
            score += 0  # Highest quality
        elif data_source == "public_api":
            score -= 10  # Lower quality
        else:
            score -= 20  # Manual/unknown source
        
        return max(0, min(100, score))


# -------------------------------------------------------------------
# Main orchestrator
# -------------------------------------------------------------------

class BRSRExtractor:
    """End-to-end ESG metrics extractor for NSE BRSR XBRL."""

    def __init__(self, config: Optional[ParserConfig] = None) -> None:
        self.config = config or ParserConfig()
        self.fetcher = XbrlFetcher(self.config)
        self.mapper = MetricMapper(self.config)
        self.scorer = DataQualityScorer(self.config.data_quality_base)
        
        self.arelle_parser = None
        if self.config.enable_arelle and ARELLE_AVAILABLE:
            self.arelle_parser = BRSRParserArelle(self.config)
        
        self.lxml_parser = BRSRParserLxml(self.config)
        self.public_data_fetcher = PublicESGDataFetcher(self.config)
        self._load_company_db()

    def _load_company_db(self) -> None:
        """Load company details from Insider_Trading.csv."""
        self.company_url_map = {}
        self.company_id_map = {}
        try:
            csv_path = Path("Insider_Trading.csv")
            if not csv_path.exists():
                logger.warning("Insider_Trading.csv not found, company lookup disabled")
                return
            
            df = pd.read_csv(csv_path)
            # Map URL -> Company Name
            if "XBRL" in df.columns and "COMPANY" in df.columns:
                self.company_url_map = pd.Series(df.COMPANY.values, index=df.XBRL).to_dict()
            
            # Map Company ID (refined) -> Company Name
            if "Company ID" in df.columns and "COMPANY" in df.columns:
                self.company_id_map = pd.Series(df.COMPANY.values, index=df["Company ID"]).to_dict()
                
            logger.info("Loaded company database: %d URLs, %d IDs", 
                       len(self.company_url_map), len(self.company_id_map))
        except Exception as e:
            logger.error("Failed to load company database: %s", e)

    def process_url(self, url: str) -> List[ESGRecord]:
        """Process single XBRL URL and return ESG records."""
        logger.info("=" * 80)
        logger.info("Processing XBRL URL: %s", url)
        logger.info("=" * 80)
        
        try:
            content = self.fetcher.fetch(url)
        except FetchError as exc:
            logger.error("Failed to fetch %s: %s", url, exc)
            return []

        return self.process_content(content, source_name=url, url=url)

    def _resolve_company_name(self, current_name: str, url: Optional[str], source_name: str) -> str:
        """Resolve company name from CSV fallback if unknown."""
        if current_name and current_name.lower() != "unknown":
            return current_name

        # Try URL match
        if url and url in self.company_url_map:
            logger.info("Found company name from URL mapping: %s", self.company_url_map[url])
            return self.company_url_map[url]

        # Try ID match from source_name/filename
        # Logic: Extract filename stem -> check map
        try:
            filename = Path(source_name).stem
            # Common pattern in CSV: BRSR_1467735_17062025071711
            if filename in self.company_id_map:
                logger.info("Found company name from ID mapping: %s", self.company_id_map[filename])
                return self.company_id_map[filename]
            
            # Try partial match (sometimes filename has extra tags)
            for cid, name in self.company_id_map.items():
                if cid in filename:
                    logger.info("Found company name from partial ID mapping: %s", name)
                    return name
        except Exception:
            pass

        return current_name or "Unknown"

    def process_content(self, content: bytes, source_name: str, url: Optional[str] = None) -> List[ESGRecord]:
        """Process XBRL content (bytes) and return ESG records."""
        company_id: str = ""
        company_name: str = ""
        year: int = 0
        raw_facts: List[Dict[str, Any]]
        data_source = "xbrl"

        # Try Arelle first
        if self.arelle_parser is not None:
            try:
                model_xbrl = self.arelle_parser.parse_bytes(content)
                company_id, company_name, year = self.arelle_parser.extract_company_and_year(model_xbrl)
                raw_facts = self.arelle_parser.extract_facts(model_xbrl)
                logger.info("✓ Parsed with Arelle for %s (%d facts)", company_id, len(raw_facts))
            except (ParseError, ValidationError) as exc:
                logger.warning("Arelle parsing failed, trying lxml fallback: %s", exc)
                try:
                    company_id, company_name, year, raw_facts = self.lxml_parser.extract_facts(content)
                    logger.info("✓ Parsed with lxml fallback for %s (%d facts)", company_id, len(raw_facts))
                except (ParseError, ValidationError) as exc2:
                    logger.error("Both Arelle and lxml parsing failed: %s", exc2)
                    if self.config.enable_public_data_fallback and url:
                        logger.info("Attempting public ESG data fallback...")
                        return self._fallback_to_public_data(url)
                    return []
        else:
            try:
                company_id, company_name, year, raw_facts = self.lxml_parser.extract_facts(content)
                logger.info("✓ Parsed with lxml for %s (%d facts)", company_id, len(raw_facts))
            except (ParseError, ValidationError) as exc:
                logger.error("lxml parsing failed: %s", exc)
                if self.config.enable_public_data_fallback and url:
                    logger.info("Attempting public ESG data fallback...")
                    return self._fallback_to_public_data(url)
                return []

        # Resolve company name if missing or unknown
        company_name = self._resolve_company_name(company_name, url, source_name)

        # Transform facts to ESG records
        records = self._transform_facts_to_records(
            raw_facts, company_id, company_name, year, data_source
        )
        
        logger.info("✓ Extracted %d ESG records for %s (year %d)", len(records), company_id, year)
        return records

    def _transform_facts_to_records(
        self,
        raw_facts: List[Dict[str, Any]],
        company_id: str,
        company_name: str,
        year: int,
        data_source: str
    ) -> List[ESGRecord]:
        """Transform raw facts into ESG records."""
        from datetime import datetime
        
        records: List[ESGRecord] = []
        timestamp = datetime.now().isoformat()
        
        for fact in raw_facts:
            mapping_result = self.mapper.map_fact(fact)
            if not mapping_result:
                continue  # Skip unmapped facts
            
            indicator_name, metadata = mapping_result
            expected_type = metadata.get("data_type", "string")
            expected_unit = metadata.get("unit")
            
            norm_value = self.mapper.normalize_value(str(fact.get("value", "")), expected_type)
            unit = fact.get("unit") or expected_unit
            dq_score = self.scorer.score(norm_value, unit, fact.get("context_id"), data_source)
            
            # Enrich data source info with mapping type
            record_source = data_source
            mapping_source = metadata.get("mapping_source")
            if mapping_source == "taxonomy":
                record_source = f"{data_source} (Taxonomy)"
            elif mapping_source == "partial":
                record_source = f"{data_source} (Partial)"
            
            records.append(ESGRecord(
                company_id=company_id,
                company_name=company_name or "Unknown",
                reporting_year=year,
                indicator_name=indicator_name,
                indicator_value=norm_value,
                value_unit=unit,
                data_quality_score=dq_score,
                data_source=record_source,
                extraction_timestamp=timestamp
            ))
        
        return records

    def _fallback_to_public_data(self, url: str) -> List[ESGRecord]:
        """Fallback to public ESG data sources when XBRL parsing fails."""
        logger.info("Using public ESG data fallback for %s", url)
        
        # Extract company identifier from URL if possible
        # Example: BRSR_1467735_17062025071711_WEB.xml -> CIN might be in filename
        from datetime import datetime
        
        company_id = "UNKNOWN"
        company_name = ""
        year = datetime.now().year - 1  # Assume previous year
        
        # Try to fetch public data
        public_facts = self.public_data_fetcher.fetch_esg_data(company_id, company_name)
        
        if not public_facts:
            logger.warning("No public ESG data available")
            return []
        
        # Transform public facts to records
        records = self._transform_facts_to_records(
            public_facts, company_id, company_name, year, "public_api"
        )
        
        return records

    def process_urls(self, urls: Iterable[str]) -> pd.DataFrame:
        """Process multiple XBRL URLs and return combined DataFrame."""
        all_records: List[ESGRecord] = []
        
        for i, url in enumerate(urls, 1):
            logger.info("\n[%d] Processing: %s", i, url)
            try:
                records = self.process_url(url)
                all_records.extend(records)
            except Exception as exc:  # noqa: BLE001
                logger.error("Unexpected error processing %s: %s", url, exc, exc_info=True)
        
        if not all_records:
            logger.warning("No ESG records extracted from any URL")
            return pd.DataFrame()
        
        df = pd.DataFrame([asdict(r) for r in all_records])
        logger.info("\n" + "=" * 80)
        logger.info("EXTRACTION COMPLETE")
        logger.info("=" * 80)
        logger.info("Total records: %d", len(df))
        logger.info("Companies: %d", df['company_id'].nunique())
        logger.info("Indicators: %d", df['indicator_name'].nunique())
        logger.info("Avg quality score: %.1f", df['data_quality_score'].mean())
        
        return df


# -------------------------------------------------------------------
# Export helpers
# -------------------------------------------------------------------

def export_outputs(
    df: pd.DataFrame, 
    out_dir: Path, 
    base_name: str = "brsr_esg_metrics"
) -> None:
    """Export DataFrame to CSV, Parquet, and JSON."""
    out_dir.mkdir(parents=True, exist_ok=True)
    
    csv_path = out_dir / f"{base_name}.csv"
    parquet_path = out_dir / f"{base_name}.parquet"
    json_path = out_dir / f"{base_name}.json"

    # Export CSV
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    logger.info("✓ Exported CSV to %s", csv_path)
    
    # Export Parquet (requires pyarrow or fastparquet)
    try:
        df.to_parquet(parquet_path, index=False)
        logger.info("✓ Exported Parquet to %s", parquet_path)
    except Exception as exc:
        logger.warning("Could not export Parquet: %s", exc)
    
    # Export JSON
    df.to_json(json_path, orient="records", indent=2, force_ascii=False)
    logger.info("✓ Exported JSON to %s", json_path)


# -------------------------------------------------------------------
# CLI entry point
# -------------------------------------------------------------------

def main() -> None:
    """Main entry point for CLI usage."""
    setup_logging("INFO")
    
    logger.info("BRSR XBRL ESG Metrics Extractor")
    logger.info("=" * 80)

    # Sample NSE XBRL URLs
    urls = [
        "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467735_17062025071711_WEB.xml",
        "https://nsearchives.nseindia.com/corporate/xbrl/BRSR_1467642_17062025052610_WEB.xml",
    ]

    config = ParserConfig()
    extractor = BRSRExtractor(config)
    df = extractor.process_urls(urls)

    if df.empty:
        logger.warning("No ESG metrics extracted.")
        return

    export_outputs(df, out_dir=Path(config.output_dir))
    logger.info("\n✓ Processing complete! Check the output directory for results.")


if __name__ == "__main__":
    main()
