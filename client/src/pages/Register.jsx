import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Lock, Mail, User, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(name, email, password, role);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080F] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-btc-orange to-btc-amber shadow-xl shadow-btc-orange/20 mb-4">
            <Cpu className="w-8 h-8 text-black font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Register Analyst Account</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest text-btc-orange font-semibold">
            Bitcoin Traffic Intelligence
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Security Analyst Name"
                  className="w-full pl-9 pr-4 py-2.5 bg-dark-800/90 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-btc-orange focus:ring-1 focus:ring-btc-orange transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vishwa62@bitcoinintel.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-dark-800/90 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-btc-orange focus:ring-1 focus:ring-btc-orange transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-dark-800/90 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-btc-orange focus:ring-1 focus:ring-btc-orange transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                User Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-dark-800/90 border border-gray-700/80 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-btc-orange"
              >
                <option value="ANALYST">ANALYST (Investigate & Alert Management)</option>
                <option value="VIEWER">VIEWER (Read-only Dashboard Access)</option>
                <option value="ADMIN">ADMIN (Full System Administration)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-btc-orange to-btc-amber hover:from-btc-amber hover:to-btc-orange text-black font-bold rounded-xl text-sm shadow-lg shadow-btc-orange/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-btc-orange hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
