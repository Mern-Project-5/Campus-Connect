import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { Profile, Project } from '../types';
import {
  ShieldCheck,
  Edit3,
  Calendar,
  GraduationCap,
  Building2,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  X,
  Plus,
  Send,
  UserPlus,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    profiles,
    selectedUserId,
    setSelectedUserId,
    updateProfile,
    posts,
    sendFriendRequest,
    setActiveTab,
    showToast,
  } = useCampus();

  // If selectedUserId is provided, view that profile; otherwise view currentUser
  const targetUser: Profile | null = selectedUserId
    ? profiles.find((p) => p.id === selectedUserId) || currentUser
    : currentUser;

  const isOwnProfile = currentUser && targetUser && currentUser.id === targetUser.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    full_name: targetUser?.full_name || '',
    bio: targetUser?.bio || '',
    department: targetUser?.department || '',
    branch: targetUser?.branch || '',
    academic_year: targetUser?.academic_year || '',
    graduation_year: targetUser?.graduation_year || '',
    designation: targetUser?.designation || '',
    company_or_institution: targetUser?.company_or_institution || '',
    skills: targetUser?.skills?.join(', ') || '',
    interests: targetUser?.interests?.join(', ') || '',
    linkedin_url: targetUser?.linkedin_url || '',
    github_url: targetUser?.github_url || '',
    instagram_url: targetUser?.instagram_url || '',
  });

  if (!targetUser) {
    return (
      <div className="text-center py-12 text-slate-500">
        Profile not found.
      </div>
    );
  }

  const userPosts = posts.filter((p) => p.user_id === targetUser.id);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: formData.full_name,
      bio: formData.bio,
      department: formData.department,
      branch: formData.branch,
      academic_year: formData.academic_year,
      graduation_year: formData.graduation_year,
      designation: formData.designation,
      company_or_institution: formData.company_or_institution,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
      linkedin_url: formData.linkedin_url,
      github_url: formData.github_url,
      instagram_url: formData.instagram_url,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
        {/* Cover Photo */}
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-indigo-700 via-indigo-900 to-purple-900 relative">
          {targetUser.cover_url && (
            <img
              src={targetUser.cover_url}
              alt="Cover"
              className="w-full h-full object-cover opacity-70"
            />
          )}
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar */}
            <div className="relative inline-block">
              <img
                src={targetUser.avatar_url}
                alt={targetUser.full_name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-white"
              />
              {targetUser.is_verified && (
                <span
                  title="Verified Campus Member"
                  className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 shadow"
                >
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedUserId(targetUser.id);
                      setActiveTab('messages');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => sendFriendRequest(targetUser.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {targetUser.full_name}
              </h1>
              <span className="text-sm text-slate-400">@{targetUser.username}</span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  targetUser.account_type === 'professional'
                    ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {targetUser.role === 'admin' ? 'Super Admin' : targetUser.account_type}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              {targetUser.designation || targetUser.department}
            </p>

            {/* Department & Batch Metadata */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                {targetUser.department} ({targetUser.branch})
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-500" />
                {targetUser.company_or_institution || 'CampusTech University'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Class of {targetUser.graduation_year}
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {targetUser.bio}
            </p>

            {/* Social & Portfolio Links */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              {targetUser.linkedin_url && (
                <a
                  href={targetUser.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn</span>
                </a>
              )}
              {targetUser.github_url && (
                <a
                  href={targetUser.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {targetUser.instagram_url && (
                <a
                  href={targetUser.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills and Interests Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Verified Skills & Competencies</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {targetUser.skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <span>Interests & Research Focus</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {targetUser.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200/40 dark:border-purple-800/40"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Showcase */}
      {targetUser.projects && targetUser.projects.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Highlighted Projects</span>
          </h3>

          <div className="space-y-4">
            {targetUser.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {proj.title}
                  </h4>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
                    >
                      <span>Code / Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {proj.description}
                </p>
                {proj.tags && (
                  <div className="flex gap-1.5 mt-2">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {targetUser.achievements && targetUser.achievements.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Honors & Achievements</span>
          </h3>
          <ul className="space-y-2">
            {targetUser.achievements.map((ach, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Edit Your Campus Profile
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.graduation_year}
                    onChange={(e) =>
                      setFormData({ ...formData, graduation_year: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) =>
                    setFormData({ ...formData, interests: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin_url}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin_url: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

