
import { NavItem, StatData, RiskItem, TransitionStep, DisclosureRequirement, BusinessUnit, MaterialityTopic, Stakeholder, IROAssessment, RiskCategory } from './types';

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: 'account_tree' },
  { id: 'reports', label: 'Reports', icon: 'description' },
  { id: 'materiality', label: 'Materiality', icon: 'scatter_plot' },
  { id: 'risk-assessment', label: 'Risk Assessment', icon: 'security' },
  { id: 'data-entry', label: 'Data Entry', icon: 'bar_chart' },
];

export const DEFAULT_COMPANIES = [
  { id: 'apple', name: 'Apple Inc.', sector: 'Technology', ticker: 'AAPL' },
  { id: 'tesla', name: 'Tesla, Inc.', sector: 'Automotive', ticker: 'TSLA' },
  { id: 'microsoft', name: 'Microsoft Corp.', sector: 'Technology', ticker: 'MSFT' },
  { id: 'unilever', name: 'Unilever PLC', sector: 'Consumer Goods', ticker: 'UL' },
];

export const RISK_REGISTRY: RiskCategory[] = [
  {
    id: 'phys-acute',
    type: 'Physical',
    group: 'Acute Risks',
    subCategories: [
      { id: 'p1', name: 'Extreme Flooding', description: 'Increased frequency of 1-in-100 year flood events impacting coastal logistics.', severity: 'High', probability: 'Possible', financialImpact: '$4.2M', mitigationStrategy: 'Physical flood barriers & asset relocation.' },
      { id: 'p2', name: 'Severe Storms', description: 'Tropical cyclones disrupting supply lines in APAC region.', severity: 'Medium', probability: 'Likely', financialImpact: '$2.8M', mitigationStrategy: 'Business continuity planning & supply redundancy.' },
      { id: 'p3', name: 'Wildfire Risk', description: 'Drought-induced fires threatening Western US manufacturing facilities.', severity: 'High', probability: 'Possible', financialImpact: '$1.5M', mitigationStrategy: 'Vegetation management & enhanced fire suppression.' }
    ]
  },
  {
    id: 'phys-chronic',
    type: 'Physical',
    group: 'Chronic Risks',
    subCategories: [
      { id: 'p4', name: 'Rising Sea Levels', description: 'Long-term inundation of port-side infrastructure.', severity: 'High', probability: 'Likely', financialImpact: '$12M', mitigationStrategy: 'Strategic long-term asset divestment/reinforcement.' },
      { id: 'p5', name: 'Heat Stress', description: 'Reduced labor productivity and increased cooling costs across data centers.', severity: 'Medium', probability: 'Likely', financialImpact: '$3.1M', mitigationStrategy: 'HVAC upgrades & sustainable cooling systems.' },
      { id: 'p6', name: 'Precipitation Change', description: 'Impact on hydropower stability for EU manufacturing sites.', severity: 'Low', probability: 'Possible', financialImpact: '$0.8M', mitigationStrategy: 'Energy source diversification.' }
    ]
  },
  {
    id: 'trans-policy',
    type: 'Transition',
    group: 'Policy & Legal',
    subCategories: [
      { id: 't1', name: 'Carbon Pricing', description: 'Expansion of EU ETS and Introduction of US Carbon Tax.', severity: 'High', probability: 'Likely', financialImpact: '$8.5M', mitigationStrategy: 'Aggressive decarbonization & internal carbon shadow price.' },
      { id: 't2', name: 'Enhanced Disclosures', description: 'Mandatory CSRD/ISSB alignment penalties.', severity: 'Medium', probability: 'Likely', financialImpact: '$1.2M', mitigationStrategy: 'ESG Nexus platform implementation.' }
    ]
  },
  {
    id: 'trans-tech',
    type: 'Transition',
    group: 'Technology',
    subCategories: [
      { id: 't3', name: 'Low-carbon Shift', description: 'High R&D costs for sustainable material substitution.', severity: 'Medium', probability: 'Possible', financialImpact: '$5.5M', mitigationStrategy: 'Strategic R&D partnerships & VC investment.' },
      { id: 't4', name: 'Asset Obsolescence', description: 'Write-downs of internal combustion engine related assets.', severity: 'High', probability: 'Possible', financialImpact: '$15M', mitigationStrategy: 'Accelerated depreciation & transition to EV hubs.' }
    ]
  }
];

