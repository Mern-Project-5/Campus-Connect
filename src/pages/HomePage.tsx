import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { Post, PostType } from '../types';
import {
  Send,
  Image,
  FileText,
  Tag,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Sparkles,
  Award,
  HelpCircle,
  Rocket,
  Download,
  Calendar,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    currentUser,
    posts,
    createPost,
    deletePost,
    toggleLikePost,
    addComment,
    comments,
    communities,
    events,
    profiles,
    setActiveTab,
    setSelectedUserId,
    showToast,
  } = useCampus();

  // Post Creator State
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('regular');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['CampusLife']);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'pdf' | 'document'>('image');
  const [showAttachOptions, setShowAttachOptions] = useState(false);

  // Expanded comments state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Please write something before posting', 'error');
      return;
    }

    createPost({
      content,
      post_type: postType,
      tags,
      media_url: mediaUrl || undefined,
      media_type: mediaUrl ? mediaType : undefined,
      attachment_name:
        mediaType === 'pdf' ? 'CampusNotes_Shared.pdf' : undefined,
      attachment_size: mediaType === 'pdf' ? '2.4 MB' : undefined,
      community_id: selectedCommunity || undefined,
    });

    // Reset form
    setContent('');
    setTags(['CampusLife']);
    setMediaUrl('');
    setShowAttachOptions(false);
  };

  const handlePostComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const getPostTypeBadge = (type: PostType) => {
    switch (type) {
      case 'project':
        return { label: 'Project Update', icon: Rocket, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      case 'question':
        return { label: 'Academic Doubt', icon: HelpCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'achievement':
        return { label: 'Achievement', icon: Award, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'notes':
        return { label: 'Study Notes', icon: FileText, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      default:
        return { label: 'Campus Post', icon: Sparkles, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Feed Column */}
      <div className="lg:col-span-8 space-y-6">
        {/* Post Creation Card */}
        {currentUser && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-start gap-3.5 mb-3">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's happening on campus, ${currentUser.full_name.split(' ')[0]}? Share a project, question, or notes...`}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                />
              </div>
            </div>

            {/* Post Type Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {(
                [
                  { id: 'regular', label: 'General', icon: Sparkles },
                  { id: 'project', label: 'Project', icon: Rocket },
                  { id: 'question', label: 'Question', icon: HelpCircle },
                  { id: 'achievement', label: 'Achievement', icon: Award },
                  { id: 'notes', label: 'Notes/PDF', icon: FileText },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isSelected = postType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPostType(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tags preview */}
            <div className="flex flex-wrap items-center gap-1.5 my-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800/40"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="relative inline-flex items-center">
                <Tag className="w-3 h-3 text-slate-400 absolute left-2" />
                <input
                  type="text"
                  placeholder="Add tag (Press Enter)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-transparent text-[11px] pl-6 pr-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Media Attachment simulation options */}
            {showAttachOptions && (
              <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Attachment Type:
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-2 py-1 text-slate-800 dark:text-slate-200"
                  >
                    <option value="image">Image (URL / Upload)</option>
                    <option value="pdf">PDF Document / Note</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder={
                    mediaType === 'image'
                      ? 'Image URL (e.g. Unsplash URL or upload)'
                      : 'PDF attachment link or document title'
                  }
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMediaUrl(
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200'
                      )
                    }
                    className="text-[11px] text-indigo-500 hover:underline"
                  >
                    + Sample Campus Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('pdf');
                      setMediaUrl('https://campusconnect.edu/notes/CS401_notes.pdf');
                    }}
                    className="text-[11px] text-purple-500 hover:underline"
                  >
                    + Sample PDF Note
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Bar: Attachment toggles & Post Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAttachOptions(!showAttachOptions)}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <Image className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">Attach Media</span>
                </button>

                {/* Community tagging */}
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 max-w-[150px] truncate"
                >
                  <option value="">Post to Public Feed</option>
                  {communities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSubmitPost}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <span>Publish</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-5">
          {posts.map((post) => {
            const badge = getPostTypeBadge(post.post_type);
            const BadgeIcon = badge.icon;
            const postComments = comments.filter((c) => c.post_id === post.id);
            const isCommentsOpen = activeCommentPostId === post.id;
            const canDelete =
              currentUser?.id === post.user_id || currentUser?.role === 'admin';

            return (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
              >
                {/* Author Info & Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    onClick={() => {
                      setSelectedUserId(post.author.id);
                      setActiveTab('profile');
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={post.author.avatar_url}
                        alt={post.author.full_name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all"
                      />
                      {post.author.is_verified && (
                        <span
                          title="Verified Campus Member"
                          className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5"
                        >
                          <ShieldCheck className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                          {post.author.full_name}
                        </span>
                        <span className="text-xs text-slate-400">
                          @{post.author.username}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            post.author.account_type === 'professional'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {post.author.role === 'admin'
                            ? 'Admin'
                            : post.author.account_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                        {post.author.department}
                        {post.community_name && (
                          <span className="text-indigo-500 ml-1">
                            in {post.community_name}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Post category badge */}
                    <span
                      className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${badge.color}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    {/* Delete button */}
                    {canDelete && (
                      <button
                        onClick={() => deletePost(post.id)}
                        title="Delete Post"
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line mb-4 font-normal">
                  {post.content}
                </div>

                {/* Attachment: Image */}
                {post.media_url && post.media_type === 'image' && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 max-h-96">
                    <img
                      src={post.media_url}
                      alt="Post visual attachment"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Attachment: Study Note / PDF Document */}
                {post.media_type === 'pdf' && (
                  <div className="mb-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {post.attachment_name || 'CampusStudyNote.pdf'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {post.attachment_size || '3.5 MB'} • Verified Academic Resource
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        showToast(
                          `Downloading ${post.attachment_name || 'CampusStudyNote.pdf'}...`,
                          'info'
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement Bar: Like, Comment, Share */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-semibold transition-colors ${
                        post.has_liked
                          ? 'text-rose-500'
                          : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.has_liked ? 'fill-current text-rose-500' : ''
                        }`}
                      />
                      <span>{post.likes_count}</span>
                    </button>

                    {/* Comment button */}
                    <button
                      onClick={() =>
                        setActiveCommentPostId(
                          isCommentsOpen ? null : post.id
                        )
                      }
                      className="flex items-center gap-1.5 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments_count} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Post link copied to clipboard!', 'info');
                    }}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comment Thread Box */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    {/* Add Comment Input */}
                    {currentUser && (
                      <div className="flex items-center gap-2">
                        <img
                          src={currentUser.avatar_url}
                          alt={currentUser.full_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Write a constructive campus comment..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePostComment(post.id);
                          }}
                          className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handlePostComment(post.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {postComments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-2">
                          No comments yet. Start the conversation!
                        </p>
                      ) : (
                        postComments.map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                onClick={() => {
                                  setSelectedUserId(c.author.id);
                                  setActiveTab('profile');
                                }}
                                className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:underline"
                              >
                                {c.author.full_name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(c.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">
                              {c.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar: Events & Teammate Spotlight */}
      <div className="lg:col-span-4 space-y-6">
        {/* Upcoming College Events Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Upcoming Events
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                onClick={() => setActiveTab('events')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all group"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  {event.date} • {event.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-1 mt-0.5">
                  {event.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {event.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Teammates Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Campus Teammates
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('teammates')}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {profiles
              .filter((p) => p.status === 'approved' && p.id !== currentUser?.id)
              .slice(0, 3)
              .map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div
                    onClick={() => {
                      setSelectedUserId(person.id);
                      setActiveTab('profile');
                    }}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={person.avatar_url}
                      alt={person.full_name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {person.full_name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {person.skills.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUserId(person.id);
                      setActiveTab('profile');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Popular Communities */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Societies
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('communities')}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold"
            >
              Browse
            </button>
          </div>

          <div className="space-y-2">
            {communities.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveTab('communities')}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={c.avatar_url}
                    alt={c.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                    {c.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {c.members_count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

