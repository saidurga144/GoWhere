import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Removed Groq import
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

console.log('🔑 Environment variables loaded:');
// Removed GROQ_API_KEY log
console.log('  VITE_GEMINI_API_KEY exists:', !!process.env.VITE_GEMINI_API_KEY);
console.log('  GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Removed Groq initialization

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');

// Model selection: try environment override first, otherwise call ListModels
let selectedModelName = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || null;

async function listAvailableModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return [];
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      console.warn('ListModels fetch failed', res.status, await res.text());
      return [];
    }
    const body = await res.json();
    return body.models || [];
  } catch (e) {
    console.warn('Failed to list models:', e && e.message);
    return [];
  }
}

async function pickModelCandidate() {
  if (selectedModelName) return selectedModelName;
  // Prefer explicit env override
  const envModel = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL;
  if (envModel) {
    selectedModelName = envModel;
    return selectedModelName;
  }

  const models = await listAvailableModels();
  // pick a Gemini model if available, otherwise fall back to the first model name
  let candidate = null;
  for (const m of models) {
    const name = m.name || '';
    if (/gemini/i.test(name)) {
      candidate = name;
      break;
    }
  }
  if (!candidate && models.length > 0) {
    candidate = models[0].name;
  }
  // normalize to a short name if the SDK expects it (try both forms later)
  selectedModelName = candidate || 'models/text-bison-001';
  console.log('Selected model for generative calls:', selectedModelName);
  return selectedModelName;
}

async function getModelForSDK() {
  const modelName = await pickModelCandidate();
  // The SDK historically accepted both 'gemini-1.5' and 'models/gemini-1.5' styles.
  // Try the raw modelName first, then try removing a leading 'models/' prefix if present.
  try {
    return genAI.getGenerativeModel({ model: modelName });
  } catch (e) {
    if (modelName && modelName.startsWith('models/')) {
      const alt = modelName.replace(/^models\//, '');
      try {
        return genAI.getGenerativeModel({ model: alt });
      } catch (e2) {
        throw e; // rethrow original
      }
    }
    throw e;
  }
}

// Universal generate helper: tries common SDK method names and returns the result object
async function generateWithModel(prompt) {
  try {
    const model = await getModelForSDK();
    if (model && typeof model.generateContent === 'function') {
      return await model.generateContent(prompt);
    }
    if (model && typeof model.generate === 'function') {
      // some SDK variants expect an object
      return await model.generate({ prompt });
    }
    // fallback: try calling genAI directly if available
    if (genAI && typeof genAI.generateContent === 'function') {
      return await genAI.generateContent({ model: selectedModelName, prompt });
    }
    throw new Error('No supported generate method available on SDK/model');
  } catch (e) {
    // Re-throw so calling code can handle and log properly
    throw e;
  }
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { userInput } = req.body;
    
    console.log('\n📨 Received recommendation request:');
    console.log('  Budget:', userInput.budget);
    console.log('  Duration:', userInput.duration, 'days');
    console.log('  Travel Style:', userInput.travelStyle);
    console.log('  Interests:', userInput.interests);
    console.log('  Climate:', userInput.climate);
    
    const prompt = `You are an expert travel advisor. Based on the following user preferences, provide detailed travel recommendations.

User Preferences:
- Budget Level: ${userInput.budget}
- Duration: ${userInput.duration} days
- Travel Style: ${userInput.travelStyle.join(", ")}
- Interests: ${userInput.interests.join(", ")}
- Climate Preference: ${userInput.climate.join(", ")}
- Group Size: ${userInput.groupSize} people
${userInput.specialRequirements ? `- Special Requirements: ${userInput.specialRequirements}` : ""}

IMPORTANT: You MUST provide personalized recommendations that match EXACTLY the user's budget, travel style, interests, and climate preferences. Do not give generic recommendations.

Please provide your response ONLY as valid JSON (no markdown, no extra text) with this exact structure:
{
  "summary": "A brief personalized summary of the ideal destination profile for this specific traveler based on their budget (${userInput.budget}), interests (${userInput.interests.join(", ")}), and travel style (${userInput.travelStyle.join(", ")})",
  "recommendations": [
    {
      "destination": "Destination name",
      "country": "Country",
      "reason": "Why this destination matches their SPECIFIC preferences",
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "estimatedCost": "Budget range matching their ${userInput.budget} budget",
      "bestTimeToVisit": "Best season/months",
      "activities": ["activity1 matching their interests", "activity2", "activity3"],
      "accommodationSuggestions": ["type1", "type2", "type3"]
    },
    {
      "destination": "Second destination",
      "country": "Country",
      "reason": "Why this matches their preferences",
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "estimatedCost": "Budget range",
      "bestTimeToVisit": "Best season/months",
      "activities": ["activity1", "activity2", "activity3"],
      "accommodationSuggestions": ["type1", "type2", "type3"]
    },
    {
      "destination": "Third destination",
      "country": "Country",
      "reason": "Why this matches their preferences",
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "estimatedCost": "Budget range",
      "bestTimeToVisit": "Best season/months",
      "activities": ["activity1", "activity2", "activity3"],
      "accommodationSuggestions": ["type1", "type2", "type3"]
    }
  ],
  "additionalTips": ["tip1", "tip2", "tip3"]
}`;

    console.log('🚀 Calling Gemini API to analyze user preferences');
    const result = await generateWithModel(prompt);
    let responseText = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        responseText = result.response.text();
      } else if (typeof result.text === 'function') {
        responseText = result.text();
      } else if (typeof result.output === 'string') {
        responseText = result.output;
      } else if (typeof result === 'string') {
        responseText = result;
      } else {
        responseText = JSON.stringify(result);
      }
    }
    
    console.log('📝 Gemini response received, length:', responseText.length);
    
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    // Try to extract JSON from response - be more flexible
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    let parsedResponse;
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed JSON from Gemini response');
      } catch (jsonError) {
        console.error("❌ JSON parse error:", jsonError.message);
        throw new Error('Failed to parse Gemini response as JSON');
      }
    } else {
      console.error("❌ No JSON found in response");
      throw new Error('No JSON structure found in API response');
    }

    // Validate response has recommendations
    if (!parsedResponse.recommendations || parsedResponse.recommendations.length === 0) {
      console.error('❌ Response missing recommendations');
      throw new Error('Response has no recommendations');
    }
    
    console.log('✅ Returning', parsedResponse.recommendations.length, 'recommendations');
    res.json({
      ...parsedResponse,
      rawResponse: responseText,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in /api/analyze:", message);
    res.status(500).json({
      error: message,
      details: 'Check server logs for more information',
    });
  }
});

