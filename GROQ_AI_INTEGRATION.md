# AI Integration Guide

## Overview
The GoWhere application includes an AI-powered travel recommendations feature. The app calls a backend AI service (configured via environment variables) to analyze user preferences and return personalized travel suggestions with detailed itineraries.

## Features

### 1. **AI-Powered Recommendations**
- Analyzes user input (budget, travel style, interests, climate preferences)
- Provides 3+ destination recommendations with detailed information
- Returns structured data including highlights, budget estimates, best times to visit

### 2. **Itinerary Generation**
- Creates detailed day-by-day itineraries for selected destinations
- Includes activity schedules, budget estimates, and local insider tips
- Customizable based on trip duration and interests

### 3. **Refinement Capability**
- Users can provide feedback to refine recommendations
- AI adapts suggestions based on updated requirements
- Iterative improvement of suggestions

## Setup Instructions

### 1. Configure AI Backend
The app uses a backend service for AI calls. Configure your API key(s) in `.env.local` as needed. Common env vars:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Use `GEMINI_MODEL` or `VITE_GEMINI_MODEL` to override the model name if necessary.

## Architecture

### Services

#### `aiService.ts`
Located at: `services/geminiService.ts`

**Key Functions:**

-```typescript
analyzeUserInput(userInput: TravelPreferencesInput): Promise<AIResponse>
```
- Takes user preferences as input
- Calls Groq AI with optimized prompt
 - Calls the backend AI service with an optimized prompt
- Returns structured recommendations

```typescript
refineRecommendations(initialRecommendations: AIResponse, userFeedback: string): Promise<AIResponse>
```
- Refines previous recommendations based on feedback
- Maintains context from initial analysis

```typescript
generateItinerary(destination: string, duration: number, interests: string[]): Promise<string>
```
- Generates detailed day-by-day itinerary
- Customizes based on trip length and interests

### Components

#### `RecommendationView.tsx`
Located at: `components/RecommendationView.tsx`

**Features:**
- Interactive form for user preferences
- Toggle buttons for travel styles, interests, climate
- Real-time UI updates
- Loading states and error handling
- Recommendation cards display
- Itinerary generation capability

### Data Models

```typescript
interface TravelPreferencesInput {
  budget: string;           // 'budget', 'moderate', 'luxury'
  duration: number;         // days
  travelStyle: string[];    // array of styles
  interests: string[];      // array of interests
  climate: string[];        // array of climates
  groupSize: number;        // number of people
  specialRequirements?: string;
}

interface Recommendation {
  destination: string;
  country: string;
  reason: string;
  highlights: string[];
  estimatedCost: string;
  bestTimeToVisit: string;
  activities: string[];
  accommodationSuggestions: string[];
}

interface AIResponse {
  summary: string;          // Travel profile summary
  recommendations: Recommendation[];
  additionalTips: string[];
  rawResponse: string;      // Full AI response
}
```

## Usage

### 1. Navigate to AI Recommendations
1. After login, click "AI Smart Recommendations" from the intent selection page
2. Or directly access via `AppStep.AI`

### 2. Fill Preferences
- Select budget level
- Set trip duration (1-30 days)
- Choose travel styles (Adventure, Luxury, Budget, Cultural, Beach, Mountain, City)
- Select interests (History, Food, Nature, Art, Sports, Shopping, Nightlife, Wellness)
- Pick climate preferences (Tropical, Temperate, Cold, Desert, Mediterranean)
- Set group size (1-20 people)
- Add special requirements (optional)

### 3. Get Recommendations
- Click "Get AI Recommendations"
 - Wait for the AI backend to analyze preferences
- View destination cards with highlights and details

### 4. Generate Itinerary
- Click "Generate Itinerary" on any recommendation
- AI creates detailed day-by-day plan
- View activities, budget estimates, and insider tips

## AI Model
The backend may use different AI models depending on configuration and availability. The server attempts to auto-detect a compatible model; you can override the model via `GEMINI_MODEL`.

## Prompt Engineering

The service uses carefully crafted prompts to:
1. Provide context about the user's preferences
2. Define exact output format (JSON)
3. Encourage personalized, practical suggestions
4. Include specific requirements (budget constraints, special needs)

