import React, { useState, lazy, Suspense } from 'react';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';
import {
  analyzeUserInputWithGemini,
  refineRecommendations,
  generateItinerary,
  TravelPreferencesInput,
  GeminiResponse,
} from '../services/geminiRecommendationService';
import { AdvancedButton } from './ui/gradient-button';

// Lazy load the map component for faster initial load
const DestinationMap = lazy(() => import('./DestinationMap'));

interface GeminiRecommendationViewProps {
  onRecommendationsReceived?: (recommendations: GeminiResponse) => void;
}

const GeminiRecommendationView: React.FC<GeminiRecommendationViewProps> = ({
  onRecommendationsReceived,
}) => {
  const [formData, setFormData] = useState<TravelPreferencesInput>({
    budget: 'moderate',
    duration: 7,
    travelStyle: [],
    interests: [],
    climate: [],
    groupSize: 1,
    specialRequirements: '',
  });

  const [recommendations, setRecommendations] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [groupType, setGroupType] = useState<'single' | 'couple' | 'family'>('single');

  const travelStyleOptions = ['Adventure', 'Luxury', 'Budget', 'Cultural', 'Beach', 'Mountain', 'City'];
  const interestOptions = ['History', 'Food', 'Nature', 'Art', 'Sports', 'Shopping', 'Nightlife', 'Wellness'];
  const climateOptions = ['Tropical', 'Temperate', 'Cold', 'Desert', 'Mediterranean'];

  const handleToggleOption = (
    value: string,
    field: 'travelStyle' | 'interests' | 'climate'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleGetRecommendations = async () => {
    if (formData.travelStyle.length === 0 || formData.interests.length === 0) {
      setError('Please select at least one travel style and interest');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await analyzeUserInputWithGemini(formData);

      if (!result || !result.recommendations || result.recommendations.length === 0) {
        throw new Error('No recommendations received from AI. Please try again.');
      }

      setRecommendations(result);
      onRecommendationsReceived?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recommendations from Gemini AI';
      console.error('Recommendations error:', errorMessage);
      setError(errorMessage);
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async (destination: string) => {
    setGeneratingItinerary(true);
    setError(null);

    try {
      const result = await generateItinerary(destination, formData.duration, formData.interests);
      setItinerary(result);
      setSelectedDestination(destination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate itinerary'
      );
    } finally {
      setGeneratingItinerary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl sm:max-w-4xl lg:max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">AI Travel Recommendations</h1>
          <p className="text-purple-200 text-sm sm:text-lg">
            Powered by Gemini AI - Get personalized travel suggestions in seconds
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Tell us about your travel preferences</h2>

          {/* Budget */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">💰 Budget Level</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-700 text-white border border-purple-500/30 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
            >
              <option value="budget">Budget (&lt;$50/day)</option>
              <option value="moderate">Moderate ($50-150/day)</option>
              <option value="luxury">Luxury (&gt;$150/day)</option>
            </select>
          </div>

          {/* Group Type */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-semibold mb-3 text-sm sm:text-base">👥 Who are you traveling with?</label>
            <div className="grid grid-cols-3 gap-3">
              {(['single', 'couple', 'family'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setGroupType(type);
                    const groupSizes = { single: 1, couple: 2, family: 4 };
                    setFormData({ ...formData, groupSize: groupSizes[type] });
                  }}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${groupType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-purple-200 hover:bg-slate-600'
                    }`}
                >
                  {type === 'single' ? '🧑 Single' : type === 'couple' ? '👫 Couple' : '👨‍👩‍👧‍👦 Family'}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              📅 Trip Duration: {formData.duration} days
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Travel Style */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">🎒 What's your travel style?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {travelStyleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => handleToggleOption(style, 'travelStyle')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.travelStyle.includes(style)
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-purple-200 hover:bg-slate-600'
                    }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">❤️ What are your interests?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleToggleOption(interest, 'interests')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.interests.includes(interest)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-blue-200 hover:bg-slate-600'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Climate */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">🌤️ What climate do you prefer?</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {climateOptions.map((climate) => (
                <button
                  key={climate}
                  onClick={() => handleToggleOption(climate, 'climate')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.climate.includes(climate)
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-green-200 hover:bg-slate-600'
                    }`}
                >
                  {climate}
                </button>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Group Size: {formData.groupSize} people
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={formData.groupSize}
              onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Special Requirements */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">✨ Any special requirements? (Optional)</label>
            <textarea
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              placeholder="e.g., Wheelchair accessible, vegan-friendly, pet-friendly..."
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none h-24"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-100">{error}</p>
            </div>
          )}

          {/* Get Recommendations Button */}
          <AdvancedButton
            variant="gradient"
            onClick={handleGetRecommendations}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing with Gemini AI...
              </>
            ) : (
              'Get AI Recommendations'
            )}
          </AdvancedButton>
        </div>

        {/* Recommendations Display */}
        {recommendations && (
          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Travel Profile</h2>
              <p className="text-purple-100 text-lg leading-relaxed">{recommendations.summary}</p>
            </div>

            {/* Interactive Map */}
            <div className="bg-slate-800/50 backdrop-blur border border-green-500/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Destinations Map</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Click on any marker to view more details. The map automatically centers on your recommendations.
              </p>
              <Suspense fallback={
                <div className="w-full h-96 sm:h-screen rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
                    <p className="text-slate-300">Loading map...</p>
                  </div>
                </div>
              }>
                <DestinationMap
                  recommendations={recommendations.recommendations}
                  selectedDestination={selectedDestination || undefined}
                />
              </Suspense>
            </div>

            {/* Recommendations Cards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Top Recommendations</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendations.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500 transition-all"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{rec.destination}</h3>
                    <p className="text-cyan-300 font-semibold mb-3">{rec.country}</p>
                    <p className="text-slate-300 mb-4">{rec.reason}</p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-1">Highlights:</p>
                        <ul className="text-slate-300 text-sm space-y-1">
                          {rec.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-1">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-1">Budget Range:</p>
                        <p className="text-slate-300 text-sm">{rec.estimatedCost}</p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-1">Best Time:</p>
                        <p className="text-slate-300 text-sm">{rec.bestTimeToVisit}</p>
                      </div>
                    </div>

                    <AdvancedButton
                      variant="primary"
                      onClick={() => handleGenerateItinerary(rec.destination)}
                      disabled={generatingItinerary}
                      className="w-full"
                    >
                      {generatingItinerary && selectedDestination === rec.destination
                        ? 'Generating...'
                        : 'Generate Itinerary'}
                    </AdvancedButton>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Tips */}
            {recommendations.additionalTips.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur border border-green-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Travel Tips
                </h2>
                <ul className="space-y-3">
                  {recommendations.additionalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <span className="text-green-400 mt-1 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary Display */}
            {itinerary && (
              <div className="bg-slate-800/50 backdrop-blur border border-orange-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedDestination} - {formData.duration} Day Itinerary
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{itinerary}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiRecommendationView;