app.post('/api/refine', async (req, res) => {
  try {
    const { initialRecommendations, userFeedback } = req.body;
    const prompt = `
You are a travel advisor refining recommendations based on user feedback.

Previous Recommendations Summary:
${initialRecommendations.summary}

Previous Recommendations:
${initialRecommendations.recommendations
  .map((r) => `- ${r.destination}, ${r.country}: ${r.reason}`)
  .join("\n")}

User Feedback/Additional Requirements:
${userFeedback}

Please refine the recommendations based on this feedback. Provide updated recommendations in the same JSON format:
{
  "summary": "Updated profile summary",
  "recommendations": [
    {
      "destination": "Destination name",
      "country": "Country",
      "reason": "Why this matches",
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "estimatedCost": "Budget range",
      "bestTimeToVisit": "Best season/months",
      "activities": ["activity1", "activity2", "activity3"],
      "accommodationSuggestions": ["type1", "type2", "type3"]
    }
  ],
  "additionalTips": ["tip1", "tip2", "tip3"]
}

Ensure the refined recommendations better match the user's updated requirements.
`;

    console.log('🚀 Calling Gemini API to refine recommendations');
    const result = await generateWithModel(prompt);
    let responseText = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        responseText = result.response.text();
      } else if (typeof result.text === 'function') {
        responseText = result.text();
      } else if (typeof result.output === 'string') {
        responseText = result.output;
      } else if (typeof result === 'string') {
        responseText = result;
      } else {
        responseText = JSON.stringify(result);
      }
    }
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response as JSON");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    res.json({
      ...parsedResponse,
      rawResponse: responseText,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error refining recommendations:", message);
    res.status(500).json({
      error: message,
    });
  }
});

