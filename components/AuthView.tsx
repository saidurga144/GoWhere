
import React, { useState } from 'react';
import { AuthComponent } from './ui/sign-up';
import { LoginComponent } from './ui/login';
import { registerUser, loginUser, createUserProfile, signInWithGoogle, signInWithGitHub, checkUserProfileExists } from '../services/firebaseService';
import { Compass } from 'lucide-react';
import { AdvancedButton } from './ui/gradient-button';
import ForgotPasswordView from './ForgotPasswordView';

const GoWhereLogo = () => (
  <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-md p-2.5">
    <Compass className="h-6 w-6" />
  </div>
);

interface Props {
  onLoginSuccess: (user: any) => void;
}

const AuthView: React.FC<Props> = ({ onLoginSuccess }) => {
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [oauthError, setOauthError] = useState<string | null>(null);

  const handleEmailSignUp = async (email: string, password: string, name?: string) => {
    try {
      const userCredential = await registerUser(email, password);
      await createUserProfile(userCredential.user.uid, {
        email: userCredential.user.email,
        displayName: name || '',
      });
      // Auto-login after signup
      onLoginSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        displayName: name || '',
      });
    } catch (err: any) {
      console.error("Signup error:", err.message);
      throw err;
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      const userCredential = await loginUser(email, password);
      onLoginSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      });
    } catch (err: any) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

  const handleForgotPassword = (email: string) => {
    setResetEmail(email || '');
    setAuthScreen('forgot');
  };

  const handleGoogleSignIn = async () => {
    try {
      setOauthError(null);
      const userCredential = await signInWithGoogle();
      
      // Login immediately - don't wait for profile check
      onLoginSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      });
      
      // Check if user exists in background (non-blocking)
      setTimeout(async () => {
        try {
          const userExists = await checkUserProfileExists(userCredential.user.uid);
          if (!userExists && authScreen !== 'login') {
            // New user signing up - create profile in background
            // This won't block the navigation
          }
        } catch (err) {
          console.warn('Background profile check failed:', err);
        }
      }, 100);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      const errorMessage = err.code === 'auth/popup-blocked' 
        ? 'Popup was blocked. Please allow popups for this site.'
        : err.code === 'auth/cancelled-popup-request'
        ? 'Sign-in cancelled.'
        : err.message || "Google sign-in failed. Please try again.";
      setOauthError(errorMessage);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setOauthError(null);
      const userCredential = await signInWithGitHub();
      const userExists = await checkUserProfileExists(userCredential.user.uid);
      
      if (userExists) {
        // User already exists, proceed to dashboard
        onLoginSuccess({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        });
      } else if (isLogin) {
        // New user trying to login with OAuth, show error
        setOauthError("No account found with this GitHub email. Please sign up first.");
      } else {
        // New user signing up - automatically create profile and login
        onLoginSuccess({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        });
      }
    } catch (err: any) {
      console.error("GitHub sign-in error:", err);
      const errorMessage = err.code === 'auth/popup-blocked' 
        ? 'Popup was blocked. Please allow popups for this site.'
        : err.code === 'auth/cancelled-popup-request'
        ? 'Sign-in cancelled.'
        : err.message || "GitHub sign-in failed. Please try again.";
      setOauthError(errorMessage);
    }
  };

  return (
    <>
      {authScreen === 'forgot' ? (
        <ForgotPasswordView
          initialEmail={resetEmail}
          onBackToLogin={() => setAuthScreen('login')}
        />
      ) : authScreen === 'login' ? (
        <LoginComponent 
          logo={<GoWhereLogo />} 
          brandName="GoWhere"
          onGoogleSignIn={handleGoogleSignIn}
          onGithubSignIn={handleGitHubSignIn}
          onEmailLogin={handleEmailLogin}
          onForgotPassword={handleForgotPassword}
          onSwitchToSignup={() => setAuthScreen('signup')}
        />
      ) : (
        <AuthComponent 
          logo={<GoWhereLogo />} 
          brandName="GoWhere"
          onGoogleSignIn={handleGoogleSignIn}
          onGithubSignIn={handleGitHubSignIn}
          onSwitchToLogin={() => setAuthScreen('login')}
        />
      )}
    </>
  );
};

export default AuthView;
