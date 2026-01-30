const API_URL = '/api';

export interface TravelPreferencesInput {
  budget: string;
  duration: number;
  travelStyle: string[];
  interests: string[];
  climate: string[];
  groupSize: number;
  specialRequirements?: string;
}

export interface GeminiRecommendation {
  destination: string;
  country: string;
  reason: string;
  highlights: string[];
  estimatedCost: string;
  bestTimeToVisit: string;
  activities: string[];
  accommodationSuggestions: string[];
}

export interface GeminiResponse {
  summary: string;
  recommendations: GeminiRecommendation[];
  additionalTips: string[];
  rawResponse: string;
}

export const analyzeUserInputWithGemini = async (
  userInput: TravelPreferencesInput
): Promise<GeminiResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for Gemini

  try {
    console.log('📤 Sending recommendation request to Gemini via Node backend:', `${API_URL}/analyze`);

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error (${response.status})`);
    }

    const data = await response.json();

    if (!data || !data.recommendations || data.recommendations.length === 0) {
      throw new Error('Invalid response format - no recommendations received');
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("❌ Gemini analysis failed:", error.message);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('❌ Backend server not running! Start Node.js (npm run server)');
    }

    if (error.name === 'AbortError') {
      throw new Error('⏱️ Request timeout - AI took too long to respond. Please try again.');
    }

    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

export const refineRecommendations = async (
  initialRecommendations: GeminiResponse,
  userFeedback: string
): Promise<GeminiResponse> => {
  try {
    const response = await fetch(`${API_URL}/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initialRecommendations, userFeedback }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to refine recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error("Error refining recommendations via backend:", error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('❌ Backend server not running! Please run: npm run server');
    }
    throw error;
  }
};

export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string[]
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destination, duration, interests }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate itinerary');
    }

    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('❌ Backend server not running! Please run: npm run server');
    }
    throw error;
  }
};
