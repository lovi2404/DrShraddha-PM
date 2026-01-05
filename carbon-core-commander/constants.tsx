
import { EmissionData, KPIStats, ScopeCategory, DecarbonizationLever, CarbonCredit, RiskEntry, Milestone, ComplianceFramework, RegulatoryDeadline, CompanyRegistryEntry } from './types';

// Utility to generate a year of data
const genHistory = (base: number, volatility: number): EmissionData[] => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
    month,
    scope1: Math.floor(base * 0.15 + Math.random() * volatility),
    scope2: Math.floor(base * 0.25 + Math.random() * volatility),
    scope3: Math.floor(base * 0.60 + Math.random() * volatility),
  }));
};

const defaultMilestones: Milestone[] = [
  { year: 2023, title: 'Scope 1 & 2 Verification', status: 'Completed', description: 'ISO 14064-3 third-party assurance complete.', standard: 'ISO 14064' },
  { year: 2024, title: '100% Renewable Procurement', status: 'In Progress', description: 'Switching global data centers to PPA-backed solar.', standard: 'RE100' },
  { year: 2025, title: '50% Fleet Electrification', status: 'Scheduled', description: 'Transitioning all logistical heavy-duty assets to EV.', standard: 'IEA NZE' },
  { year: 2030, title: 'Net Zero Operational', status: 'Scheduled', description: 'Full value chain alignment with 1.5°C pathway.', standard: 'SBTi' },
];

