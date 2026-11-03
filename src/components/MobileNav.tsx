import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Home,
  Compass,
  FileText,
  UserSearch,
  MessageSquare,
  User,
  ShieldAlert,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedUserId, currentUser, stats, messages } = useCampus();

  const unreadMessagesCount = messages.filter(
    (m) => m.receiver_id === currentUser?.id && !m.read
  ).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'home'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'explore'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'notes'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('teammates')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'teammates'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <UserSearch className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Teammates</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors relative ${
            activeTab === 'messages'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>

        {currentUser?.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors relative ${
              activeTab === 'admin'
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              {stats.pendingApprovals > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setSelectedUserId(null);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

