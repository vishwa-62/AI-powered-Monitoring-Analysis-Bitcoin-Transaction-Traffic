import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  Bell,
  LogOut,
  User as UserIcon,
  Menu,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ isConnected = true, onOpenCommandPalette, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Breadcrumb generation
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
      return [{ label: 'Overview', path: '/dashboard' }, { label: 'Dashboard', path: '/dashboard' }];
    }

    const segmentsMap = {
      transactions: 'Transactions',
      wallets: 'Wallets',
      network: 'Network',
      'ai-analysis': 'AI Analysis',
      alerts: 'Alerts',
      analytics: 'Analytics',
      reports: 'Reports',
      profile: 'Profile',
      settings: 'Settings'
    };

    const firstSegment = pathSegments[0];
    const firstLabel = segmentsMap[firstSegment] || firstSegment;

    const items = [{ label: 'Platform', path: '/dashboard' }, { label: firstLabel, path: `/${firstSegment}` }];

    if (pathSegments.length > 1) {
      const detailParam = pathSegments[1];
      const truncatedParam = detailParam.length > 12 ? `${detailParam.substring(0, 6)}...${detailParam.substring(detailParam.length - 4)}` : detailParam;
      items.push({ label: truncatedParam, path: location.pathname });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-gray-200/80 dark:border-[#2D3135] bg-white/80 dark:bg-[#191C1F]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between gap-4 shadow-saas-sm">
      {/* Left: Mobile Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl border border-gray-200 dark:border-[#2D3135]"
          aria-label="Toggle Menu"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 min-w-0">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path + idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
              <Link
                to={crumb.path}
                className={`truncate hover:text-gray-900 dark:hover:text-white transition-colors ${
                  idx === breadcrumbs.length - 1 ? 'font-semibold text-gray-900 dark:text-white' : ''
                }`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center: Global Search Bar / Command Palette Trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full px-3.5 py-1.5 bg-gray-100/80 dark:bg-[#202428] hover:bg-gray-200/60 dark:hover:bg-[#262A2E] border border-gray-200 dark:border-[#2D3135] rounded-xl text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span>Search transactions, wallets, alerts...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#191C1F] border border-gray-200 dark:border-[#2D3135] text-gray-500 dark:text-gray-400 shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Live Status, Theme Switcher, Notifications, User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Live Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Monitoring Active</span>
        </div>

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-[#202428] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F7931A]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#191C1F] border border-gray-200 dark:border-[#2D3135] rounded-2xl shadow-xl p-3 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#2D3135] mb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">Recent Alerts</span>
                <span className="text-[10px] font-mono text-[#F7931A]">2 New</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#202428] text-xs space-y-1">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                    <span>Abnormal Tx Volume</span>
                    <span className="text-[10px] text-rose-500 font-mono">HIGH</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Wallet bc1q...72k transferred 48.2 BTC</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#202428] text-xs space-y-1">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                    <span>Pattern Detected</span>
                    <span className="text-[10px] text-amber-500 font-mono">MEDIUM</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Structuring flow pattern identified</p>
                </div>
              </div>
              <Link
                to="/alerts"
                onClick={() => setShowNotifications(false)}
                className="block text-center text-xs font-semibold text-[#F7931A] mt-2 pt-2 border-t border-gray-100 dark:border-[#2D3135] hover:underline"
              >
                View all in Alert Center →
              </Link>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 p-1 hover:bg-gray-100 dark:hover:bg-[#202428] rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-xs font-bold font-mono">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase">{user.role}</div>
              </div>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#191C1F] border border-gray-200 dark:border-[#2D3135] rounded-2xl shadow-xl p-1.5 z-50 animate-slide-up">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-[#2D3135] mb-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#202428] rounded-xl"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}