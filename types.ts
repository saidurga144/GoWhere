
export enum BudgetRange {
  BUDGET = 'Budget',
  MODERATE = 'Moderate',
  LUXURY = 'Luxury'
}

export enum TravelStyle {
  ADVENTURE = 'Adventure',
  RELAXATION = 'Relaxation',
  CULTURAL = 'Cultural',
  URBAN = 'Urban',
  NATURE = 'Nature'
}

export enum Climate {
  TROPICAL = 'Tropical',
  TEMPERATE = 'Temperate',
  COLD = 'Cold',
  ARID = 'Arid'
}

export interface UserPreferences {
  budget: BudgetRange;
  styles: TravelStyle[];
  climate: Climate[];
  duration: number; // in days
  activities: string[];
  interests: string[];
  seasonalAvailability: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  budgetLevel: BudgetRange;
  primaryStyles: TravelStyle[];
  climateType: Climate;
  popularActivities: string[];
  bestMonths: string[];
  imageUrl: string;
  averageCostPerDay: number;
}

export interface RecommendationMatch {
  destination: Destination;
  score: number;
  reasoning?: string;
}

export interface Recommendation {
  destination: string;
  country: string;
  reason?: string;
  highlights?: string[];
  estimatedCost?: string;
  bestTimeToVisit?: string;
  activities?: string[];
  accommodationSuggestions?: string[];
}

export enum AppStep {
  INTENT_SELECTION = 'intent',
  ONBOARDING = 'onboarding',
  DISCOVERY = 'discovery',
  OPTIMIZATION = 'optimization'
}
