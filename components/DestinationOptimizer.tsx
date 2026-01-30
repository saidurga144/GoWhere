
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { MOCK_DESTINATIONS } from '../constants';
import { AdvancedButton } from './ui/gradient-button';

interface Props {
  onBack: () => void;
}

const DestinationOptimizer: React.FC<Props> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setAnalysis(null);
    setImageDescription(null);
    setError(null);

    try {
      // Run analysis and image generation in parallel
      const [analysisResult, generatedImage] = await Promise.all([
        geminiService.analyzeDestinationOptimization(query).catch(err => {
          console.error("Analysis error:", err);
          return {
            bestMonths: "Spring to Fall",
            weatherSummary: "Moderate climate",
            budgetImpact: "Check local rates",
            crowdLevels: "Moderate",
            suggestedDuration: "5-7 days"
          };
        }),
        geminiService.generateDestinationImage(query).catch(err => {
          console.error("Image generation error:", err);
          return null;
        })
      ]);
      
      setAnalysis(analysisResult);
      setImageDescription(generatedImage);
    } catch (error) {
      console.error("Optimization flow error:", error);
      setError("Unable to fetch destination analysis. Please try again.");
      setAnalysis({
        bestMonths: "Spring to Fall",
        weatherSummary: "Varies by season",
        budgetImpact: "Moderate",
        crowdLevels: "Moderate",
        suggestedDuration: "7 days"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectSuggested = (name: string) => {
    setQuery(name);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Header with Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <AdvancedButton 
          variant="ghost"
          onClick={onBack}
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Options
        </AdvancedButton>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Optimize Your Journey</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">Already have a place in mind? Let's analyze the best timing, costs, and hidden details for you.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="relative flex-1">
            <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="e.g. Kerala, Rajasthan or Goa..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition-all font-medium text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <AdvancedButton 
            variant="primary"
            type="submit" 
            disabled={loading}
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Analyze</>}
          </AdvancedButton>
        </form>

        {!analysis && !loading && (
          <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular Suggestions:</span>
            {MOCK_DESTINATIONS.slice(0, 4).map(d => (
              <AdvancedButton 
                key={d.id} 
                variant="secondary"
                onClick={() => selectSuggested(d.name)}
              >
                {d.name}
              </AdvancedButton>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20 animate-pulse">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
            <i className="fa-solid fa-map-location-dot text-4xl animate-spin-slow"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">Analyzing India...</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Retrieving weather patterns, seasonal costs, and travel data for <strong>{query}</strong></p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {/* Gemini-powered visual inspiration */}
          {imageDescription && (
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 text-white">
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-64 h-64 bg-indigo-400 rounded-full blur-3xl -top-20 -right-10 absolute" />
                <div className="w-72 h-72 bg-fuchsia-400 rounded-full blur-3xl -bottom-24 -left-8 absolute" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">{query}</h3>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-widest">
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  Gemini visual inspiration
                </span>
                <p className="text-indigo-50 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {imageDescription}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
                <i className="fa-solid fa-calendar-days text-xl"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-xl mb-3">Ideal Window</h4>
              <p className="text-slate-600 leading-relaxed">{analysis.bestMonths}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
                <i className="fa-solid fa-temperature-half text-xl"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-xl mb-3">Atmosphere</h4>
              <p className="text-slate-600 leading-relaxed">{analysis.weatherSummary}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 shadow-inner">
                <i className="fa-solid fa-coins text-xl"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-xl mb-3">Cost Strategy</h4>
              <p className="text-slate-600 leading-relaxed">{analysis.budgetImpact}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6 shadow-inner">
                <i className="fa-solid fa-street-view text-xl"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-xl mb-3">Density & Pulse</h4>
              <p className="text-slate-600 leading-relaxed">{analysis.crowdLevels}</p>
            </div>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex-1 relative z-10">
              <h3 className="text-3xl font-bold mb-3">The Perfect Stay</h3>
              <p className="text-indigo-50 text-lg leading-relaxed">
                To capture the true essence of <span className="font-bold text-white">{query}</span> without rushing, 
                we recommend a journey of <span className="px-3 py-1 bg-white/20 rounded-lg font-bold mx-1">{analysis.suggestedDuration}</span>.
              </p>
            </div>
            <AdvancedButton variant="secondary">
              Download Full Guide
            </AdvancedButton>
          </div>
          
          <div className="text-center pt-8">
             <AdvancedButton 
               variant="ghost"
               onClick={() => { setAnalysis(null); setImageDescription(null); setQuery(''); }}
             >
               <i className="fa-solid fa-magnifying-glass-plus"></i> Analyze another destination
             </AdvancedButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationOptimizer;