export const COMPANY_REGISTRY: CompanyRegistryEntry[] = [
  {
    id: 'vanguard',
    name: 'Vanguard Logistics',
    region: 'North America',
    year: '2024',
    kpi: {
      totalEmissions: { value: '1.2M', unit: 'tCO2e', change: '-8%', trend: 'down' },
      carbonIntensity: { value: '12.4', unit: 'tCO2e/$M', change: '-4%', trend: 'down' },
      yoyReduction: { value: '96k', unit: 'tCO2e', status: 'On Track' },
      netZeroProgress: { percentage: 45, targetYear: 2040 },
    },
    history: genHistory(100, 15),
    milestones: [
      { year: 2022, title: 'Biofuel Integration', status: 'Completed', description: '20% fleet switched to HVO100.', standard: 'RTFO' },
      { year: 2024, title: 'Hydrogen Truck Pilot', status: 'In Progress', description: 'Deploying 5 Class-8 fuel cell vehicles.', standard: 'SBTi' },
      ...defaultMilestones.slice(2)
    ]
  },
  {
    id: 'nexus',
    name: 'Nexus Data Systems',
    region: 'European Union',
    year: '2024',
    kpi: {
      totalEmissions: { value: '450k', unit: 'tCO2e', change: '-15%', trend: 'down' },
      carbonIntensity: { value: '4.2', unit: 'tCO2e/$M', change: '-12%', trend: 'down' },
      yoyReduction: { value: '67k', unit: 'tCO2e', status: 'Ahead' },
      netZeroProgress: { percentage: 72, targetYear: 2030 },
    },
    history: genHistory(38, 5),
    milestones: [
      { year: 2023, title: 'Liquid Cooling Rollout', status: 'Completed', description: 'Reduced cooling energy by 35%.', standard: 'ASHRAE' },
      { year: 2025, title: 'Carbon-Free Energy 24/7', status: 'Scheduled', description: 'Hourly matching of load with local green supply.', standard: 'Google CFE' },
      { year: 2028, title: 'Net Zero Data Chain', status: 'Scheduled', description: 'Scope 3 fully neutral through removal.', standard: 'CSRD' }
    ]
  },
  {
    id: 'prime',
    name: 'Prime Manufacturing',
    region: 'India',
    year: '2024',
    kpi: {
      totalEmissions: { value: '2.8M', unit: 'tCO2e', change: '+2%', trend: 'up' },
      carbonIntensity: { value: '42.1', unit: 'tCO2e/$M', change: '-10%', trend: 'down' },
      yoyReduction: { value: '-56k', unit: 'tCO2e', status: 'Critical' },
      netZeroProgress: { percentage: 20, targetYear: 2050 },
    },
    history: genHistory(230, 40),
    milestones: [
      { year: 2024, title: 'Solar Farm Commissioning', status: 'In Progress', description: '50MW captive solar field for factory power.', standard: 'MNRE' },
      { year: 2026, title: 'Heat Recovery System', status: 'Scheduled', description: 'Capturing furnace waste heat for steam.', standard: 'ISO 50001' },
      { year: 2035, title: 'RE100 Commitment', status: 'Scheduled', description: 'Full renewable energy across global ops.', standard: 'RE100' }
    ]
  },
  {
    id: 'ecoretail',
    name: 'EcoRetail Global',
    region: 'European Union',
    year: '2023',
    kpi: {
      totalEmissions: { value: '890k', unit: 'tCO2e', change: '-5%', trend: 'down' },
      carbonIntensity: { value: '8.4', unit: 'tCO2e/$M', change: '-2%', trend: 'down' },
      yoyReduction: { value: '44k', unit: 'tCO2e', status: 'On Track' },
      netZeroProgress: { percentage: 55, targetYear: 2035 },
    },
    history: genHistory(75, 10),
    milestones: defaultMilestones
  },
  {
    id: 'zenith',
    name: 'Zenith Electronics',
    region: 'APAC',
    year: '2024',
    kpi: {
      totalEmissions: { value: '610k', unit: 'tCO2e', change: '-9%', trend: 'down' },
      carbonIntensity: { value: '5.8', unit: 'tCO2e/$M', change: '-6%', trend: 'down' },
      yoyReduction: { value: '55k', unit: 'tCO2e', status: 'On Track' },
      netZeroProgress: { percentage: 60, targetYear: 2030 },
    },
    history: genHistory(50, 8),
    milestones: defaultMilestones
  },
  {
    id: 'skylink',
    name: 'SkyLink Aviation',
    region: 'APAC',
    year: '2024',
    kpi: {
      totalEmissions: { value: '5.4M', unit: 'tCO2e', change: '+4%', trend: 'up' },
      carbonIntensity: { value: '115.2', unit: 'tCO2e/$M', change: '-1%', trend: 'down' },
      yoyReduction: { value: '-210k', unit: 'tCO2e', status: 'At Risk' },
      netZeroProgress: { percentage: 12, targetYear: 2050 },
    },
    history: genHistory(450, 60),
    milestones: [
      { year: 2024, title: 'SAF Procurement Agreement', status: 'In Progress', description: 'Securing 10% SAF blend for major hubs.', standard: 'CORSIA' },
      { year: 2027, title: 'Electric Ground Support', status: 'Scheduled', description: '100% electric ground equipment.', standard: 'IATA' }
    ]
  },
  {
    id: 'terramining',
    name: 'Terra Mining',
    region: 'APAC',
    year: '2022',
    kpi: {
      totalEmissions: { value: '12.4M', unit: 'tCO2e', change: '+12%', trend: 'up' },
      carbonIntensity: { value: '154.0', unit: 'tCO2e/$M', change: '-2%', trend: 'down' },
      yoyReduction: { value: '-1.4M', unit: 'tCO2e', status: 'Critical' },
      netZeroProgress: { percentage: 5, targetYear: 2060 },
    },
    history: genHistory(980, 120),
    milestones: [
      { year: 2025, title: 'Autonomous EV Haulers', status: 'Scheduled', description: 'Replacing diesel trucks with electric.', standard: 'Mining 4.0' }
    ]
  },
  {
    id: 'biopharma',
    name: 'BioPharma Labs',
    region: 'European Union',
    year: '2024',
    kpi: {
      totalEmissions: { value: '120k', unit: 'tCO2e', change: '-22%', trend: 'down' },
      carbonIntensity: { value: '1.4', unit: 'tCO2e/$M', change: '-18%', trend: 'down' },
      yoyReduction: { value: '26k', unit: 'tCO2e', status: 'Exceeding' },
      netZeroProgress: { percentage: 88, targetYear: 2028 },
    },
    history: genHistory(10, 2),
    milestones: [
      { year: 2023, title: 'Cold Chain Optimization', status: 'Completed', description: 'Smart sensors reduced spoilage by 15%.', standard: 'FDA' },
      { year: 2024, title: 'LEED Platinum Facility', status: 'Completed', description: 'HQ certified as net positive energy.', standard: 'LEED' }
    ]
  },
  {
    id: 'oceanfreight',
    name: 'Ocean Freight Corp',
    region: 'European Union',
    year: '2023',
    kpi: {
      totalEmissions: { value: '3.1M', unit: 'tCO2e', change: '-2%', trend: 'down' },
      carbonIntensity: { value: '88.4', unit: 'tCO2e/$M', change: '-4%', trend: 'down' },
      yoyReduction: { value: '62k', unit: 'tCO2e', status: 'On Track' },
      netZeroProgress: { percentage: 25, targetYear: 2045 },
    },
    history: genHistory(250, 30),
    milestones: defaultMilestones
  },
  {
    id: 'solargrid',
    name: 'Solar Grid Energy',
    region: 'North America',
    year: '2024',
    kpi: {
      totalEmissions: { value: '85k', unit: 'tCO2e', change: '-40%', trend: 'down' },
      carbonIntensity: { value: '0.8', unit: 'tCO2e/$M', change: '-35%', trend: 'down' },
      yoyReduction: { value: '34k', unit: 'tCO2e', status: 'Near Zero' },
      netZeroProgress: { percentage: 94, targetYear: 2025 },
    },
    history: genHistory(7, 1),
    milestones: [
      { year: 2024, title: 'Carbon Negative Operations', status: 'In Progress', description: 'Absorbing more than emitting.', standard: 'Gold Std' }
    ]
  },
];