export const MATERIALITY_TOPICS: MaterialityTopic[] = [
  { id: 't1', name: 'Climate Change', category: 'Environmental', financialMateriality: 92, impactMateriality: 95, description: 'Mitigation and adaptation strategies regarding global temperature rises.', stakeholders: ['Investors', 'Regulators', 'Local Communities'] },
  { id: 't2', name: 'Water Stewardship', category: 'Environmental', financialMateriality: 65, impactMateriality: 82, description: 'Efficient water use and wastewater management in water-stressed regions.', stakeholders: ['Local Communities', 'Suppliers'] },
  { id: 't3', name: 'Labor Rights', category: 'Social', financialMateriality: 55, impactMateriality: 88, description: 'Ensuring fair wages and safe working conditions across the value chain.', stakeholders: ['Employees', 'Regulators', 'Suppliers'] },
  { id: 't4', name: 'Circular Economy', category: 'Environmental', financialMateriality: 78, impactMateriality: 72, description: 'Resource efficiency and waste reduction through product lifecycle management.', stakeholders: ['Customers', 'Investors'] },
  { id: 't5', name: 'Data Privacy', category: 'Governance', financialMateriality: 85, impactMateriality: 60, description: 'Protecting user data and ensuring digital security standards.', stakeholders: ['Customers', 'Regulators'] },
  { id: 't6', name: 'Biodiversity', category: 'Environmental', financialMateriality: 40, impactMateriality: 85, description: 'Protecting local flora and fauna around operational sites.', stakeholders: ['Local Communities', 'NGOs'] }
];

export const STAKEHOLDERS: Stakeholder[] = [
  { id: 's1', name: 'Investors', salience: 95, concerns: ['Financial ROI', 'Risk Exposure', 'TCFD Alignment'], icon: 'payments' },
  { id: 's2', name: 'Employees', salience: 82, concerns: ['Workplace Safety', 'Career Growth', 'Inclusion'], icon: 'groups' },
  { id: 's3', name: 'Regulators', salience: 90, concerns: ['CSRD Compliance', 'Auditability', 'Reporting Accuracy'], icon: 'gavel' },
  { id: 's4', name: 'Local Communities', salience: 75, concerns: ['Pollution', 'Employment', 'Resource Access'], icon: 'home_pin' },
  { id: 's5', name: 'Customers', salience: 88, concerns: ['Product Sustainability', 'Ethics', 'Supply Chain Traceability'], icon: 'shopping_cart' }
];

export const IRO_ASSESSMENTS: IROAssessment[] = [
  { topicId: 't1', impactType: 'Negative', impactScale: 90, riskDescription: 'Physical damage to coastal assets from rising sea levels.', opportunityDescription: 'Reduced energy costs via early solar transition.', horizon: 'Long', financialMagnitude: 'High' },
  { topicId: 't2', impactType: 'Negative', impactScale: 75, riskDescription: 'Operational shutdowns in Asia due to seasonal water scarcity.', opportunityDescription: 'New revenue stream from patented water recycling tech.', horizon: 'Medium', financialMagnitude: 'Medium' },
  { topicId: 't3', impactType: 'Positive', impactScale: 80, riskDescription: 'Supply chain disruption due to potential labor strikes.', opportunityDescription: 'Increased productivity through superior retention rates.', horizon: 'Short', financialMagnitude: 'Low' },
];

