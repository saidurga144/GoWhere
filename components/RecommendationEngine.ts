
import { Destination, UserPreferences, RecommendationMatch, BudgetRange } from '../types';

export const calculateMatchScore = (pref: UserPreferences, dest: Destination): number => {
  let score = 0;
  const weights = {
    budget: 30,
    style: 25,
    climate: 20,
    activities: 15,
    duration: 10
  };

  // 1. Budget Alignment (Crucial)
  if (pref.budget === dest.budgetLevel) {
    score += weights.budget;
  } else if (
    (pref.budget === BudgetRange.LUXURY && dest.budgetLevel === BudgetRange.MODERATE) ||
    (pref.budget === BudgetRange.MODERATE && dest.budgetLevel === BudgetRange.BUDGET)
  ) {
    score += weights.budget * 0.7; // Partial match if user has higher budget than required
  }

  // 2. Style Alignment
  const sharedStyles = pref.styles.filter(s => dest.primaryStyles.includes(s));
  const styleMatchRatio = sharedStyles.length / Math.max(pref.styles.length, 1);
  score += styleMatchRatio * weights.style;

  // 3. Climate Alignment
  if (pref.climate.includes(dest.climateType)) {
    score += weights.climate;
  }

  // 4. Activities Alignment
  const sharedActivities = pref.interests.filter(i => dest.popularActivities.includes(i));
  const activityMatchRatio = sharedActivities.length / Math.max(pref.interests.length, 1);
  score += activityMatchRatio * weights.activities;

  // 5. Duration (Simple mock logic: most places are fine for any duration, but let's say expensive places need longer to justify)
  score += weights.duration; // Default full for now

  return Math.round(score);
};

export const getRecommendations = (
  pref: UserPreferences, 
  destinations: Destination[]
): RecommendationMatch[] => {
  return destinations
    .map(dest => ({
      destination: dest,
      score: calculateMatchScore(pref, dest)
    }))
    .sort((a, b) => b.score - a.score);
};
