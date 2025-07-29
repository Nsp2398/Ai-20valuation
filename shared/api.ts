// Example of how to share interfaces between client and server
export interface DemoResponse {
  message: string;
}

// Authentication Types
export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email?: string;
  phone?: string;
  password?: string;
  verificationCode?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface VerificationRequest {
  phone: string;
  firstName?: string;
  lastName?: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  codeSent?: boolean;
}

// Business Valuation Types
export interface ValuationRequest {
  companyName: string;
  industry: string;
  stage: "idea" | "pre-revenue" | "early-revenue" | "growth";
  description: string;
  revenue?: number;
  expenses?: number;
  teamSize: number;
  marketSize: string;
  fundingGoal: number;
  businessModel?: string;
  projectedRevenue?: number;
  burnRate?: number;
  runway?: number;
  previousFunding?: string;
  geographicMarket?: string;
  competition?: string;
  useOfFunds?: string;
}

export interface ValuationMethod {
  name: string;
  confidence: number;
  applicableStages: string[];
  description: string;
}

export interface ValuationResult {
  id: string;
  userId: string;
  companyName: string;
  estimatedValuation: {
    min: number;
    max: number;
    primary: number;
  };
  methods: {
    name: string;
    value: number;
    confidence: number;
    weight: number;
  }[];
  primaryMethod: string;
  confidence: number;
  createdAt: string;
  reportUrl?: string;
}

export interface ValuationResponse {
  success: boolean;
  message: string;
  result?: ValuationResult;
  recommendedMethods?: ValuationMethod[];
}

// Dashboard Types
export interface DashboardData {
  user: User;
  recentValuations: ValuationResult[];
  totalValuations: number;
  averageValuation: number;
  portfolioGrowth: number;
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  message: string;
}

// Report Types
export interface ReportRequest {
  valuationId: string;
  format: "pdf" | "docx";
}

export interface ReportResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  reportId?: string;
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
