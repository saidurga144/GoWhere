
'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-white/10 flex h-10 w-full min-w-0 rounded-lg border bg-white/5 px-3 py-1 text-white text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-white/30 focus-visible:ring-0 focus-visible:bg-white/10",
        className
      )}
      {...props}
    />
  )
}

interface AuthCardProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSubmit: (email: string, pass: string) => void;
  onGoogleSignIn?: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function SignInCard({ mode, onToggleMode, onSubmit, onGoogleSignIn, isLoading, error }: AuthCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full max-w-sm relative z-10" style={{ perspective: 1500 }}>
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 10 }}
      >
        <div className="relative group">
          <motion.div 
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
            animate={{
              boxShadow: [
                "0 0 10px 2px rgba(255,255,255,0.03)",
                "0 0 15px 5px rgba(255,255,255,0.05)",
                "0 0 10px 2px rgba(255,255,255,0.03)"
              ],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />

          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              animate={{ left: ["-50%", "100%"], opacity: [0.3, 0.7, 0.3] }}
              transition={{ left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 } }}
            />
          </div>

          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
            <div className="text-center space-y-1 mb-5">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden bg-white/5"
              >
                <span className="text-lg font-bold text-white">G</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              </motion.div>

              <motion.h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </motion.h1>
              
              <motion.p className="text-white/60 text-xs">
                {mode === 'login' ? 'Sign in to discover your next trip' : 'Join GoWhere to personalize your travel'}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <Mail className={cn("absolute left-3 top-3 w-4 h-4 transition-colors", focusedInput === "email" ? 'text-white' : 'text-white/40')} />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    required
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <Lock className={cn("absolute left-3 top-3 w-4 h-4 transition-colors", focusedInput === "password" ? 'text-white' : 'text-white/40')} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    required
                    className="pl-10 pr-10"
                  />
                  <div 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showPassword ? <Eye className="w-4 h-4 text-white/40" /> : <EyeOff className="w-4 h-4 text-white/40" />}
                  </div>
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-white focus:outline-none"
                    />
                    <label htmlFor="remember-me" className="text-xs text-white/60 hover:text-white/80 transition-colors">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="text-xs text-white/60 hover:text-white transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full relative group/button mt-5 bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center transition-all"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-1 text-sm font-medium">
                    {mode === 'login' ? 'Sign In' : 'Sign Up'}
                    <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>

              <div className="relative mt-2 mb-5 flex items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="mx-3 text-xs text-white/40">or</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <motion.button
                type="button"
                onClick={onGoogleSignIn}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white/5 text-white/80 text-xs font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </motion.button>

              <p className="text-center text-xs text-white/60 mt-4">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  type="button"
                  onClick={onToggleMode}
                  className="text-white hover:underline font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
