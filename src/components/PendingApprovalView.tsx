import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  Building2,
  GraduationCap,
} from 'lucide-react';

export const PendingApprovalView: React.FC = () => {
  const { currentUser, loginAs, setActiveTab, logout } = useCampus();

  if (!currentUser) return null;

  const isRejected = currentUser.status === 'rejected';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
        {/* Animated Status Icon */}
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
            isRejected
              ? 'bg-rose-500/10 text-rose-500'
              : 'bg-amber-500/10 text-amber-500'
          }`}
        >
          {isRejected ? (
            <AlertCircle className="w-8 h-8" />
          ) : (
            <Clock className="w-8 h-8 animate-pulse" />
          )}
        </div>

        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            isRejected
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}
        >
          {isRejected ? 'Account Application Declined' : 'Campus Verification Pending'}
        </span>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          {isRejected ? 'Application Not Approved' : 'Waiting for Dean / Admin Approval'}
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {isRejected
            ? `Sorry ${currentUser.full_name}, your account registration was rejected by the college administrator. Please contact your campus department coordinator.`
            : `Welcome ${currentUser.full_name}! To maintain a trusted academic environment, all student and alumni profiles are manually verified by the College Administration before gaining access to community feeds and messaging.`}
        </p>

        {/* User Card Summary */}
        <div className="my-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-left text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="font-semibold">{currentUser.department}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Class of {currentUser.graduation_year} • {currentUser.account_type}</span>
          </div>
        </div>

        {/* Demo Fast-Track Action to test approval workflow */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 mb-5">
          <div className="flex items-center justify-center gap-1.5 font-bold mb-1 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>Testing the Hackathon Approval Flow?</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
            Switch to the <strong>Super Admin (Dr. Vikram Sen)</strong> role to review, approve, or reject this pending account.
          </p>
          <button
            onClick={() => {
              loginAs('user-admin');
              setActiveTab('admin');
            }}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            <span>Log in as Super Admin & Approve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={logout}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center gap-1 mx-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>
    </div>
  );
};

