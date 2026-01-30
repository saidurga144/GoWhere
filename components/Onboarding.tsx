
import React, { useState } from 'react';
import { UserPreferences, BudgetRange, TravelStyle, Climate } from '../types';
import { ACTIVITY_OPTIONS } from '../constants';
import { AdvancedButton } from './ui/gradient-button';

interface Props {
  onComplete: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [groupType, setGroupType] = useState<'single' | 'couple' | 'family'>('single');
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    budget: BudgetRange.MODERATE,
    styles: [],
    climate: [],
    duration: 7,
    interests: [],
    seasonalAvailability: 'Anytime'
  });

  const canProceed = (): boolean => {
    switch (step) {
      case 2:
        return true; // Group type always has a selection (default: single)
      case 3:
        return (prefs.styles?.length ?? 0) > 0; // Must select at least one travel style
      case 4:
        return (prefs.climate?.length ?? 0) > 0; // Must select at least one climate
      case 5:
        return (prefs.interests?.length ?? 0) > 0; // Must select at least one interest
      default:
        return true;
    }
  };

  const next = () => {
    if (canProceed()) {
      setStep(s => s + 1);
    }
  };
  const back = () => setStep(s => s - 1);

  const toggleStyle = (style: TravelStyle) => {
    setPrefs(p => ({
      ...p,
      styles: p.styles?.includes(style) 
        ? p.styles.filter(s => s !== style) 
        : [...(p.styles || []), style]
    }));
  };

  const toggleClimate = (climate: Climate) => {
    setPrefs(p => ({
      ...p,
      climate: p.climate?.includes(climate) 
        ? p.climate.filter(c => c !== climate) 
        : [...(p.climate || []), climate]
    }));
  };

  const toggleInterest = (interest: string) => {
    setPrefs(p => ({
      ...p,
      interests: p.interests?.includes(interest) 
        ? p.interests.filter(i => i !== interest) 
        : [...(p.interests || []), interest]
    }));
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Step {step} of 6</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-1.5 flex-grow sm:w-8 rounded-full transition-all ${i <= step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 transition-all duration-300">
          {step === 1 && (
            <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">What's your travel budget?</h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">This helps us filter destinations that fit your wallet.</p>
            <div className="space-y-3 sm:space-y-4">
              {Object.values(BudgetRange).map(b => (
                <button
                  key={b}
                  onClick={() => setPrefs({ ...prefs, budget: b })}
                  className={`w-full p-3 sm:p-4 text-left rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between text-sm sm:text-base touch-manipulation ${
                    prefs.budget === b ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200 active:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold text-slate-800">{b}</span>
                  {prefs.budget === b && <i className="fa-solid fa-circle-check text-indigo-600"></i>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">👥 Who are you traveling with?</h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">Help us personalize recommendations for your group.</p>
            <div className="space-y-3 sm:space-y-4">
              {(['single', 'couple', 'family'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setGroupType(type)}
                  className={`w-full p-4 sm:p-6 text-left rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between text-sm sm:text-base touch-manipulation ${
                    groupType === type ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200 active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">
                      {type === 'single' ? '🧑' : type === 'couple' ? '👫' : '👨‍👩‍👧‍👦'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {type === 'single' ? 'Traveling Solo' : type === 'couple' ? 'Couple Trip' : 'Family Adventure'}
                    </span>
                  </div>
                  {groupType === type && <i className="fa-solid fa-circle-check text-indigo-600"></i>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Choose your travel styles</h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">Select all that apply to your ideal vibe.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {Object.values(TravelStyle).map(s => (
                <button
                  key={s}
                  onClick={() => toggleStyle(s)}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-xs sm:text-sm font-semibold touch-manipulation ${
                    prefs.styles?.includes(s) ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200 active:bg-slate-50'
                  }`}
                >
                  <i className={`fa-solid ${s === TravelStyle.ADVENTURE ? 'fa-mountain' : s === TravelStyle.RELAXATION ? 'fa-umbrella-beach' : s === TravelStyle.CULTURAL ? 'fa-landmark' : s === TravelStyle.URBAN ? 'fa-city' : 'fa-tree'} text-lg sm:text-2xl`}></i>
                  <span className="text-center leading-tight">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Preferred climate?</h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">What kind of weather makes you happiest?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {Object.values(Climate).map(c => (
                <button
                  key={c}
                  onClick={() => toggleClimate(c)}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-xs sm:text-sm font-semibold touch-manipulation ${
                    prefs.climate?.includes(c) ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200 active:bg-slate-50'
                  }`}
                >
                  <i className={`fa-solid ${c === Climate.TROPICAL ? 'fa-sun' : c === Climate.TEMPERATE ? 'fa-cloud-sun' : c === Climate.COLD ? 'fa-snowflake' : 'fa-wind'} text-lg sm:text-2xl`}></i>
                  <span className="text-center leading-tight">{c}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">What do you love doing?</h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">Select interests to refine activities.</p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map(i => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`px-3 sm:px-4 py-2 rounded-full border-2 transition-all text-xs sm:text-sm font-medium touch-manipulation ${
                    prefs.interests?.includes(i) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300 active:bg-slate-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Almost there!</h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">One last detail: How long is your trip?</p>
            <div className="space-y-6 sm:space-y-8">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Duration: {prefs.duration} Days</label>
                <input 
                  type="range" min="1" max="30" value={prefs.duration} 
                  onChange={(e) => setPrefs({...prefs, duration: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">When can you travel?</label>
                <select 
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-2xl border-2 border-slate-100 bg-white text-sm sm:text-base"
                  value={prefs.seasonalAvailability}
                  onChange={(e) => setPrefs({...prefs, seasonalAvailability: e.target.value})}
                >
                  <option>Anytime</option>
                  <option>Spring (Mar-May)</option>
                  <option>Summer (Jun-Aug)</option>
                  <option>Autumn (Sep-Nov)</option>
                  <option>Winter (Dec-Feb)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-12 flex flex-col gap-3 sm:gap-4">
          {step > 1 && !canProceed() && (
            <p className="text-xs sm:text-sm text-amber-600 text-center font-medium px-2">
              {step === 3 && '👇 Select at least one travel style to continue'}
              {step === 4 && '👇 Select at least one climate preference to continue'}
              {step === 5 && '👇 Select at least one interest to continue'}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {step > 1 && (
              <AdvancedButton 
                variant="ghost"
                onClick={back}
                className="w-full sm:flex-1"
              >
                Back
              </AdvancedButton>
            )}
            <AdvancedButton 
              variant={step === 6 ? 'gradient' : 'primary'}
              onClick={step === 6 ? () => onComplete(prefs as UserPreferences) : next}
              disabled={!canProceed() && step !== 6}
              className="w-full sm:flex-[2]"
            >
              {step === 6 ? 'Get Recommendations' : 'Next Step'}
            </AdvancedButton>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Onboarding;