Example prompt structure:
```
You are an expert travel advisor. Based on the following user preferences:
- Budget Level: moderate
- Duration: 7 days
- Travel Style: Adventure, Cultural
- Interests: History, Food, Nature
[...more details...]

Please provide:
1. A brief summary...
2. At least 3 specific destination recommendations with:
   - Destination name and country
   - Why it matches their preferences
   - [detailed specifications...]

Format your response as JSON with the following structure: [...]
```

## Error Handling

The service implements comprehensive error handling:

```typescript
try {
  const result = await analyzeUserInput(userInput);
  setRecommendations(result);
} catch (err) {
  setError(err.message || 'Failed to get recommendations');
  // User sees clear error message in UI
}
```

**Common Issues:**
- Invalid API key → Check `.env.local`
- Network timeout → Retry with longer timeout
- Invalid JSON response → Service parses and validates
- Rate limiting → Use exponential backoff

## Performance Considerations

### Token Management
- Model/token limits vary by provider
- Standard prompts use ~500-800 tokens
- Full responses with recommendations use ~1500-2000 tokens
- Itinerary generation uses ~1000-1500 tokens

### Optimization Tips
1. Limit recommendation count if needed
2. Use iterative refinement instead of complete re-analysis
3. Cache responses for similar queries
4. Set appropriate timeouts (default: 30s)

## Security Best Practices

1. **Never commit API keys**
   - Use `.env.local` (already in `.gitignore`)
   - Never hardcode keys in source

2. **Validate user input**
   - Check form validation before API call
   - Sanitize special requirements text

3. **Rate limiting**
   - Implement on frontend (disable button during request)
   - Add backend rate limiting if needed

4. **Error messages**
   - Don't expose full error details to users
   - Log detailed errors for debugging

## Integration Points

### In App.tsx
```typescript
{currentStep === AppStep.AI && (
  <RecommendationView />
)}
```

### In IntentSelection.tsx
New button option added: "AI Smart Recommendations"

### Types Extended
- New `AppStep.AI` enum value
- `TravelPreferencesInput` interface
- `GroqResponse` interface
 - `AIResponse` interface

## Future Enhancements

1. **Multi-language support**
   - Provide recommendations in user's language
   - Translate itineraries

2. **Personalization**
   - User history tracking
   - Recommendation refinement over time
   - Saved favorites

3. **Integration with Gemini**
  - Hybrid analysis (Gemini for initial, other providers for optimization)
  - Comparative recommendations

4. **Real-time pricing**
   - Integration with flight/hotel APIs
   - Dynamic budget estimation
   - Deal notifications

5. **Social features**
   - Share recommendations
   - Collaborative planning
   - Group trip optimization

## Troubleshooting

### No recommendations returned
- Verify API key is correct
- Check network connection
- Ensure at least one travel style and interest selected

### Slow responses
- AI model response times vary depending on provider and model
- Check internet connection
- Large prompt sizes slow responses

### Malformed responses
- Check API key validity
- Verify JSON parsing in error logs
 - Contact your AI provider support if issue persists

### Rate limit errors
- Implement exponential backoff
- Add user-facing message about rate limits
- Consider upgrading your AI provider tier

## API Reference

### analyzeUserInput

```typescript
async function analyzeUserInput(
  userInput: TravelPreferencesInput
): Promise<AIResponse>
```

**Parameters:**
- `userInput` - User's travel preferences

**Returns:**
 - `AIResponse` with recommendations, summary, and tips

**Throws:**
- Error if API call fails or JSON parsing fails

### generateItinerary

```typescript
async function generateItinerary(
  destination: string,
  duration: number,
  interests: string[]
): Promise<string>
```

**Parameters:**
- `destination` - Destination name
- `duration` - Trip length in days
- `interests` - User interests array

**Returns:**
- Formatted itinerary string (markdown)

## Testing

### Manual Testing
1. Test with different budget levels
2. Test with various travel styles and interests
3. Verify JSON parsing with different responses
4. Test error handling (disconnect internet, invalid key)

### Automated Testing
```typescript
// Example test
describe('AI Service', () => {
  it('should return valid recommendations', async () => {
    const input = {
      budget: 'moderate',
      duration: 7,
      travelStyle: ['Adventure'],
      interests: ['Nature'],
      climate: ['Temperate'],
      groupSize: 2
    };
    
    const result = await analyzeUserInput(input);
    
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.summary).toBeDefined();
  });
});
```

## Support & Resources

-- **AI Provider Docs:** Check your provider's documentation
-- **GitHub Issues:** Report bugs in the project repository

## License

This AI integration is part of the GoWhere project and follows the same license.
