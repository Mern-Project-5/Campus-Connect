import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ShieldAlert, Users, UserCheck, Clock, UserPlus, Sparkles } from 'lucide-react';

interface DemoHeaderBannerProps {
  onOpenRegister: () => void;
}

export const DemoHeaderBanner: React.FC<DemoHeaderBannerProps> = ({ onOpenRegister }) => {
  const { currentUser, loginAs, stats, isDemoMode } = useCampus();

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            DEMO AUTH MODE ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            No real SMS OTP is sent. Exercise approval and roles end-to-end:
          </span>
        </div>

        {/* Quick Demo Switcher Buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-slate-500 font-medium mr-1 hidden lg:inline">Switch Persona:</span>
          
          <button
            onClick={() => loginAs('user-admin')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user-admin'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Admin</span>
            {stats.pendingApprovals > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                {stats.pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => loginAs('user-student-1')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user-student-1'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Student (Aarav)</span>
          </button>

          <button
            onClick={() => loginAs('user-pro-1')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user-pro-1'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Alum/Pro (Rohan)</span>
          </button>

          <button
            onClick={() => loginAs('user-pending-1')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user-pending-1'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending (Neha)</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="px-2.5 py-1 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

