import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CommunityCategory } from '../types';
import {
  Users2,
  Plus,
  Search,
  Check,
  UserPlus,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const CommunitiesPage: React.FC = () => {
  const {
    communities,
    toggleJoinCommunity,
    createCommunity,
    currentUser,
    posts,
    setActiveTab,
    showToast,
  } = useCampus();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Community creation form
  const [newComm, setNewComm] = useState({
    name: '',
    category: 'Coding' as CommunityCategory,
    description: '',
  });

  const categories = [
    'All',
    'AI/ML',
    'Coding',
    'Placements',
    'Academics',
    'Robotics',
    'Design',
  ];

  const filteredCommunities = communities.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesQuery =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComm.name.trim() || !newComm.description.trim()) {
      showToast('Name and description required', 'error');
      return;
    }
    createCommunity(newComm);
    setIsCreateOpen(false);
    setNewComm({ name: '', category: 'Coding', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
            <Users2 className="w-3.5 h-3.5" />
            <span>Campus Student Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Societies, Clubs & Interest Circles
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Join student-led organizations, technical chapters, and placement preparation groups. Collaborate on projects and build your campus network.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-purple-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start a New Society</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search communities by name or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCommunities.map((comm) => {
          const commPostsCount = posts.filter((p) => p.community_id === comm.id).length;

          return (
            <div
              key={comm.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Banner / Cover */}
              <div className="h-24 bg-gradient-to-r from-indigo-800 to-purple-800 relative">
                {comm.banner_url && (
                  <img
                    src={comm.banner_url}
                    alt={comm.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                  {comm.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between -mt-6">
                <div>
                  <div className="flex items-end justify-between mb-3">
                    <img
                      src={comm.avatar_url}
                      alt={comm.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-md bg-white"
                    />
                    <span className="text-[11px] font-semibold text-slate-500">
                      {comm.members_count} Members
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
                    {comm.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {comm.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {commPostsCount} posts shared
                  </span>

                  <button
                    onClick={() => toggleJoinCommunity(comm.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      comm.is_member
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                    }`}
                  >
                    {comm.is_member ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join Club</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Community Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Launch a Campus Society
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Society / Club Name
                </label>
                <input
                  type="text"
                  required
                  value={newComm.name}
                  onChange={(e) => setNewComm({ ...newComm, name: e.target.value })}
                  placeholder="e.g. Autonomous Systems & Drone Lab"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Domain / Category
                </label>
                <select
                  value={newComm.category}
                  onChange={(e) =>
                    setNewComm({
                      ...newComm,
                      category: e.target.value as CommunityCategory,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Coding">Coding</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Placements">Placements</option>
                  <option value="Academics">Academics</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Purpose & Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newComm.description}
                  onChange={(e) =>
                    setNewComm({ ...newComm, description: e.target.value })
                  }
                  placeholder="Describe activities, meeting cadence, and who should join..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/20"
                >
                  Create Society
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

