export interface VehicleSearchQuery {
  brandId?: string;
  modelId?: string;
  year?: number;
}

export interface QuoteCalculationInput {
  customerId: string;
  versionId: string;
  coverageId: string;
  vehiclePlate?: string;
  vehicleUsage: 'particular' | 'comercial' | 'rideshare';
  insuredValue: number;
  selectedAdditionals?: string[];
}

export interface CustomerInput {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'X';
  address: string;
  postalCode: string;
  city: string;
  province: string;
  licenseDate: string;
  licenseNumber: string;
}

export interface RiskFactors {
  ageFactor: number;
  vehicleAgeFactor: number;
  zoneFactor: number;
  usageFactor: number;
  genderFactor: number;
  claimsHistoryFactor: number;
}

export interface PremiumCalculation {
  basePremium: number;
  riskPremium: number;
  additionalsCost: number;
  totalMonthly: number;
  totalAnnual: number;
  factors: RiskFactors;
}