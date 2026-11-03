import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Home,
  Compass,
  FileText,
  Users2,
  Calendar,
  UserSearch,
  UserCheck,
  MessageSquare,
  User,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedUserId,
    currentUser,
    stats,
    messages,
  } = useCampus();

  // Unread messages count for current user
  const unreadMessagesCount = messages.filter(
    (m) => m.receiver_id === currentUser?.id && !m.read
  ).length;

  const navItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'notes', label: 'Study Notes', icon: FileText, badge: `${stats.totalNotes} PDFs` },
    { id: 'communities', label: 'Communities', icon: Users2, badge: `${stats.totalCommunities}` },
    { id: 'events', label: 'Events & Fests', icon: Calendar, badge: `${stats.totalEvents}` },
    { id: 'teammates', label: 'Find Teammates', icon: UserSearch, isHighlight: true },
    { id: 'connections', label: 'Connections', icon: UserCheck },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : undefined,
    },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-6 sticky top-20 h-[calc(100vh-6rem)] pb-4 overflow-y-auto">
      {/* Navigation Links */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    setSelectedUserId(null);
                  }
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.isHighlight ? 'text-indigo-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Super Admin Section (Only visible for admin) */}
          {currentUser?.role === 'admin' && (
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </div>

                {stats.pendingApprovals > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'admin'
                        ? 'bg-white text-rose-600'
                        : 'bg-rose-500 text-white animate-pulse'
                    }`}
                  >
                    {stats.pendingApprovals} pending
                  </span>
                )}
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* College Community Badge & Fast Facts */}
      <div className="bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-purple-900/10 dark:from-indigo-950/40 dark:to-purple-950/20 rounded-2xl p-4 border border-indigo-200/50 dark:border-indigo-800/30">
        <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Campus Directory</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          CampusTech University verified internal network. Collaborate on projects, share notes, and prepare for placements together.
        </p>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              {stats.approvedStudents}
            </span>
            <span className="text-[10px] text-slate-400">Students</span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              {stats.approvedProfessionals}
            </span>
            <span className="text-[10px] text-slate-400">Alumni / Pros</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

