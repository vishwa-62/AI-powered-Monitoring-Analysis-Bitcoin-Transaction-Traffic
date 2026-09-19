import React from 'react';
import { User, Shield, Key, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6 font-mono max-w-3xl">
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
          <div className="w-16 h-16 rounded-full bg-btc-orange/20 border-2 border-btc-orange text-btc-orange flex items-center justify-center text-2xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || 'Security Analyst'}</h2>
            <p className="text-xs text-btc-orange font-bold uppercase tracking-wider mt-0.5">
              Role: {user?.role || 'ANALYST'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Account Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dark-800 p-4 rounded-xl border border-gray-700/60">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Mail className="w-4 h-4 text-btc-orange" />
                <span>Email Address</span>
              </div>
              <div className="text-sm font-bold text-white">{user?.email || 'vishwa62@bitcoinintel.com'}</div>
            </div>

            <div className="bg-dark-800 p-4 rounded-xl border border-gray-700/60">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Account Status</span>
              </div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
