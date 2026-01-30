
import React, { useState, useEffect } from 'react';
import { RecommendationMatch, UserPreferences } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  match: RecommendationMatch;
  preferences: UserPreferences;
  onInteract: (id: string) => void;
}

const DestinationCard: React.FC<Props> = ({ match, preferences, onInteract }) => {
  const [reasoning, setReasoning] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchReasoning = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await geminiService.getRecommendationReasoning(preferences, match.destination);
        if (isMounted) {
          setReasoning(res || "Perfect match for your travel preferences.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching reasoning:", err);
        if (isMounted) {
          setReasoning("This destination matches your preferences and budget requirements.");
          setError(null);
          setLoading(false);
        }
      }
    };
    fetchReasoning();
    return () => { isMounted = false; };
  }, [match.destination.id, preferences]);

  const handleCardClick = () => {
    onInteract(match.destination.id);
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (!isSaved) onInteract(match.destination.id); // Saving counts as a strong interaction
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 cursor-pointer flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
        <img 
          src={match.destination.imageUrl} 
          alt={match.destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <div className="glass px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold text-indigo-700 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            {match.score}% Match
          </div>
        </div>
        <button 
          onClick={toggleSave}
          className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-10 h-10 rounded-full glass flex items-center justify-center transition-all touch-manipulation ${isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
        >
          <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-heart text-lg sm:text-xl`}></i>
        </button>
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-end">
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-white drop-shadow-md">{match.destination.name}</h3>
            <p className="text-white/90 text-xs sm:text-sm font-medium drop-shadow-sm">{match.destination.country}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {match.destination.primaryStyles.map(s => (
            <span key={s} className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
              {s}
            </span>
          ))}
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
            {match.destination.budgetLevel}
          </span>
        </div>

        <div className="mb-4 sm:mb-6">
          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            <i className="fa-solid fa-sparkles"></i>
            Why this works
          </h4>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-4/5"></div>
            </div>
          ) : (
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">"{reasoning}"</p>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
          <div className="text-slate-400 text-xs sm:text-sm">
            Est. <span className="font-bold text-slate-700">${match.destination.averageCostPerDay}</span> / day
          </div>
          <button className="text-indigo-600 font-bold text-xs sm:text-sm hover:underline flex items-center gap-1">
            Explore Details <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
