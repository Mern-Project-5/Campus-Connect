import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Users,
  CheckCircle,
  Video,
  Building,
  Sparkles,
  X,
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, toggleRegisterEvent, createEvent, currentUser, showToast } = useCampus();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    date: '2026-03-10',
    time: '10:00 AM - 05:00 PM',
    location: 'CampusTech Innovation Lab',
    is_virtual: false,
    description: '',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    createEvent(formData);
    setIsCreateOpen(false);
    setFormData({
      title: '',
      category: 'Hackathon',
      date: '2026-03-10',
      time: '10:00 AM - 05:00 PM',
      location: 'CampusTech Innovation Lab',
      is_virtual: false,
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Activities & Tech Fests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Upcoming Campus Events & Hackathons
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Register for university hackathons, guest lectures from industry alumni, placement workshops, and cultural fests.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Host / Propose Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Banner */}
            <div className="h-40 bg-slate-800 relative">
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white font-bold text-[10px] backdrop-blur-sm shadow">
                  {event.category}
                </span>
                {event.is_virtual && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow">
                    <Video className="w-3 h-3" />
                    Virtual
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.date} • {event.time}
                </span>
                <h3 className="text-base font-bold line-clamp-1">{event.title}</h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  {event.is_virtual ? (
                    <Video className="w-4 h-4 text-indigo-500 shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className="truncate">{event.location}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {event.description}
                </p>
              </div>

              {/* Bottom Card */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">{event.registered_count}</span>
                  <span>Registered</span>
                </div>

                <button
                  onClick={() => toggleRegisterEvent(event.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    event.is_registered
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                  }`}
                >
                  {event.is_registered ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <span>Register / RSVP</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Host Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Host a Campus Event
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. AI Agents & Hackathon Kickoff"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop & Talk">Workshop & Talk</option>
                    <option value="Placement Prep">Placement Prep</option>
                    <option value="Cultural & Fest">Cultural & Fest</option>
                    <option value="Alumni Meetup">Alumni Meetup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time / Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    placeholder="10:00 AM - 04:00 PM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Venue / Link
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Auditorium Block B or Zoom"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Agenda
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Outline key speakers, prerequisites, rules, or prizes..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20"
                >
                  Publish Campus Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

