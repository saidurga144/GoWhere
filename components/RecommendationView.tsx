
import React, { useState, useEffect, useMemo } from 'react';
import { UserPreferences, RecommendationMatch } from '../types';
import { MOCK_DESTINATIONS } from '../constants';
import { getRecommendations } from './RecommendationEngine';
import DestinationCard from './DestinationCard';
import { AdvancedButton } from './ui/gradient-button';

interface Props {
  preferences: UserPreferences;
  interactions: string[];
  onInteract: (id: string) => void;
}

const RecommendationView: React.FC<Props> = ({ preferences, interactions, onInteract }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Recommendation engine logic
  const recommendations = useMemo(() => {
    try {
      let recs = getRecommendations(preferences, MOCK_DESTINATIONS);
      
      // Boost score based on interaction history (simulating behavioral refinement)
      if (interactions.length > 0) {
        recs = recs.map(rec => {
          const interactionCount = interactions.filter(id => id === rec.destination.id).length;
          return {
            ...rec,
            score: Math.min(100, rec.score + (interactionCount * 5))
          };
        }).sort((a, b) => b.score - a.score);
      }

      if (activeFilter !== 'All') {
        recs = recs.filter(r => r.destination.primaryStyles.includes(activeFilter as any));
      }

      return recs;
    } catch (error) {
      console.error("Error in recommendations:", error);
      return getRecommendations(preferences, MOCK_DESTINATIONS);
    }
  }, [preferences, interactions, activeFilter]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">✨ Curated Destinations For You</h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Based on your <strong>{preferences.budget.toLowerCase()} budget</strong>, 
            <strong> {preferences.duration}-day trip</strong>, and love for <strong>{preferences.styles.join(' & ')}</strong>. 
            Choose from destinations that match your <strong>{preferences.climate.join(' & ')}</strong> climate preference.
          </p>
          
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveFilter('All')}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all touch-manipulation ${activeFilter === 'All' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
            >
              All Destinations
            </button>
            {preferences.styles.map(s => (
              <button 
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all touch-manipulation ${activeFilter === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {recommendations.map(rec => (
          <DestinationCard 
            key={rec.destination.id} 
            match={rec} 
            preferences={preferences}
            onInteract={onInteract}
          />
        ))}
      </div>
      
      {recommendations.length === 0 && (
        <div className="text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 px-4">
          <i className="fa-solid fa-map-pin text-3xl sm:text-4xl text-slate-300 mb-4"></i>
          <h3 className="text-lg sm:text-xl font-bold text-slate-600">No matches found with current filters</h3>
          <AdvancedButton variant="secondary" onClick={() => setActiveFilter('All')} className="mt-4">Clear all filters</AdvancedButton>
        </div>
      )}
      </div>
    </div>
  );
};

export default RecommendationView;
