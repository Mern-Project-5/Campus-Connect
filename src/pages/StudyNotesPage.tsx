import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  BookOpen,
  GraduationCap,
  Sparkles,
  X,
  FileCheck,
} from 'lucide-react';

export const StudyNotesPage: React.FC = () => {
  const { notes, uploadNote, downloadNote, currentUser, showToast, searchQuery } = useCampus();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    description: '',
    file_name: 'CampusNotes_SemPrep.pdf',
    file_size: '4.2 MB',
  });

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Artificial Intelligence & ML',
    'Information Technology',
  ];

  const effectiveSearch = (searchQuery || localSearch).toLowerCase();

  const filteredNotes = notes.filter((n) => {
    const matchesDept = selectedDept === 'All' || n.department === selectedDept;
    const matchesQuery =
      !effectiveSearch ||
      n.title.toLowerCase().includes(effectiveSearch) ||
      n.subject.toLowerCase().includes(effectiveSearch) ||
      n.description.toLowerCase().includes(effectiveSearch);
    return matchesDept && matchesQuery;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) {
      showToast('Title and Subject are required', 'error');
      return;
    }

    uploadNote(formData);
    setIsUploadOpen(false);
    setFormData({
      title: '',
      subject: '',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      description: '',
      file_name: 'CampusNotes_SemPrep.pdf',
      file_size: '3.8 MB',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campus Academic Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Study Notes & Exam Preparations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Access curated lecture summaries, solved university question papers, lab manuals, and peer notes verified across all engineering branches.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Share & Upload Notes</span>
            </button>
            <span className="text-xs text-slate-400">
              ⚡ Over {notes.length * 75}+ total student downloads
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject or topic..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dept === 'All' ? 'All Branches' : dept.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] border border-indigo-200/50 dark:border-indigo-800/40">
                  {note.subject}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {note.year}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                {note.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {note.description}
              </p>
            </div>

            {/* Footer with Uploader & Download Trigger */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={note.author.avatar_url}
                  alt={note.author.full_name}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {note.author.full_name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {note.file_size} • {note.downloads_count} downloads
                  </p>
                </div>
              </div>

              <button
                onClick={() => downloadNote(note.id)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No study notes found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your subject search or contribute by uploading the first notes for this topic!
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Share Study Notes (PDF)
              </h3>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Distributed Systems Midterm Review & Formula Sheet"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject & Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="e.g. Operating Systems (CS401)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Academic Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year (Final)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Computer Science & Engineering">
                    Computer Science & Engineering
                  </option>
                  <option value="Electronics & Communication">
                    Electronics & Communication
                  </option>
                  <option value="Artificial Intelligence & ML">
                    Artificial Intelligence & ML
                  </option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Summary / Chapters Covered
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Outline key concepts, theorems, or solved questions..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Simulated PDF Upload Input */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formData.file_name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {formData.file_size} • PDF format ready
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  Ready
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
                >
                  Publish to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

