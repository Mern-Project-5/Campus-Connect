import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  UserSearch,
  Search,
  Filter,
  ShieldCheck,
  Send,
  UserPlus,
  ExternalLink,
  Github,
  Linkedin,
  Sparkles,
} from 'lucide-react';

export const TeammatesPage: React.FC = () => {
  const {
    profiles,
    currentUser,
    sendFriendRequest,
    friendRequests,
    setActiveTab,
    setSelectedUserId,
    showToast,
  } = useCampus();

  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const commonSkills = [
    'All',
    'Python',
    'React',
    'TypeScript',
    'PyTorch',
    'ROS2',
    'Go',
    'PostgreSQL',
    'Docker',
  ];

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Artificial Intelligence & ML',
    'Information Technology',
  ];

  const approvedMembers = profiles.filter(
    (p) => p.status === 'approved' && p.id !== currentUser?.id
  );

  const filteredMembers = approvedMembers.filter((person) => {
    const matchesSkill =
      selectedSkill === 'All' ||
      person.skills.some((s) =>
        s.toLowerCase().includes(selectedSkill.toLowerCase())
      );

    const matchesDept =
      selectedDept === 'All' || person.department === selectedDept;

    const matchesQuery =
      !search ||
      person.full_name.toLowerCase().includes(search.toLowerCase()) ||
      person.bio.toLowerCase().includes(search.toLowerCase()) ||
      person.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return matchesSkill && matchesDept && matchesQuery;
  });

  const getFriendshipStatus = (otherId: string) => {
    if (!currentUser) return 'none';
    const req = friendRequests.find(
      (fr) =>
        (fr.sender_id === currentUser.id && fr.receiver_id === otherId) ||
        (fr.sender_id === otherId && fr.receiver_id === currentUser.id)
    );
    if (!req) return 'none';
    return req.status; // 'pending' | 'accepted' | 'rejected'
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 rounded-3xl p-6 sm:p-8 border border-blue-500/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <UserSearch className="w-3.5 h-3.5" />
            <span>Hackathon & Research Teammate Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Project Teammates & Mentors
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Form high-performing teams for upcoming college hackathons, capstone projects, and research papers. Filter peers by tech stack and verified skills.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, skill, or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
              Department:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skill Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold mr-1">Skills:</span>
          {commonSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSkill === skill
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Member Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((person) => {
          const reqStatus = getFriendshipStatus(person.id);

          return (
            <div
              key={person.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header & Avatar */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={person.avatar_url}
                      alt={person.full_name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                    />
                    {person.is_verified && (
                      <span
                        title="Verified Campus Member"
                        className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5"
                      >
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      person.account_type === 'professional'
                        ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {person.role === 'admin'
                      ? 'Super Admin'
                      : person.account_type}
                  </span>
                </div>

                {/* Name & Designation */}
                <h3
                  onClick={() => {
                    setSelectedUserId(person.id);
                    setActiveTab('profile');
                  }}
                  className="font-bold text-base text-slate-900 dark:text-white hover:text-indigo-500 cursor-pointer transition-colors"
                >
                  {person.full_name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {person.designation || person.department}
                </p>
                <p className="text-[11px] text-indigo-500 font-medium">
                  Class of {person.graduation_year} • {person.department.split('&')[0]}
                </p>

                {/* Short Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {person.bio}
                </p>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                  {person.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {person.skills.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{person.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions: Connect & View Profile */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedUserId(person.id);
                    setActiveTab('profile');
                  }}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-500 font-semibold"
                >
                  View Profile
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedUserId(person.id);
                      setActiveTab('messages');
                    }}
                    title="Send Private Message"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => sendFriendRequest(person.id)}
                    disabled={reqStatus === 'accepted' || reqStatus === 'pending'}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                      reqStatus === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : reqStatus === 'pending'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>
                      {reqStatus === 'accepted'
                        ? 'Connected'
                        : reqStatus === 'pending'
                        ? 'Pending'
                        : 'Connect'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

