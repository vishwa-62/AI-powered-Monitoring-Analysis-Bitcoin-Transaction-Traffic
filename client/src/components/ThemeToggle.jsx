import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center p-1 bg-gray-100 dark:bg-[#191C1F] border border-gray-200 dark:border-[#2D3135] rounded-xl text-xs">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'light'
            ? 'bg-white text-gray-900 shadow-sm font-medium'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'dark'
            ? 'bg-[#202428] text-white shadow-sm font-medium'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
