import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  Network,
  BrainCircuit,
  Bell,
  BarChart3,
  FileText,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

function NavItem({ to, path, label, icon: Icon, badge, collapsed, onClick }) {
  const destination = to || path;
  return (
    <NavLink
      to={destination}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `relative flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-xs font-medium transition-all duration-150 group ${
          isActive
            ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-[#202428] font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1C1F22]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Accent Indicator */}
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#F7931A]" />
          )}

          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
            <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#F7931A]' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
            {!collapsed && <span className="truncate">{label}</span>}
          </div>

          {!collapsed && badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isActive
                ? 'bg-amber-500/10 text-[#F7931A] border-amber-500/20'
                : 'bg-gray-100 dark:bg-[#202428] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#2D3135]'
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { label: 'Wallets', path: '/wallets', icon: Wallet },
    { label: 'Network', path: '/network', icon: Network },
    { label: 'AI Analysis', path: '/ai-analysis', icon: BrainCircuit, badge: 'AI' },
    { label: 'Alerts', path: '/alerts', icon: Bell, badge: '27' },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  const bottomItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const content = (isMobile = false) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
      <div className="flex flex-col justify-between h-full select-none overflow-hidden">
        {/* Header Branding & Collapse Toggle */}
        <div className={`p-4 border-b border-gray-200/80 dark:border-[#2D3135] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Logo collapsed={isCollapsed} />
          {isMobile ? (
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202428] transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Main Navigation Items */}
        <div className="p-3 space-y-1 overflow-y-auto flex-1 min-h-0">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Platform Modules
            </div>
          )}

          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              collapsed={isCollapsed}
              onClick={isMobile ? onClose : undefined}
            />
          ))}
        </div>

        {/* Bottom Actions & User Footer */}
        <div className="p-3 border-t border-gray-200/80 dark:border-[#2D3135] bg-gray-50/50 dark:bg-[#16181B] space-y-1 shrink-0">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Preferences
            </div>
          )}

          {bottomItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              collapsed={isCollapsed}
              onClick={isMobile ? onClose : undefined}
            />
          ))}

          {user && (
            <button
              onClick={() => {
                if (isMobile && onClose) onClose();
                logout();
                navigate('/login');
              }}
              title={isCollapsed ? 'Logout' : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors mt-1`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-[#191C1F] border-r border-gray-200/80 dark:border-[#2D3135] h-[calc(100vh-4rem)] sticky top-16 z-30 transition-all duration-300 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {content(false)}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
          />
          <aside className="relative z-10 w-72 bg-white dark:bg-[#191C1F] border-r border-gray-200 dark:border-[#2D3135] h-full shadow-2xl animate-slide-up">
            {content(true)}
          </aside>
        </div>
      )}
    </>
  );
}