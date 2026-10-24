import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export function Login() {
  const navigate = useNavigate();
  const { exitDemo } = useDashboard();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Ensure demo mode is turned off so user enters their real, 0-default personal ledger
    exitDemo(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-custom-bg flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none"></div>
      
      <motion.div 
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[440px] mx-auto bg-[#0a0a0b]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] rounded-[24px] p-10 relative z-10 hover:border-white/[0.12] transition-all duration-300 ring-1 ring-white/[0.02]"
      >
        <div className="flex items-center gap-sm mb-8 justify-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full border border-custom-text-muted flex items-center justify-center text-on-surface font-h3 font-bold hover:bg-white/[0.05] transition-colors">L</div>
          <span className="font-h3 text-h3 font-bold tracking-tight text-on-surface">Ledger</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="font-h4 text-on-surface mb-2">Welcome back</h2>
          <p className="font-body-md text-custom-text-muted">Enter your credentials to access the command center.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 group">
            <label className="font-mono-data text-[10px] text-custom-text-muted uppercase tracking-widest block group-focus-within:text-primary transition-colors">Email Address</label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-custom-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 text-on-surface font-body-md focus:outline-none focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-custom-text-muted/40"
                placeholder="operator@ledger.app"
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="font-mono-data text-[10px] text-custom-text-muted uppercase tracking-widest block group-focus-within:text-primary transition-colors">Secure Hash</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-custom-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 text-on-surface font-body-md focus:outline-none focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-custom-text-muted/40"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-body-lg font-bold py-4 rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authenticate <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
          <p className="font-mono-data text-[10px] text-custom-text-muted uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            SECURE_CONNECTION // 256_BIT_ENC
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
