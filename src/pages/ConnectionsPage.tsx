import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  UserCheck,
  UserPlus,
  Clock,
  Check,
  X,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  const {
    currentUser,
    profiles,
    friendRequests,
    respondFriendRequest,
    sendFriendRequest,
    setActiveTab,
    setSelectedUserId,
  } = useCampus();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'connections' | 'all'>('requests');

  if (!currentUser) return null;

  // Requests received by current user that are pending
  const incomingRequests = friendRequests
    .filter((fr) => fr.receiver_id === currentUser.id && fr.status === 'pending')
    .map((fr) => ({
      ...fr,
      sender: profiles.find((p) => p.id === fr.sender_id),
    }));

  // Connected users
  const connectedUserIds = friendRequests
    .filter(
      (fr) =>
        fr.status === 'accepted' &&
        (fr.sender_id === currentUser.id || fr.receiver_id === currentUser.id)
    )
    .map((fr) => (fr.sender_id === currentUser.id ? fr.receiver_id : fr.sender_id));

  const connections = profiles.filter((p) => connectedUserIds.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-blue-950/30 to-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Campus Network & Relations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Connections & Peer Invitations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Manage your campus network, accept pending requests from classmates, and stay connected with alumni working across the tech industry.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Received Requests</span>
          {incomingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('connections')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'connections'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>My Connections ({connections.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Discover Campus Peers</span>
        </button>
      </div>

      {/* Tab: Received Requests */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No pending requests
              </p>
              <p className="text-xs text-slate-500 mt-1">
                When classmates or mentors send you connection invites, they’ll show up here.
              </p>
            </div>
          ) : (
            incomingRequests.map((req) => {
              const sender = req.sender;
              if (!sender) return null;

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div
                    onClick={() => {
                      setSelectedUserId(sender.id);
                      setActiveTab('profile');
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={sender.avatar_url}
                      alt={sender.full_name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                          {sender.full_name}
                        </span>
                        {sender.is_verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {sender.department} • Class of {sender.graduation_year}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {sender.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => respondFriendRequest(req.id, 'accepted')}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => respondFriendRequest(req.id, 'rejected')}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 font-semibold text-xs flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Active Connections */}
      {activeSubTab === 'connections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                You have not connected with anyone yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Explore the campus directory or check out teammate recommendations to grow your circle.
              </p>
            </div>
          ) : (
            connections.map((person) => (
              <div
                key={person.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    setSelectedUserId(person.id);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-3 cursor-pointer truncate"
                >
                  <img
                    src={person.avatar_url}
                    alt={person.full_name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {person.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {person.department.split('&')[0]}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedUserId(person.id);
                    setActiveTab('messages');
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors shrink-0"
                  title="Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Discover */}
      {activeSubTab === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles
            .filter((p) => p.status === 'approved' && p.id !== currentUser.id)
            .map((person) => (
              <div
                key={person.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    setSelectedUserId(person.id);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-3 cursor-pointer truncate"
                >
                  <img
                    src={person.avatar_url}
                    alt={person.full_name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {person.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {person.account_type} • Class of {person.graduation_year}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => sendFriendRequest(person.id)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 shadow-sm"
                >
                  Connect
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

