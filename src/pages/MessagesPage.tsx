import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const {
    currentUser,
    profiles,
    messages,
    sendMessage,
    selectedUserId,
    setSelectedUserId,
    setActiveTab,
  } = useCampus();

  const [messageInput, setMessageInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  if (!currentUser) return null;

  // Active chat partner: either selectedUserId or first person who chatted
  const partnerId =
    selectedUserId ||
    (currentUser.id === 'user-student-1'
      ? 'user-pro-1'
      : currentUser.id === 'user-admin'
      ? 'user-student-1'
      : 'user-student-1');

  const activePartner = profiles.find((p) => p.id === partnerId);

  // Filter messages between currentUser and activePartner
  const conversationMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUser.id && m.receiver_id === partnerId) ||
      (m.sender_id === partnerId && m.receiver_id === currentUser.id)
  );

  // All people the user has interacted with or can message
  const availablePartners = profiles.filter(
    (p) => p.id !== currentUser.id && p.status === 'approved'
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !partnerId) return;
    sendMessage(partnerId, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden h-[calc(100vh-10rem)] min-h-[500px] flex flex-col md:flex-row">
      {/* Left: Chat Contacts List */}
      <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Campus Messages</span>
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Live
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search peers..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {availablePartners
            .filter((p) =>
              p.full_name.toLowerCase().includes(chatSearch.toLowerCase())
            )
            .map((partner) => {
              const isSelected = partner.id === partnerId;
              const lastMsg = [...messages]
                .reverse()
                .find(
                  (m) =>
                    (m.sender_id === currentUser.id && m.receiver_id === partner.id) ||
                    (m.sender_id === partner.id && m.receiver_id === currentUser.id)
                );

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedUserId(partner.id)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar_url}
                      alt={partner.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {partner.is_verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {partner.full_name}
                      </p>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(lastMsg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.content : partner.designation || partner.department}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Right: Active Chat Conversation */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
        {activePartner ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div
                onClick={() => {
                  setSelectedUserId(activePartner.id);
                  setActiveTab('profile');
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={activePartner.avatar_url}
                  alt={activePartner.full_name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      {activePartner.full_name}
                    </span>
                    {activePartner.is_verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {activePartner.department} • {activePartner.account_type}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedUserId(activePartner.id);
                  setActiveTab('profile');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                View Profile
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {conversationMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <Sparkles className="w-10 h-10 text-indigo-400 mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start a conversation with {activePartner.full_name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    Collaborate on academic subjects, project ideas, or alumni mentorship.
                  </p>
                </div>
              ) : (
                conversationMessages.map((msg) => {
                  const isMine = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isMine ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-sm sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-600/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Composer */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900"
            >
              <input
                type="text"
                placeholder={`Message ${activePartner.full_name}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/20 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            Select a peer from the left list to begin messaging.
          </div>
        )}
      </div>
    </div>
  );
};