export const EMISSIONS_HISTORY: EmissionData[] = COMPANY_REGISTRY[1].history;
export const KPI_DATA: KPIStats = COMPANY_REGISTRY[1].kpi;

export const STRATEGIC_MILESTONES: Milestone[] = defaultMilestones;

export const RISK_REGISTRY: RiskEntry[] = [
  { id: 'r1', category: 'Transition', type: 'Policy', risk: 'Carbon Pricing Escalation', impact: 'High', probability: 'High', mitigation: 'Internal carbon fee implementation', financialExposure: '$12.4M' },
  { id: 'r2', category: 'Physical', type: 'Acute', risk: 'Extreme Weather disruption', impact: 'Medium', probability: 'Medium', mitigation: 'Supply chain diversification', financialExposure: '$4.2M' },
  { id: 'r3', category: 'Transition', type: 'Market', risk: 'Shift in Consumer Preference', impact: 'High', probability: 'Medium', mitigation: 'Product circularity redesign', financialExposure: '$8.5M' },
  { id: 'r4', category: 'Physical', type: 'Chronic', risk: 'Sea Level Rise (Port Assets)', impact: 'Low', probability: 'High', mitigation: 'Asset relocation strategy', financialExposure: '$2.1M' },
  { id: 'r5', category: 'Transition', type: 'Legal', risk: 'Greenwashing Litigation', impact: 'Medium', probability: 'Low', mitigation: 'Third-party assurance audit', financialExposure: '$5.5M' },
  { id: 'r6', category: 'Physical', type: 'Acute', risk: 'Flash Flooding (Data Centers)', impact: 'High', probability: 'Medium', mitigation: 'Geo-redundancy & flood barriers', financialExposure: '$18.2M' },
  { id: 'r7', category: 'Transition', type: 'Technology', risk: 'Grid Instability', impact: 'Medium', probability: 'High', mitigation: 'BESS (Battery Storage) deployment', financialExposure: '$3.8M' },
  { id: 'r8', category: 'Physical', type: 'Chronic', risk: 'Heat Stress (Workforce)', impact: 'Low', probability: 'High', mitigation: 'Adaptive shift scheduling', financialExposure: '$1.2M' },
];

