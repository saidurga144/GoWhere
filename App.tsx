

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AppStep, UserPreferences } from './types';
import IntentSelection from './components/IntentSelection';
import Onboarding from './components/Onboarding';
import AuthView from './components/AuthView';
import { getCurrentUser, logoutUser, getTravelPreferences, saveTravelPreferences } from './services/firebaseService';

// Lazy load heavy components for better initial load performance
const RecommendationView = lazy(() => import('./components/RecommendationView'));
const DestinationOptimizer = lazy(() => import('./components/DestinationOptimizer'));

// Loading component
const ComponentLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <div className="w-12 h-12 bg-indigo-600 rounded-full mx-auto mb-4 animate-spin border-4 border-slate-200 border-t-indigo-600"></div>
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INTENT_SELECTION);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [interactionData, setInteractionData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase auth persistence check
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
          });
          // Load user's travel preferences in background
          const savedPrefs = await getTravelPreferences(user.uid);
          if (savedPrefs) {
            setPreferences(savedPrefs);
            // Don't auto-navigate - stay on INTENT_SELECTION to let user choose
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const handleLogin = async (user: any) => {
    setCurrentUser(user);
    setLoading(false); // Important: mark loading as complete

    // Navigate IMMEDIATELY to INTENT_SELECTION - always show choice page first
    setCurrentStep(AppStep.INTENT_SELECTION);

    // Load preferences in background (completely non-blocking)
    // Just load them, don't auto-navigate (user chooses what to do next)
    if (user?.uid) {
      setTimeout(async () => {
        try {
          const savedPrefs = await getTravelPreferences(user.uid);
          if (savedPrefs) {
            setPreferences(savedPrefs);
            // Don't auto-navigate - just make preferences available
          }
        } catch (error) {
          console.warn("Background preference load failed (non-critical):", error);
        }
      }, 50); // Minimal delay to ensure state is committed
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      restart();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleIntent = (step: AppStep) => {
    setCurrentStep(step);
  };

  const handleOnboardingComplete = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setCurrentStep(AppStep.DISCOVERY);
    // Save preferences to Firestore
    if (currentUser) {
      try {
        await saveTravelPreferences(currentUser.uid, prefs);
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    }
  };

  const handleInteraction = (destinationId: string) => {
    setInteractionData(prev => [...prev.slice(-10), destinationId]);
  };

  const restart = () => {
    setCurrentStep(AppStep.INTENT_SELECTION);
    setPreferences(null);
  };

  const goBack = () => {
    setCurrentStep(AppStep.INTENT_SELECTION);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full mx-auto mb-4 animate-spin border-4 border-slate-200 border-t-indigo-600"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={restart}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <i className="fa-solid fa-compass text-xl"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">GoWhere</span>
        </div>

        <div className="flex items-center gap-6">
          {currentStep !== AppStep.INTENT_SELECTION && (
            <button
              onClick={restart}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-rotate-left"></i>
              Start Over
            </button>
          )}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
              <p className="text-sm font-medium text-slate-700">{currentUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-200"
              title="Logout"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {currentStep === AppStep.INTENT_SELECTION && (
          <IntentSelection onSelect={handleIntent} />
        )}

        {currentStep === AppStep.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {currentStep === AppStep.DISCOVERY && preferences && (
          <Suspense fallback={<ComponentLoader />}>
            <RecommendationView
              preferences={preferences}
              interactions={interactionData}
              onInteract={handleInteraction}
            />
          </Suspense>
        )}

        {currentStep === AppStep.OPTIMIZATION && (
          <Suspense fallback={<ComponentLoader />}>
            <DestinationOptimizer onBack={goBack} />
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default App;
