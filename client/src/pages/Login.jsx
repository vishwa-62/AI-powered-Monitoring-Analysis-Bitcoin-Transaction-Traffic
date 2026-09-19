import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#05080F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-btc-orange/10 rounded-full blur-3xl pointer-events-none animate-float"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-soc-indigo/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-soc-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md animate-slide-up relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gradient shadow-glow-btc mb-5">
            <Cpu className="w-9 h-9 text-black font-bold" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            <span className="text-brand-gradient">Bitcoin Traffic</span> Intelligence
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 uppercase tracking-[0.24em] font-mono font-semibold">
            AI CyberSOC Authentication Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-8 rounded-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-soc-red/10 border border-soc-red/25 text-soc-red/90 text-xs flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vishwa62@bitcoinintel.com"
                  className="field pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/login" onClick={() => alert('Demo account: vishwa62@bitcoinintel.com / Vish@2007@')} className="text-xs text-btc-orange hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-gradient hover:shadow-glow-btc text-black font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to SOC Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Quick Fill Demo Account
            </p>
            <button
              type="button"
              onClick={() => fillDemoAccount('vishwa62@bitcoinintel.com', 'Vish@2007@')}
              className="w-full p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-btc-orange/30 text-btc-orange rounded-lg font-bold text-center font-mono text-xs transition-all hover:shadow-glow-soft"
            >
              vishwa62@bitcoinintel.com
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an analyst account?{' '}
          <Link to="/register" className="text-btc-orange hover:underline font-semibold">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  );
}