export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    id: 'bu-1',
    name: 'Advanced Manufacturing',
    region: 'Europe',
    employees: 1250,
    esgScore: 88,
    status: 'Verified',
    emissions: 42000,
    revenueLink: '18%',
    icon: 'factory'
  },
  {
    id: 'bu-2',
    name: 'Logistics & Supply',
    region: 'United States',
    employees: 850,
    esgScore: 72,
    status: 'Action Required',
    emissions: 28000,
    revenueLink: '24%',
    icon: 'local_shipping'
  },
  {
    id: 'bu-3',
    name: 'R&D Labs',
    region: 'Asia',
    employees: 320,
    esgScore: 94,
    status: 'Verified',
    emissions: 12000,
    revenueLink: '12%',
    icon: 'science'
  },
  {
    id: 'bu-4',
    name: 'EMEA Corporate',
    region: 'Europe',
    employees: 180,
    esgScore: 81,
    status: 'In Review',
    emissions: 5000,
    revenueLink: '5%',
    icon: 'business'
  }
];

export const STATS: StatData[] = [
  {
    label: 'Scopes 1, 2 & 3 (tCO2e)',
    value: '142,500',
    unit: 'Gross',
    trend: 'down',
    percentage: '-8.4%',
    subLabel: 'YoY Intensity',
    icon: 'cloud',
    bgIcon: 'co2',
    color: 'text-primary',
    scope: ['Global', 'Asia', 'Europe', 'United States']
  },
  {
    label: 'Financial Impact',
    value: '$12.4M',
    unit: 'CapEx',
    trend: 'up',
    percentage: '+15%',
    subLabel: 'Climate Spend',
    icon: 'account_balance',
    bgIcon: 'savings',
    color: 'text-[#f97316]',
    scope: ['Global', 'United States', 'Oceania']
  },
  {
    label: 'Governance Linkage',
    value: '85%',
    unit: 'Exec Pay',
    trend: 'neutral',
    percentage: 'Linked to Climate',
    subLabel: 'Targets',
    icon: 'policy',
    bgIcon: 'gavel',
    color: 'text-[#3b82f6]',
    standard: ['IFRS S1/S2', 'TCFD', 'EU CSRD']
  },
  {
    label: 'Internal Carbon Price',
    value: '$85.00',
    unit: '/ tCO2e',
    trend: 'neutral',
    percentage: 'Shadow Price',
    subLabel: 'Implemented',
    icon: 'payments',
    bgIcon: 'price_change',
    color: 'text-[#eab308]',
    scope: ['Global', 'Europe', 'United Kingdom']
  }
];

export const RISKS: RiskItem[] = [
  {
    id: 'risk-1',
    category: 'PHYSICAL RISKS',
    exposure: 'High Exposure',
    icon: 'flood',
    title: 'Extreme Weather Events',
    description: 'Assets in coastal regions identified. Mitigation plan funded.',
    color: '#f97316',
    hotspots: [
      { x: 120, y: 140, label: 'NA Coastal Facility', scope: 'United States' },
      { x: 380, y: 160, label: 'EU Coastal Hub', scope: 'Europe' },
      { x: 620, y: 220, label: 'APAC Logistics', scope: 'Asia' }
    ]
  },
  {
    id: 'risk-2',
    category: 'TRANSITION RISKS',
    exposure: 'Med Exposure',
    icon: 'gavel',
    title: 'Carbon Pricing Policy',
    description: 'Regulatory shift in EU/NA markets impacting operational costs.',
    color: '#eab308',
    hotspots: [
      { x: 420, y: 120, label: 'EU Regulatory Zone', scope: 'Europe' },
      { x: 150, y: 110, label: 'NA Carbon Market', scope: 'United States' },
      { x: 480, y: 100, label: 'UK Carbon Desk', scope: 'United Kingdom' }
    ]
  },
  {
    id: 'risk-3',
    category: 'OPPORTUNITIES',
    exposure: 'Strategic',
    icon: 'solar_power',
    title: 'Renewable Shift',
    description: 'Cost savings projected at $5M/yr post-implementation.',
    color: '#13eca4',
    hotspots: [
      { x: 550, y: 180, label: 'Solar Farm Alpha', scope: 'Asia' },
      { x: 320, y: 250, label: 'Wind Project Beta', scope: 'Europe' },
      { x: 700, y: 300, label: 'Oceania Grid', scope: 'Oceania' }
    ]
  }
];

