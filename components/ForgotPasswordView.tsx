import React, { useMemo, useState } from 'react';
import { AdvancedButton } from './ui/gradient-button';
import { sendPasswordReset } from '../services/firebaseService';
import { geminiService } from '../services/geminiService';

interface ForgotPasswordViewProps {
  initialEmail?: string;
  onBackToLogin: () => void;
}

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ initialEmail = '', onBackToLogin }) => {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const [helpInput, setHelpInput] = useState('');
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpAnswer, setHelpAnswer] = useState<string | null>(null);

  const canSend = useMemo(() => isValidEmail(email) && status !== 'sending', [email, status]);

  const handleSendReset = async () => {
    setError(null);
    setStatus('sending');
    try {
      await sendPasswordReset(email.trim());
      setStatus('sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email. Please try again.';
      setError(message);
      setStatus('error');
    }
  };

  const handleAskAi = async () => {
    const msg = helpInput.trim();
    if (!msg) return;
    setHelpLoading(true);
    setHelpAnswer(null);
    try {
      const answer = await geminiService.getAuthHelp(msg);
      setHelpAnswer(answer);
    } finally {
      setHelpLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Forgot your password?</h1>
            <p className="text-white/70 mt-2 text-sm leading-relaxed">
              Enter your email and we’ll send a password reset link.
            </p>
          </div>
          <AdvancedButton variant="ghost" onClick={onBackToLogin}>
            Back
          </AdvancedButton>
        </div>

        <div className="mt-6 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/60">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-indigo-400/60"
          />

          {status === 'sent' && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Reset email sent to <span className="font-semibold">{email}</span>. Please check your inbox and spam/junk folder.
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <AdvancedButton
              variant="gradient"
              onClick={handleSendReset}
              disabled={!canSend}
              className="w-full"
            >
              {status === 'sending' ? 'Sending…' : 'Send reset email'}
            </AdvancedButton>
            <AdvancedButton
              variant="secondary"
              onClick={() => {
                setEmail(initialEmail || '');
                setStatus('idle');
                setError(null);
                setHelpAnswer(null);
                setHelpInput('');
              }}
              className="w-full"
              type="button"
            >
              Reset form
            </AdvancedButton>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <h2 className="text-sm font-semibold">Need help?</h2>
          <p className="text-xs text-white/60 mt-1">
            Describe what you’re seeing (example: “I didn’t receive the email”).
          </p>

          <div className="mt-3 space-y-3">
            <textarea
              value={helpInput}
              onChange={(e) => setHelpInput(e.target.value)}
              placeholder="Type your issue here…"
              className="w-full min-h-[90px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-indigo-400/60 resize-none"
            />
            <AdvancedButton
              variant="primary"
              onClick={handleAskAi}
              disabled={helpLoading || !helpInput.trim()}
              className="w-full"
              type="button"
            >
              {helpLoading ? 'Thinking…' : 'Ask AI'}
            </AdvancedButton>

            {helpAnswer && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-50 whitespace-pre-wrap">
                {helpAnswer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;

