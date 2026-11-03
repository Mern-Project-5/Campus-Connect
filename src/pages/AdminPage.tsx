import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Search,
  Award,
  Layers,
  Calendar,
  FileText,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    currentUser,
    profiles,
    approveUser,
    rejectUser,
    toggleUserVerified,
    stats,
    posts,
    deletePost,
    communities,
    events,
    setActiveTab,
    setSelectedUserId,
  } = useCampus();

  const [activeTab, setActiveTabLocal] = useState<'pending' | 'users' | 'posts' | 'analytics'>('pending');
  const [userSearch, setUserSearch] = useState('');

  // Authorization check
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted: Super Admin Only
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-2">
          This dashboard contains confidential university administrative controls. Please log in with the Super Admin credentials.
        </p>
      </div>
    );
  }

  const pendingUsers = profiles.filter((p) => p.status === 'pending');

  const filteredUsers = profiles.filter(
    (p) =>
      p.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.department.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.phone.includes(userSearch)
  );

  return (
    <div className="space-y-6">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-rose-950/50 via-slate-900 to-indigo-950/40 rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Campus Security & Super Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administration & Member Approvals
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Signed in as <span className="font-semibold text-white">{currentUser.full_name}</span> ({currentUser.designation})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-white/10 text-white font-mono text-xs border border-white/20">
              RLS Policy Enforcement: ON
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">
            {stats.pendingApprovals}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Requires Dean verification
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Students</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.approvedStudents}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Verified undergrads
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Alumni & Pros</span>
            <Building className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.approvedProfessionals}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Industry mentors
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Campus Resources</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalPosts + stats.totalNotes}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {stats.totalNotes} notes, {stats.totalPosts} posts
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTabLocal('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All User Accounts ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Content Moderation ({posts.length})</span>
        </button>
      </div>

      {/* Tab: Pending Approvals Queue */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                All Caught Up!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                There are no pending registrations requiring approval at this moment.
              </p>
            </div>
          ) : (
            pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-amber-500/30 dark:border-amber-500/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 ring-2 ring-amber-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {user.full_name}
                      </span>
                      <span className="text-xs text-slate-400">@{user.username}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {user.account_type.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                      <p>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Department:</span> {user.department} ({user.branch})
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> {user.phone} • Class of {user.graduation_year}
                      </p>
                      <p className="text-slate-400 italic">"{user.bio}"</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: Approve / Reject */}
                <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => approveUser(user.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve User</span>
                  </button>

                  <button
                    onClick={() => rejectUser(user.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: All User Accounts Table */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user accounts..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400">
              Total {filteredUsers.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role / Type</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Verified Badge</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {user.full_name}
                          </p>
                          <p className="text-[10px] text-slate-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          user.role === 'admin'
                            ? 'bg-rose-500/10 text-rose-500'
                            : user.account_type === 'professional'
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-indigo-500/10 text-indigo-500'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : user.account_type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {user.department.split('&')[0]} ({user.graduation_year})
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold capitalize ${
                          user.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : user.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleUserVerified(user.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          user.is_verified
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {user.is_verified ? 'Verified ✓' : 'Unverified'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      {user.status === 'pending' ? (
                        <button
                          onClick={() => approveUser(user.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setActiveTab('profile');
                          }}
                          className="text-indigo-500 hover:underline font-semibold"
                        >
                          View Profile
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Content Moderation */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {post.author.full_name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-semibold uppercase">
                    {post.post_type}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                  {post.content}
                </p>
              </div>

              <button
                onClick={() => deletePost(post.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

