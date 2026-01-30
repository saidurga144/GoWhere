import { UserPreferences, Destination } from '../types';

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export class GeminiService {
  constructor() {
    // No longer initializing Gemini client - using backend endpoints instead
  }

  /**
   * Generates a personalized reasoning for why a destination matches a user's preferences.
   */
  async getRecommendationReasoning(pref: UserPreferences, dest: Destination): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/gemini-reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: pref,
          destination: dest
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.reasoning || "This destination aligns perfectly with your preferred travel style and interests.";
    } catch (error) {
      console.error("Gemini Reasoning Error:", error);
      return "Matches your profile criteria.";
    }
  }

  /**
  * Analyzes a specific destination for the "Best Time to Visit" flow.
  * Uses the backend AI service (Gemini or configured provider).
   */
  async analyzeDestinationOptimization(destName: string): Promise<{
    bestMonths: string;
    weatherSummary: string;
    budgetImpact: string;
    crowdLevels: string;
    suggestedDuration: string;
  }> {
    const fallbackResponse = {
      bestMonths: "Spring and Autumn.",
      weatherSummary: "Mild temperature with low rainfall.",
      budgetImpact: "Cheaper during shoulder seasons.",
      crowdLevels: "High in peak season.",
      suggestedDuration: "5-7 days."
    };

    // Try Gemini
    try {
      const response = await fetch(`${API_BASE_URL}/gemini-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Best time, weather, budget impact, crowd levels, and suggested duration for visiting ${destName}.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.bestMonths && data.weatherSummary) {
          return {
            bestMonths: data.bestMonths || fallbackResponse.bestMonths,
            weatherSummary: data.weatherSummary || fallbackResponse.weatherSummary,
            budgetImpact: data.budgetImpact || fallbackResponse.budgetImpact,
            crowdLevels: data.crowdLevels || fallbackResponse.crowdLevels,
            suggestedDuration: data.suggestedDuration || fallbackResponse.suggestedDuration
          };
        }
      }
    } catch (error) {
      console.warn("⚠️ Gemini analysis failed:", error);
    }

    // Ultimate fallback
    console.warn("⚠️ AI service failed, using fallback response");
    return fallbackResponse;
  }

  /**
   * Generates a scenic image description for the destination.
   */
  async generateDestinationImage(destName: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/gemini-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: destName
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.imageDescription || null;
    } catch (error) {
      console.error("Image Generation Error:", error);
      return null;
    }
  }

  /**
   * Provides help/troubleshooting guidance for auth flows (login/reset email).
   */
  async getAuthHelp(message: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/gemini-auth-help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.help || "Please double-check your email address, wait 1–2 minutes, and check spam/junk folders.";
    } catch (error) {
      console.error("Gemini Auth Help Error:", error);
      return "Please double-check your email address, wait 1–2 minutes, and check spam/junk folders.";
    }
  }
}

export const geminiService = new GeminiService();
