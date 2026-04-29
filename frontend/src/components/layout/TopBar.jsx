import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function TopBar({ onMenuClick }) {
  const { companyName, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#111111] border-b border-brand-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-brand-surface transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="text-white font-semibold text-sm hidden sm:block">Leapfrog Connect</span>
      </div>

      <div className="flex items-center gap-3">
        {companyName && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
              <span className="text-brand-accent text-xs font-semibold">
                {companyName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-300">{companyName}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-brand-surface transition-colors text-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