app.post('/api/itinerary', async (req, res) => {
  try {
    const { destination, duration, interests } = req.body;
    const prompt = `
Generate a detailed ${duration}-day itinerary for ${destination}.

User Interests: ${interests.join(", ")}

Create a day-by-day itinerary with:
- Morning, Afternoon, and Evening activities
- Estimated travel times
- Budget estimates for meals and activities
- Insider tips and local recommendations
- Practical logistics (transportation, best times to visit sites)

Make it engaging, practical, and personalized to the interests provided.
`;

    console.log('🚀 Calling Gemini API to generate itinerary');
    const result = await generateWithModel(prompt);
    let itineraryText = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        itineraryText = result.response.text();
      } else if (typeof result.text === 'function') {
        itineraryText = result.text();
      } else if (typeof result.output === 'string') {
        itineraryText = result.output;
      } else if (typeof result === 'string') {
        itineraryText = result;
      } else {
        itineraryText = JSON.stringify(result);
      }
    }

    res.json({
      itinerary: itineraryText || ""
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating itinerary:", message);
    res.status(500).json({
      error: message,
    });
  }
});

// Gemini API endpoint for recommendation reasoning
app.post('/api/gemini-reasoning', async (req, res) => {
  try {
    const { preferences, destination } = req.body;
    
    if (!preferences || !destination) {
      return res.status(400).json({ error: "Missing preferences or destination data" });
    }

    const prompt = `
User Preferences:
- Budget: ${preferences.budget}
- Travel Styles: ${preferences.styles.join(', ')}
- Climate Preference: ${preferences.climate.join(', ')}
- Interests: ${preferences.interests.join(', ')}
- Trip Duration: ${preferences.duration} days

Destination: ${destination.name}, ${destination.country}
- Description: ${destination.description}
- Style: ${destination.primaryStyles.join(', ')}
- Climate: ${destination.climateType}
- Popular Activities: ${destination.popularActivities.join(', ')}

Briefly explain (max 2 sentences) why this destination is a great match for this specific user. 
Focus on how the destination features align with their specific style and interests.
`;

    const result = await generateWithModel(prompt);
    let text = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        text = result.response.text();
      } else if (typeof result.text === 'function') {
        text = result.text();
      } else if (typeof result.output === 'string') {
        text = result.output;
      } else if (typeof result === 'string') {
        text = result;
      } else {
        text = JSON.stringify(result);
      }
    }

    res.json({ 
      reasoning: text || "This destination aligns perfectly with your preferred travel style and interests."
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return a fallback response instead of erroring out
    res.json({ 
      reasoning: "Matches your profile criteria."
    });
  }
});

