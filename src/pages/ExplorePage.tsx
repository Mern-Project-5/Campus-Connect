import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Compass,
  Search,
  Sparkles,
  TrendingUp,
  FileText,
  Users,
  Award,
  Download,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const {
    posts,
    communities,
    notes,
    profiles,
    events,
    setActiveTab,
    setSelectedUserId,
    downloadNote,
  } = useCampus();

  const [search, setSearch] = useState('');

  const trendingTopics = [
    { tag: 'HackCampus2026', count: '142 posts', desc: 'Annual 36h national innovation hackathon' },
    { tag: 'PlacementPrep2026', count: '89 posts', desc: 'FAANG & tier-1 mock interview tips' },
    { tag: 'MultimodalAI', count: '67 posts', desc: 'LLMs, vector embeddings & agents' },
    { tag: 'AutonomousRobotics', count: '54 posts', desc: 'LiDAR quadcopters & ROS2 chassis' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900 rounded-3xl p-6 sm:p-8 border border-violet-500/20 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-3 border border-violet-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Campus Discovery & Trends</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore CampusTech Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Discover peer innovations, trending engineering clubs, highest-rated semester notes, and student leaders across our campus.
          </p>
        </div>
      </div>

      {/* Trending Topics Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Trending on Campus</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => setActiveTab('home')}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-indigo-500 font-bold mb-1">
                <span>#{topic.tag}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {topic.count}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {topic.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Spotlight: Featured Student Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Featured Student Projects</span>
          </h2>
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts
            .filter((p) => p.post_type === 'project' || p.post_type === 'achievement')
            .slice(0, 2)
            .map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {post.author.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {post.author.department.split('&')[0]}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUserId(post.author.id);
                      setActiveTab('profile');
                    }}
                    className="text-xs text-indigo-500 hover:underline font-semibold"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Highest Downloaded Study Notes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            <span>Top Downloaded Semester Notes</span>
          </h2>
          <button
            onClick={() => setActiveTab('notes')}
            className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center"
          >
            <span>All Notes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-500 block mb-1">
                  {note.subject}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                  {note.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {note.downloads_count} downloads
                </span>
                <button
                  onClick={() => downloadNote(note.id)}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

