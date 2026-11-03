import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  GraduationCap,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    currentUser,
    isDarkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    setSelectedUserId,
    logout,
  } = useCampus();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              setActiveTab('home');
              setSelectedUserId(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">
                  CampusConnect
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                  CampusTech
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 hidden sm:block">
                Academic & Professional Student Network
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search peers, notes, communities, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* User Profile / Status */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  {currentUser.is_verified && (
                    <span
                      title="Verified Campus Member"
                      className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                      {currentUser.full_name}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                    {currentUser.role === 'admin' ? 'Super Admin' : currentUser.account_type}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">@{currentUser.username}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          currentUser.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : currentUser.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}
                      >
                        Status: {currentUser.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUserId(null);
                      setActiveTab('profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>View & Edit My Profile</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Super Admin Dashboard</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500">Not signed in</div>
          )}
        </div>
      </div>
    </header>
  );
};