// Gemini API endpoint for destination analysis
app.post('/api/gemini-analysis', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const prompt = `
You are a travel optimization assistant.
Analyze the best time to visit, weather patterns, budget impact, crowd levels, and suggested trip duration for: ${query}.

Return ONLY valid JSON with this exact structure and no extra text:
{
  "bestMonths": "Ideal months and why in 1–2 short sentences",
  "weatherSummary": "Climate overview in 1–2 short sentences",
  "budgetImpact": "How prices change by season in 1–2 short sentences",
  "crowdLevels": "How busy it gets across seasons in 1–2 short sentences",
  "suggestedDuration": "Recommended length of stay, like '5–7 days'"
}
`;
    
    const result = await generateWithModel(prompt);
    let text = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        text = result.response.text();
      } else if (typeof result.text === 'function') {
        text = result.text();
      } else if (typeof result.output === 'string') {
        text = result.output;
      } else if (typeof result === 'string') {
        text = result;
      } else {
        text = JSON.stringify(result);
      }
    }

    if (!text) {
      return res.json({
        bestMonths: "Spring and Autumn.",
        weatherSummary: "Mild temperatures with relatively low rainfall.",
        budgetImpact: "More affordable during shoulder seasons compared to peak holidays.",
        crowdLevels: "Busiest during major holidays and school vacation periods.",
        suggestedDuration: "5–7 days."
      });
    }

    // Try to extract a JSON object from the Gemini response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsed;

    try {
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text.trim());
    } catch (error) {
      console.error("Error parsing Gemini analysis JSON:", error);
      // Fallback: wrap the free-form text into the weatherSummary field
      return res.json({
        bestMonths: "Varies by season.",
        weatherSummary: text,
        budgetImpact: "Check current rates for your specific travel dates.",
        crowdLevels: "Crowd levels depend on holidays and local events.",
        suggestedDuration: "5–7 days is usually ideal."
      });
    }

    // Ensure all expected fields exist, with sensible defaults
    const responsePayload = {
      bestMonths: parsed.bestMonths || "Spring and Autumn.",
      weatherSummary: parsed.weatherSummary || "Mild temperature with low rainfall.",
      budgetImpact: parsed.budgetImpact || "Cheaper during shoulder seasons.",
      crowdLevels: parsed.crowdLevels || "High in peak season.",
      suggestedDuration: parsed.suggestedDuration || "5–7 days."
    };

    res.json(responsePayload);
  } catch (error) {
    console.error("Error calling Gemini Analysis:", error);
    res.json({ 
      bestMonths: "Spring",
      weatherSummary: "Varies by season.",
      budgetImpact: "Contact local agencies for the latest pricing.",
      crowdLevels: "Moderate.",
      suggestedDuration: "7 days."
    });
  }
});

// Gemini API endpoint for image generation hints
app.post('/api/gemini-image', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const prompt = `Generate a detailed visual description for stock image search based on this travel destination: ${query}. 
    Provide keywords and visual elements to look for in images.`;
    
    const result = await generateWithModel(prompt);
    let text = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        text = result.response.text();
      } else if (typeof result.text === 'function') {
        text = result.text();
      } else if (typeof result.output === 'string') {
        text = result.output;
      } else if (typeof result === 'string') {
        text = result;
      } else {
        text = JSON.stringify(result);
      }
    }

    res.json({ 
      imageDescription: text || "Travel destination image"
    });
  } catch (error) {
    console.error("Error calling Gemini Image:", error);
    res.json({ 
      imageDescription: "Travel destination"
    });
  }
});

// Gemini API endpoint for auth/help guidance (password reset, login issues)
app.post('/api/gemini-auth-help', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message parameter" });
    }

    const prompt = `
You are a helpful support assistant for a travel app.
The user is having trouble with login / password reset.

User message:
${message}

Provide a concise response with:
- 3 to 6 bullet points of practical troubleshooting steps
- mention checking spam/junk and waiting 1-2 minutes for email delivery if relevant
- mention verifying the email address and trying again
- mention contacting support only as a last resort

Do NOT ask for passwords or any secrets.
Return plain text only (no markdown fences).
`;

    const result = await generateWithModel(prompt);
    let text = '';
    if (result) {
      if (result.response && typeof result.response.text === 'function') {
        text = result.response.text();
      } else if (typeof result.text === 'function') {
        text = result.text();
      } else if (typeof result.output === 'string') {
        text = result.output;
      } else if (typeof result === 'string') {
        text = result;
      } else {
        text = JSON.stringify(result);
      }
    }

    res.json({
      help: text || "Please double-check your email address, wait 1–2 minutes, and check spam/junk folders. If it still doesn’t arrive, try again or contact support."
    });
  } catch (error) {
    console.error("Error calling Gemini Auth Help:", error);
    res.json({
      help: "Please double-check your email address, wait 1–2 minutes, and check spam/junk folders. If it still doesn’t arrive, try again or contact support."
    });
  }
});

// Diagnostic: list available models (helps debug model availability)
app.get('/api/list-models', async (req, res) => {
  try {
    const models = await listAvailableModels();
    res.json({ models });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// Diagnostic: return selected model name (computes if not yet selected)
app.get('/api/selected-model', async (req, res) => {
  try {
    const model = await pickModelCandidate();
    res.json({ selectedModel: model || null });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
