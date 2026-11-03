import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  Post,
  PostComment,
  StudyNote,
  Community,
  Event,
  Message,
  FriendRequest,
  PlatformStats,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_STUDY_NOTES,
  INITIAL_COMMUNITIES,
  INITIAL_EVENTS,
  INITIAL_MESSAGES,
  INITIAL_FRIEND_REQUESTS,
} from '../lib/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import * as api from '../lib/api';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CampusContextType {
  currentUser: Profile | null;
  profiles: Profile[];
  posts: Post[];
  comments: PostComment[];
  notes: StudyNote[];
  communities: Community[];
  events: Event[];
  messages: Message[];
  friendRequests: FriendRequest[];
  stats: PlatformStats;
  isDemoMode: boolean;
  isDarkMode: boolean;
  toasts: ToastItem[];
  activeTab: string;
  selectedUserId: string | null;
  selectedCommunityId: string | null;
  searchQuery: string;

  // Setters & Navigation
  setActiveTab: (tab: string) => void;
  setSelectedUserId: (userId: string | null) => void;
  setSelectedCommunityId: (communityId: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Auth & Admin Actions
  loginAs: (userId: string) => void;
  registerUser: (data: Partial<Profile>) => Promise<Profile>;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  toggleUserVerified: (userId: string) => void;
  updateProfile: (data: Partial<Profile>) => void;

  // Social & Content Actions
  createPost: (data: {
    content: string;
    post_type: Post['post_type'];
    tags: string[];
    media_url?: string;
    media_type?: 'image' | 'pdf' | 'document';
    attachment_name?: string;
    attachment_size?: string;
    community_id?: string;
  }) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;

  // Study Notes
  uploadNote: (data: {
    title: string;
    subject: string;
    department: string;
    year: string;
    description: string;
    file_name: string;
    file_size: string;
  }) => void;
  downloadNote: (noteId: string) => void;

  // Communities & Events
  toggleJoinCommunity: (communityId: string) => void;
  createCommunity: (data: {
    name: string;
    category: Community['category'];
    description: string;
    avatar_url?: string;
  }) => void;
  toggleRegisterEvent: (eventId: string) => void;
  createEvent: (data: {
    title: string;
    description: string;
    category: string;
    date: string;
    time: string;
    location: string;
    is_virtual: boolean;
    banner_url?: string;
  }) => void;

  // Connections & Messaging
  sendFriendRequest: (receiverId: string) => void;
  respondFriendRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
  sendMessage: (receiverId: string, content: string) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'campusconnect_v1_';

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}dark_mode`);
    return saved ? JSON.parse(saved) : true; // Default dark mode for modern high-tech feel
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Core Data States with localStorage persistence
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}profiles`);
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  // Default logged in user: Aarav Sharma (Approved Student)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user_id`);
    return saved || 'user-student-1';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}posts`);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [comments, setComments] = useState<PostComment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}comments`);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}notes`);
    return saved ? JSON.parse(saved) : INITIAL_STUDY_NOTES;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}communities`);
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}friend_requests`);
    return saved ? JSON.parse(saved) : INITIAL_FRIEND_REQUESTS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}dark_mode`, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}profiles`, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user_id`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}posts`, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}comments`, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}notes`, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}communities`, JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}friend_requests`, JSON.stringify(friendRequests));
  }, [friendRequests]);

  // Derived current user
  const currentUser = profiles.find((p) => p.id === currentUserId) || null;

  // Platform statistics
  const stats: PlatformStats = {
    totalUsers: profiles.length,
    pendingApprovals: profiles.filter((p) => p.status === 'pending').length,
    approvedStudents: profiles.filter((p) => p.status === 'approved' && p.account_type === 'student').length,
    approvedProfessionals: profiles.filter((p) => p.status === 'approved' && p.account_type === 'professional').length,
    totalPosts: posts.length,
    totalNotes: notes.length,
    totalCommunities: communities.length,
    totalEvents: events.length,
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Auth actions
  const loginAs = (userId: string) => {
    const target = profiles.find((p) => p.id === userId);
    if (target) {
      setCurrentUserId(userId);
      showToast(`Switched account to ${target.full_name} (${target.role === 'admin' ? 'Super Admin' : target.status})`, 'info');
    }
  };

  const logout = () => {
    setCurrentUserId('');
    showToast('Signed out successfully.', 'info');
  };

  const registerUser = async (data: Partial<Profile>): Promise<Profile> => {
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      phone: data.phone || '+91 98000 00000',
      full_name: data.full_name || 'New Campus Member',
      username: data.username || `user_${Date.now().toString().slice(-4)}`,
      avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username || Date.now()}`,
      account_type: data.account_type || 'student',
      role: 'student',
      status: 'pending', // Registration mandates pending approval by super admin
      department: data.department || 'Computer Science & Engineering',
      branch: data.branch || 'Undergraduate',
      academic_year: data.academic_year || '1st Year',
      graduation_year: data.graduation_year || '2028',
      company_or_institution: data.company_or_institution || 'CampusTech University',
      designation: data.designation || (data.account_type === 'student' ? 'Student' : 'Professional'),
      bio: data.bio || 'New member of CampusConnect.',
      skills: data.skills || ['Communication', 'Teamwork'],
      interests: data.interests || ['Technology', 'Academics'],
      projects: [],
      achievements: [],
      linkedin_url: data.linkedin_url || '',
      github_url: data.github_url || '',
      instagram_url: data.instagram_url || '',
      is_verified: false,
      created_at: new Date().toISOString(),
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setCurrentUserId(newProfile.id);
    api.registerApiUser(newProfile).catch(() => {});
    showToast('Registration submitted! Account is pending Super Admin approval.', 'success');
    return newProfile;
  };

  const approveUser = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, status: 'approved', is_verified: true } : p))
    );
    api.approveApiUser(userId).catch(() => {});
    showToast('User account successfully approved.', 'success');
  };

  const rejectUser = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, status: 'rejected' } : p))
    );
    api.rejectApiUser(userId).catch(() => {});
    showToast('User account rejected.', 'error');
  };

  const toggleUserVerified = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, is_verified: !p.is_verified } : p))
    );
    api.verifyApiUser(userId).catch(() => {});
    showToast('Verification status updated.', 'info');
  };

  const updateProfile = (data: Partial<Profile>) => {
    if (!currentUser) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === currentUser.id ? { ...p, ...data } : p))
    );
    api.updateApiUser(currentUser.id, data).catch(() => {});
    showToast('Profile updated successfully!', 'success');
  };

  // Content actions
  const createPost = (data: {
    content: string;
    post_type: Post['post_type'];
    tags: string[];
    media_url?: string;
    media_type?: 'image' | 'pdf' | 'document';
    attachment_name?: string;
    attachment_size?: string;
    community_id?: string;
  }) => {
    if (!currentUser) return;
    const comm = communities.find((c) => c.id === data.community_id);
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user_id: currentUser.id,
      author: currentUser,
      content: data.content,
      post_type: data.post_type,
      tags: data.tags,
      media_url: data.media_url,
      media_type: data.media_type,
      attachment_name: data.attachment_name,
      attachment_size: data.attachment_size,
      community_id: data.community_id,
      community_name: comm ? comm.name : undefined,
      likes_count: 0,
      comments_count: 0,
      has_liked: false,
      created_at: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    api.createApiPost(newPost).catch(() => {});
    showToast('Post published to campus feed!', 'success');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    api.deleteApiPost(postId).catch(() => {});
    showToast('Post deleted.', 'info');
  };

  const toggleLikePost = (postId: string) => {
    if (currentUser) {
      api.toggleLikeApiPost(postId, currentUser.id).catch(() => {});
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.has_liked;
          return {
            ...p,
            has_liked: hasLiked,
            likes_count: hasLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1),
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      post_id: postId,
      user_id: currentUser.id,
      author: currentUser,
      content,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
    );
    api.addApiComment(postId, currentUser.id, content).catch(() => {});
    showToast('Comment posted.', 'success');
  };

  // Study notes
  const uploadNote = (data: {
    title: string;
    subject: string;
    department: string;
    year: string;
    description: string;
    file_name: string;
    file_size: string;
  }) => {
    if (!currentUser) return;
    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      user_id: currentUser.id,
      author: currentUser,
      title: data.title,
      subject: data.subject,
      department: data.department,
      year: data.year,
      description: data.description,
      file_url: '#',
      file_name: data.file_name,
      file_size: data.file_size,
      downloads_count: 0,
      created_at: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    api.createApiNote(newNote).catch(() => {});
    showToast('Study notes uploaded and shared with your peers!', 'success');
  };

  const downloadNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, downloads_count: n.downloads_count + 1 } : n))
    );
    api.downloadApiNote(noteId).catch(() => {});
    showToast('Downloading note PDF preview...', 'info');
  };

  // Communities & Events
  const toggleJoinCommunity = (communityId: string) => {
    if (currentUser) {
      api.toggleJoinApiCommunity(communityId, currentUser.id).catch(() => {});
    }
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const isMember = !c.is_member;
          return {
            ...c,
            is_member: isMember,
            members_count: isMember ? c.members_count + 1 : Math.max(0, c.members_count - 1),
          };
        }
        return c;
      })
    );
  };

  const createCommunity = (data: {
    name: string;
    category: Community['category'];
    description: string;
    avatar_url?: string;
  }) => {
    if (!currentUser) return;
    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      category: data.category,
      description: data.description,
      avatar_url:
        data.avatar_url ||
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250',
      members_count: 1,
      is_member: true,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
    };

    setCommunities((prev) => [newComm, ...prev]);
    api.createApiCommunity(newComm).catch(() => {});
    showToast(`Community "${data.name}" created!`, 'success');
  };

  const toggleRegisterEvent = (eventId: string) => {
    if (currentUser) {
      api.toggleRegisterApiEvent(eventId, currentUser.id).catch(() => {});
    }
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const registered = !e.is_registered;
          return {
            ...e,
            is_registered: registered,
            registered_count: registered ? e.registered_count + 1 : Math.max(0, e.registered_count - 1),
          };
        }
        return e;
      })
    );
    showToast('Event registration updated.', 'success');
  };

  const createEvent = (data: {
    title: string;
    description: string;
    category: string;
    date: string;
    time: string;
    location: string;
    is_virtual: boolean;
    banner_url?: string;
  }) => {
    if (!currentUser) return;
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      time: data.time,
      location: data.location,
      is_virtual: data.is_virtual,
      banner_url:
        data.banner_url ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      organizer_id: currentUser.id,
      organizer_name: currentUser.full_name,
      registered_count: 1,
      is_registered: true,
      created_at: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);
    api.createApiEvent(newEvent).catch(() => {});
    showToast(`Event "${data.title}" published!`, 'success');
  };

  // Connections
  const sendFriendRequest = (receiverId: string) => {
    if (!currentUser) return;
    const existing = friendRequests.find(
      (fr) =>
        (fr.sender_id === currentUser.id && fr.receiver_id === receiverId) ||
        (fr.sender_id === receiverId && fr.receiver_id === currentUser.id)
    );

    if (existing) {
      if (existing.status === 'accepted') {
        showToast('You are already connected with this member.', 'info');
      } else {
        showToast('Connection request already pending.', 'info');
      }
      return;
    }

    const newReq: FriendRequest = {
      id: `fr-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setFriendRequests((prev) => [...prev, newReq]);
    api.sendApiConnection(currentUser.id, receiverId).catch(() => {});
    showToast('Connection request sent!', 'success');
  };

  const respondFriendRequest = (requestId: string, status: 'accepted' | 'rejected') => {
    setFriendRequests((prev) =>
      prev.map((fr) => (fr.id === requestId ? { ...fr, status } : fr))
    );
    api.respondApiConnection(requestId, status).catch(() => {});
    showToast(status === 'accepted' ? 'Connection request accepted!' : 'Connection request declined.', 'info');
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    api.sendApiMessage(currentUser.id, receiverId, content.trim()).catch(() => {});
  };

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        profiles,
        posts,
        comments,
        notes,
        communities,
        events,
        messages,
        friendRequests,
        stats,
        isDemoMode: !isSupabaseConfigured,
        isDarkMode,
        toasts,
        activeTab,
        selectedUserId,
        selectedCommunityId,
        searchQuery,
        setActiveTab,
        setSelectedUserId,
        setSelectedCommunityId,
        setSearchQuery,
        toggleDarkMode,
        showToast,
        removeToast,
        loginAs,
        registerUser,
        logout,
        approveUser,
        rejectUser,
        toggleUserVerified,
        updateProfile,
        createPost,
        deletePost,
        toggleLikePost,
        addComment,
        uploadNote,
        downloadNote,
        toggleJoinCommunity,
        createCommunity,
        toggleRegisterEvent,
        createEvent,
        sendFriendRequest,
        respondFriendRequest,
        sendMessage,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
