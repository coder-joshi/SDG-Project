export type UserRole = 'citizen' | 'verifier' | 'corporate';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  location: string;
  organization?: string;
  designation?: string;
  agency?: string;
  company?: string;
  avatar: string;
  totalCredits?: number;
  availableCredits?: number;
  usedCompliance?: number;
  activeProjectsCount?: number;
  treesPlanted?: number;
  co2OffsetMT?: number;
  waterSavedLitres?: number;
  verifiedCount?: number;
  pendingCount?: number;
  balanceINR?: number;
  purchasedCredits?: number;
  retiredCredits?: number;
  esgScore?: number;
}

export type GCPActivityType =
  | 'Tree Plantation'
  | 'Water Management'
  | 'Sustainable Agriculture'
  | 'Waste Management'
  | 'Air Pollution Reduction'
  | 'Mangrove Conservation'
  | 'Ecomark Labeling'
  | 'Green Buildings';

export type ProjectStatus = 'Active' | 'Under Review' | 'Submitted' | 'Rejected';

export interface Project {
  id: string;
  title: string;
  applicantId: string;
  applicantName: string;
  activityType: GCPActivityType;
  state: string;
  district: string;
  areaHa: number;
  description: string;
  lat: number;
  lng: number;
  status: ProjectStatus;
  creditsGenerated: number;
  creditsAvailable: number;
  pricePerCreditINR: number;
  submittedDate: string;
  verifiedDate?: string | null;
  verifierName?: string | null;
  rejectionReason?: string;
  images: string[];
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'credit_earned' | 'credit_traded' | 'credit_compliance' | 'verification_pending' | 'verification_rejected';
  amount: string;
  numericAmount: number;
  status: 'Completed' | 'Pending' | 'Rejected';
  badgeColor: 'green' | 'blue' | 'purple' | 'amber' | 'rose';
  title: string;
  description: string;
  txHash: string;
  entity: string;
}

export interface MonthlyCreditData {
  month: string;
  generated: number;
  traded: number;
  used: number;
}

export interface ActivityCreditBreakdown {
  name: string;
  percentage: number;
  credits: number;
  color: string;
}

export interface CreditsData {
  summary: {
    totalCredits: number;
    availableForTrading: number;
    usedForCompliance: number;
    activeProjects: number;
    growthPercentage: number;
  };
  monthlyOverview: MonthlyCreditData[];
  creditsByActivity: ActivityCreditBreakdown[];
  impact: {
    treesPlanted: number;
    co2OffsetMT: number;
    waterSavedLitres: number;
    landRegeneratedHa: number;
  };
}