export const SCOPE_CATEGORIES: ScopeCategory[] = [
  { id: '1', name: 'Purchased Goods & Services', emissions: 215400, percentage: 48, yoyChange: -5.2, quality: 'High', type: 'Upstream' },
  { id: '11', name: 'Use of Sold Products', emissions: 150200, percentage: 33, yoyChange: 2.1, quality: 'Medium', type: 'Downstream' },
  { id: '6', name: 'Business Travel', emissions: 24500, percentage: 5.4, yoyChange: -15.4, quality: 'High', type: 'Upstream' },
  { id: '4', name: 'Upstream Transportation', emissions: 18300, percentage: 4.1, yoyChange: 0.0, quality: 'Low', type: 'Upstream' },
  { id: '5', name: 'Waste in Operations', emissions: 12100, percentage: 2.7, yoyChange: -8.1, quality: 'Medium', type: 'Upstream' },
];

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  { id: 'f1', name: 'BRSR', fullName: 'Business Responsibility and Sustainability Reporting', jurisdiction: 'India', readiness: 85, status: 'In Progress', regulator: 'SEBI', description: 'Mandatory for top 1000 listed entities in India.', keyDisclosures: ['GHG intensity', 'Resource usage', 'Social well-being'] },
  { id: 'f2', name: 'CSRD', fullName: 'Corporate Sustainability Reporting Directive', jurisdiction: 'European Union', readiness: 42, status: 'At Risk', regulator: 'EFRAG', description: 'Requires double materiality and third-party assurance.', keyDisclosures: ['Double Materiality', 'Value chain impacts', 'Pollution Control'] },
  { id: 'f3', name: 'RBI ESG', fullName: 'Climate Risk & Sustainable Finance Guidelines', jurisdiction: 'India', readiness: 70, status: 'In Progress', regulator: 'RBI', description: 'Mandatory climate-related financial disclosures for regulated entities.', keyDisclosures: ['Stress Testing', 'Internal Carbon Pricing', 'Green Deposits'] },
  { id: 'f4', name: 'SFDR', fullName: 'Sustainable Finance Disclosure Regulation', jurisdiction: 'European Union', readiness: 95, status: 'Compliant', regulator: 'ESMA', description: 'Classifies investment funds by sustainability integration.', keyDisclosures: ['PAI indicators', 'Article 8/9 status'] },
  { id: 'f5', name: 'EBA Pillar 3', fullName: 'ESG Risk Pillar 3 Disclosures', jurisdiction: 'European Union', readiness: 60, status: 'In Progress', regulator: 'EBA', description: 'Standardized tables for banking institutions to report transition risks.', keyDisclosures: ['BTAR', 'GAR (Green Asset Ratio)', 'Physical Risk'] },
  { id: 'f6', name: 'PRA/FCA', fullName: 'Climate Change Risk Supervision', jurisdiction: 'United Kingdom', readiness: 88, status: 'Compliant', regulator: 'PRA/FCA', description: 'Supervisory expectations for managing climate-related financial risks.', keyDisclosures: ['Governance', 'Scenario Analysis'] },
  { id: 'f7', name: 'ISSB (S1/S2)', fullName: 'IFRS Sustainability Disclosure Standards', jurisdiction: 'Global', readiness: 50, status: 'In Progress', regulator: 'ISSB', description: 'Global baseline for sustainability-related financial disclosures.', keyDisclosures: ['S1: General Requirements', 'S2: Climate-related'] },
  { id: 'f8', name: 'EU Taxonomy', fullName: 'Green Taxonomy Classification', jurisdiction: 'European Union', readiness: 30, status: 'At Risk', regulator: 'EU Commission', description: 'A classification system for sustainable economic activities.', keyDisclosures: ['Eligibility %', 'Alignment %', 'DNSH criteria'] },
];

export const REGULATORY_CALENDAR: RegulatoryDeadline[] = [
  { id: 'd1', framework: 'BRSR', event: 'FY 2024 Filing Deadline', date: '2024-06-30', priority: 'Critical' },
  { id: 'd2', framework: 'SFDR', event: 'PAI Annual Disclosure', date: '2024-05-30', priority: 'High' },
  { id: 'd3', framework: 'CSRD', event: 'Gap Assessment Assurance', date: '2024-10-15', priority: 'Medium' },
  { id: 'd4', framework: 'RBI', event: 'Climate Stress Test Report', date: '2024-12-01', priority: 'Critical' },
];

export const LEVERS: DecarbonizationLever[] = [
  { id: 'lever-1', name: 'Renewable Energy Purchase', status: 'Active', statusType: 'Active', currentReduction: 25000, maxReduction: 80000, progress: 80, icon: 'solar_power', color: 'blue-500' },
  { id: 'lever-2', name: 'EV Fleet Transition', status: 'Planning', statusType: 'Planning', currentReduction: 12000, maxReduction: 45000, progress: 40, icon: 'local_shipping', color: 'indigo-500' },
  { id: 'lever-3', name: 'Circular Packaging', status: 'Active', statusType: 'Active', currentReduction: 8500, maxReduction: 30000, progress: 65, icon: 'recycling', color: 'green-500' },
];

export const CARBON_CREDITS: CarbonCredit[] = [
  { id: 'cred-1', projectName: 'Climeworks Orca DAC', type: 'Removal', methodology: 'Direct Air Capture', volume: 5000, costPerTon: 850, vintage: '2023', standard: 'Puro.earth', status: 'Retired' },
  { id: 'cred-2', projectName: 'Amazonian Basin Reforestation', type: 'Removal', methodology: 'Afforestation', volume: 25000, costPerTon: 45, vintage: '2022', standard: 'Verra', status: 'Active' },
];
