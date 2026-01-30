
import React from 'react';
import { AppStep } from '../types';
import { AdvancedButton } from './ui/gradient-button';

interface Props {
  onSelect: (step: AppStep) => void;
}

const IntentSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Your journey begins <br />
          <span className="text-indigo-600">with a single choice.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Whether you're looking for hidden gems tailored to your soul or optimizing a destination you already love, we're here to guide you.
        </p>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
          <div className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-map-location-dot text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">I want recommendations</h3>
            <p className="text-slate-500 mb-6">I'm flexible! Show me destinations that match my budget, style, and interests.</p>
            <AdvancedButton
              variant="gradient"
              onClick={() => onSelect(AppStep.ONBOARDING)}
              className="w-full"
            >
              Start Discovery
            </AdvancedButton>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-calendar-check text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">I have a place in mind</h3>
            <p className="text-slate-500 mb-6">Already know where you're going? Let's find the best time, duration, and local activities.</p>
            <AdvancedButton
              variant="gradient"
              onClick={() => onSelect(AppStep.OPTIMIZATION)}
              className="w-full"
            >
              Optimize Plan
            </AdvancedButton>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentSelection;
