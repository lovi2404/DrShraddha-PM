
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
}

export interface BusinessUnit {
  id: string;
  name: string;
  region: string;
  employees: number;
  esgScore: number;
  status: 'In Review' | 'Verified' | 'Action Required';
  emissions: number;
  revenueLink: string;
  icon: string;
}

export interface StatData {
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  subLabel: string;
  icon: string;
  bgIcon: string;
  color: string;
  // Filter metadata
  scope?: string[];
  standard?: string[];
}

export interface RiskSubCategory {
  id: string;
  name: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  probability: 'Likely' | 'Possible' | 'Remote';
  financialImpact: string;
  mitigationStrategy: string;
}

export interface RiskCategory {
  id: string;
  type: 'Physical' | 'Transition';
  group: string; // e.g. "Acute", "Policy & Legal"
  subCategories: RiskSubCategory[];
}

export interface MaterialityTopic {
  id: string;
  name: string;
  category: 'Environmental' | 'Social' | 'Governance';
  financialMateriality: number; // 1-100
  impactMateriality: number;    // 1-100
  description: string;
  stakeholders: string[];
}

export interface IROAssessment {
  topicId: string;
  impactType: 'Positive' | 'Negative';
  impactScale: number;
  riskDescription: string;
  opportunityDescription: string;
  horizon: 'Short' | 'Medium' | 'Long';
  financialMagnitude: 'High' | 'Medium' | 'Low';
}

export interface Stakeholder {
  id: string;
  name: string;
  salience: number; // 1-100
  concerns: string[];
  icon: string;
}

export interface MapHotspot {
  x: number;
  y: number;
  label: string;
  scope: string; // Region tag
}

export interface RiskItem {
  id: string;
  category: string;
  exposure: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  hotspots: MapHotspot[];
  scope?: string[];
  // Added optional property to support dynamic filtering flags in components
  hasLocalHotspots?: boolean;
}

export interface TransitionStep {
  title: string;
  date: string;
  status: string;
  tags?: string[];
  color: string;
  year: string;
  standard?: string[];
}

export interface DisclosureRequirement {
  id: string;
  metric: string;
  subMetric: string;
  standard: string;
  year: string;
  scope: string;
  methodology: string;
  assurance: string;
  completeness: number;
  status: 'Limited' | 'Reasonable' | 'Self-declared' | 'Pending';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface CompanyIntelligence {
  summary: string;
  pillars: {
    environmental: string;
    social: string;
    governance: string;
  };
  sources: GroundingChunk[];
}