export const TRANSITION_PLAN: TransitionStep[] = [
  {
    title: 'Scope 1 & 2 Audit',
    date: 'Methodology Review • Q1 2024',
    status: 'Assured',
    color: '#13eca4',
    year: '2024',
    standard: ['IFRS S1/S2', 'GRI']
  },
  {
    title: 'Supply Chain Decarb',
    date: 'Vendor Engagement • Q3 2024',
    status: 'Active',
    tags: ['Scope 3'],
    color: '#f97316',
    year: '2024',
    standard: ['EU CSRD', 'TCFD']
  },
  {
    title: 'Carbon Offsetting',
    date: 'Nature-based solutions • 2025',
    status: 'Planned',
    color: '#3b82f6',
    year: '2025',
    standard: ['IFRS S1/S2']
  },
  {
    title: 'Resilience Capex',
    date: 'Asset retrofitting • 2026',
    status: 'Budgeting',
    color: '#5c736a',
    year: '2026',
    standard: ['EU VSME', 'TCFD']
  },
  {
    title: 'Historical Verification',
    date: 'Legacy data audit • 2023',
    status: 'Completed',
    color: '#9db9b0',
    year: '2023',
    standard: ['BRSR', 'GRI']
  }
];

export const DISCLOSURE_REQUIREMENTS: DisclosureRequirement[] = [
  {
    id: '1',
    metric: 'GHG Emissions (Gross)',
    subMetric: 'Scope 1, Scope 2, Scope 3 (Category 1-15)',
    standard: 'IFRS S1/S2',
    year: '2024',
    scope: 'Global',
    methodology: 'GHG Protocol',
    assurance: 'Limited',
    completeness: 100,
    status: 'Limited'
  },
  {
    id: '2',
    metric: 'Governance & Remuneration',
    subMetric: 'Board oversight of climate risks',
    standard: 'IFRS S1/S2',
    year: '2024',
    scope: 'Global',
    methodology: 'Internal Policy',
    assurance: 'Self-declared',
    completeness: 90,
    status: 'Self-declared'
  },
  {
    id: '3',
    metric: 'Scenario Resilience',
    subMetric: 'Strategy resilience under 1.5C',
    standard: 'TCFD',
    year: '2023',
    scope: 'Europe',
    methodology: 'IEA NZE',
    assurance: 'Pending',
    completeness: 65,
    status: 'Pending'
  },
  {
    id: '4',
    metric: 'Capital Deployment',
    subMetric: 'Expenditure towards climate targets',
    standard: 'IFRS S1/S2',
    year: '2025',
    scope: 'United States',
    methodology: 'Financial Rep.',
    assurance: 'Reasonable',
    completeness: 85,
    status: 'Reasonable'
  },
  {
    id: '5',
    metric: 'Double Materiality',
    subMetric: 'Financial & Impact Materiality',
    standard: 'EU CSRD',
    year: '2024',
    scope: 'Europe',
    methodology: 'ESRS',
    assurance: 'Pending',
    completeness: 40,
    status: 'Pending'
  },
  {
    id: '6',
    metric: 'Water Stewardship',
    subMetric: 'Withdrawal from water-stressed areas',
    standard: 'GRI',
    year: '2022',
    scope: 'Oceania',
    methodology: 'GRI 303',
    assurance: 'Limited',
    completeness: 100,
    status: 'Limited'
  },
  {
    id: '7',
    metric: 'Energy Efficiency',
    subMetric: 'Intensity per square meter',
    standard: 'BRSR',
    year: '2023',
    scope: 'Asia',
    methodology: 'ISO 50001',
    assurance: 'Reasonable',
    completeness: 100,
    status: 'Reasonable'
  },
  {
    id: '8',
    metric: 'SME Carbon Footprint',
    subMetric: 'Simplified Scope 1 & 2',
    standard: 'EU VSME',
    year: '2026',
    scope: 'United Kingdom',
    methodology: 'Direct Measurement',
    assurance: 'Self-declared',
    completeness: 100,
    status: 'Self-declared'
  },
  {
    id: '9',
    metric: 'Biodiversity Impact',
    subMetric: 'Habitat restoration progress',
    standard: 'GRI',
    year: '2021',
    scope: 'Global',
    methodology: 'GRI 304',
    assurance: 'Limited',
    completeness: 55,
    status: 'Limited'
  },
  {
    id: '10',
    metric: 'Climate Risk Governance',
    subMetric: 'Audit committee oversight',
    standard: 'TCFD',
    year: '2020',
    scope: 'Global',
    methodology: 'Internal Governance',
    assurance: 'Reasonable',
    completeness: 100,
    status: 'Reasonable'
  },
  {
    id: '11',
    metric: 'Historical Emissions',
    subMetric: 'Baseline verification',
    standard: 'BRSR',
    year: '2019',
    scope: 'Asia',
    methodology: 'Local Standards',
    assurance: 'Limited',
    completeness: 100,
    status: 'Limited'
  },
  {
    id: '12',
    metric: 'Foundational Disclosures',
    subMetric: 'Entity boundary definitions',
    standard: 'IFRS S1/S2',
    year: '2018',
    scope: 'Global',
    methodology: 'General Principles',
    assurance: 'Reasonable',
    completeness: 100,
    status: 'Reasonable'
  },
  {
    id: '13',
    metric: 'Supply Chain Audits',
    subMetric: 'Tier 1 vendor compliance',
    standard: 'EU CSRD',
    year: '2025',
    scope: 'United Kingdom',
    methodology: 'ESRS G1',
    assurance: 'Pending',
    completeness: 20,
    status: 'Pending'
  },
  {
    id: '14',
    metric: 'Labor Rights',
    subMetric: 'Collective bargaining coverage',
    standard: 'BRSR',
    year: '2022',
    scope: 'Asia',
    methodology: 'ILO Guidelines',
    assurance: 'Self-declared',
    completeness: 88,
    status: 'Self-declared'
  },
  {
    id: '15',
    metric: 'Waste Diversion',
    subMetric: 'Total tonnage to landfill',
    standard: 'GRI',
    year: '2017',
    scope: 'Global',
    methodology: 'GRI 306',
    assurance: 'Limited',
    completeness: 100,
    status: 'Limited'
  }
];

export const RESILIENCE_DATA = [
  { year: '2020', ssp1_19: 100, ssp1_26: 100, ssp2_45: 100, ssp3_70: 100, ssp5_85: 100, current: 100 },
  { year: '2025', ssp1_19: 110, ssp1_26: 115, ssp2_45: 112, ssp3_70: 105, ssp5_85: 98, current: 100 },
  { year: '2030', ssp1_19: 120, ssp1_26: 125, ssp2_45: 118, ssp3_70: 100, ssp5_85: 85, current: 95 },
  { year: '2040', ssp1_19: 135, ssp1_26: 140, ssp2_45: 125, ssp3_70: 85, ssp5_85: 60, current: 80 },
  { year: '2050', ssp1_19: 155, ssp1_26: 150, ssp2_45: 120, ssp3_70: 65, ssp5_85: 40, current: 60 },
  { year: '2075', ssp1_19: 180, ssp1_26: 165, ssp2_45: 100, ssp3_70: 35, ssp5_85: 20, current: 40 },
  { year: '2100', ssp1_19: 200, ssp1_26: 175, ssp2_45: 85, ssp3_70: 15, ssp5_85: 10, current: 20 },
];
