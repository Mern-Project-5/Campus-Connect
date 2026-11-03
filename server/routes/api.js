import express from 'express';
import { store } from '../data/store.js';
import { isConnectedToMongo } from '../config/db.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Note } from '../models/Note.js';
import { Community } from '../models/Community.js';
import { Event } from '../models/Event.js';
import { Message } from '../models/Message.js';
import { FriendRequest } from '../models/FriendRequest.js';

const router = express.Router();

// --- Health Check ---
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    mongoConnected: isConnectedToMongo,
    engine: isConnectedToMongo ? 'Mongoose Live MongoDB' : 'MongoDB Document Store Engine',
    uptime: process.uptime(),
  });
});

// --- Auth & Users ---
router.post('/auth/register', async (req, res) => {
  const data = req.body;
  const newUser = {
    _id: `user-${Date.now()}`,
    id: `user-${Date.now()}`,
    phone: data.phone || '+91 98000 00000',
    full_name: data.full_name,
    username: data.username || `user_${Date.now().toString().slice(-4)}`,
    avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username || Date.now()}`,
    account_type: data.account_type || 'student',
    role: 'student',
    status: 'pending', // Gated approval flow
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

  store.users.unshift(newUser);
  res.status(201).json({ success: true, user: newUser });
});

router.post('/auth/login', (req, res) => {
  const { userId } = req.body;
  const user = store.users.find((u) => u.id === userId || u._id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, user });
});

router.get('/users', (req, res) => {
  res.json(store.users);
});

router.get('/users/:id', (req, res) => {
  const user = store.users.find((u) => u.id === req.params.id || u._id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/users/:id', (req, res) => {
  const userIndex = store.users.findIndex(
    (u) => u.id === req.params.id || u._id === req.params.id
  );
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  store.users[userIndex] = { ...store.users[userIndex], ...req.body };
  res.json(store.users[userIndex]);
});

// --- Posts ---
router.get('/posts', (req, res) => {
  res.json(store.posts);
});

router.post('/posts', (req, res) => {
  const { user_id, content, post_type, tags, media_url, media_type, attachment_name, attachment_size, community_id } = req.body;
  const author = store.users.find((u) => u.id === user_id || u._id === user_id);
  const comm = store.communities.find((c) => c.id === community_id);

  const newPost = {
    _id: `post-${Date.now()}`,
    id: `post-${Date.now()}`,
    user_id,
    author: author ? {
      id: author.id,
      full_name: author.full_name,
      username: author.username,
      avatar_url: author.avatar_url,
      department: author.department,
      account_type: author.account_type,
      role: author.role,
      is_verified: author.is_verified,
    } : null,
    content,
    post_type: post_type || 'regular',
    media_url,
    media_type,
    attachment_name,
    attachment_size,
    tags: tags || [],
    community_id,
    community_name: comm ? comm.name : undefined,
    likes: [],
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
  };

  store.posts.unshift(newPost);
  res.status(201).json(newPost);
});

router.delete('/posts/:id', (req, res) => {
  const idx = store.posts.findIndex((p) => p.id === req.params.id || p._id === req.params.id);
  if (idx !== -1) {
    store.posts.splice(idx, 1);
  }
  res.json({ success: true });
});

router.post('/posts/:id/like', (req, res) => {
  const { userId } = req.body;
  const post = store.posts.find((p) => p.id === req.params.id || p._id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (!post.likes) post.likes = [];
  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id !== userId);
    post.likes_count = Math.max(0, post.likes_count - 1);
  } else {
    post.likes.push(userId);
    post.likes_count += 1;
  }

  res.json({ success: true, post, hasLiked: !alreadyLiked });
});

router.get('/posts/:id/comments', (req, res) => {
  const comments = store.comments.filter((c) => c.post_id === req.params.id);
  res.json(comments);
});

router.post('/posts/:id/comment', (req, res) => {
  const { userId, content } = req.body;
  const author = store.users.find((u) => u.id === userId || u._id === userId);
  const post = store.posts.find((p) => p.id === req.params.id || p._id === req.params.id);

  if (!post) return res.status(404).json({ error: 'Post not found' });

  const newComment = {
    _id: `comm-${Date.now()}`,
    id: `comm-${Date.now()}`,
    post_id: req.params.id,
    user_id: userId,
    author: author ? {
      id: author.id,
      full_name: author.full_name,
      username: author.username,
      avatar_url: author.avatar_url,
    } : null,
    content,
    created_at: new Date().toISOString(),
  };

  store.comments.push(newComment);
  post.comments_count = (post.comments_count || 0) + 1;

  res.status(201).json(newComment);
});

// --- Study Notes ---
router.get('/notes', (req, res) => {
  res.json(store.notes);
});

router.post('/notes', (req, res) => {
  const { user_id, title, subject, department, year, description, file_name, file_size } = req.body;
  const author = store.users.find((u) => u.id === user_id || u._id === user_id);

  const newNote = {
    _id: `note-${Date.now()}`,
    id: `note-${Date.now()}`,
    user_id,
    author: author ? {
      id: author.id,
      full_name: author.full_name,
      username: author.username,
      avatar_url: author.avatar_url,
    } : null,
    title,
    subject,
    department,
    year,
    description,
    file_url: '#',
    file_name: file_name || 'CampusStudyNote.pdf',
    file_size: file_size || '3.5 MB',
    downloads_count: 0,
    created_at: new Date().toISOString(),
  };

  store.notes.unshift(newNote);
  res.status(201).json(newNote);
});

router.post('/notes/:id/download', (req, res) => {
  const note = store.notes.find((n) => n.id === req.params.id || n._id === req.params.id);
  if (note) {
    note.downloads_count = (note.downloads_count || 0) + 1;
    return res.json({ success: true, downloads_count: note.downloads_count });
  }
  res.status(404).json({ error: 'Note not found' });
});

// --- Communities ---
router.get('/communities', (req, res) => {
  res.json(store.communities);
});

router.post('/communities', (req, res) => {
  const { name, category, description, created_by, avatar_url } = req.body;
  const newComm = {
    _id: `comm-${Date.now()}`,
    id: `comm-${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    category,
    description,
    avatar_url: avatar_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250',
    members: [created_by],
    members_count: 1,
    created_by,
    created_at: new Date().toISOString(),
  };

  store.communities.push(newComm);
  res.status(201).json(newComm);
});

router.post('/communities/:id/join', (req, res) => {
  const { userId } = req.body;
  const comm = store.communities.find((c) => c.id === req.params.id || c._id === req.params.id);
  if (!comm) return res.status(404).json({ error: 'Community not found' });

  if (!comm.members) comm.members = [];
  const isMember = comm.members.includes(userId);

  if (isMember) {
    comm.members = comm.members.filter((id) => id !== userId);
    comm.members_count = Math.max(0, comm.members_count - 1);
  } else {
    comm.members.push(userId);
    comm.members_count += 1;
  }

  res.json({ success: true, community: comm, isMember: !isMember });
});

// --- Events ---
router.get('/events', (req, res) => {
  res.json(store.events);
});

router.post('/events', (req, res) => {
  const { title, description, category, date, time, location, is_virtual, banner_url, organizer_id, organizer_name } = req.body;
  const newEvent = {
    _id: `event-${Date.now()}`,
    id: `event-${Date.now()}`,
    title,
    description,
    category,
    date,
    time,
    location,
    is_virtual: Boolean(is_virtual),
    banner_url: banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    organizer_id,
    organizer_name,
    attendees: [organizer_id],
    registered_count: 1,
    created_at: new Date().toISOString(),
  };

  store.events.push(newEvent);
  res.status(201).json(newEvent);
});

router.post('/events/:id/register', (req, res) => {
  const { userId } = req.body;
  const event = store.events.find((e) => e.id === req.params.id || e._id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  if (!event.attendees) event.attendees = [];
  const isRegistered = event.attendees.includes(userId);

  if (isRegistered) {
    event.attendees = event.attendees.filter((id) => id !== userId);
    event.registered_count = Math.max(0, event.registered_count - 1);
  } else {
    event.attendees.push(userId);
    event.registered_count += 1;
  }

  res.json({ success: true, event, isRegistered: !isRegistered });
});

// --- Messages ---
router.get('/messages', (req, res) => {
  res.json(store.messages);
});

router.post('/messages', (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  const newMsg = {
    _id: `msg-${Date.now()}`,
    id: `msg-${Date.now()}`,
    sender_id,
    receiver_id,
    content,
    created_at: new Date().toISOString(),
    read: false,
  };

  store.messages.push(newMsg);
  res.status(201).json(newMsg);
});

// --- Connections / Friend Requests ---
router.get('/connections', (req, res) => {
  res.json(store.friendRequests);
});

router.post('/connections', (req, res) => {
  const { sender_id, receiver_id } = req.body;
  const existing = store.friendRequests.find(
    (fr) =>
      (fr.sender_id === sender_id && fr.receiver_id === receiver_id) ||
      (fr.sender_id === receiver_id && fr.receiver_id === sender_id)
  );

  if (existing) {
    return res.json({ success: true, request: existing });
  }

  const newReq = {
    _id: `fr-${Date.now()}`,
    id: `fr-${Date.now()}`,
    sender_id,
    receiver_id,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  store.friendRequests.push(newReq);
  res.status(201).json(newReq);
});

router.put('/connections/:id', (req, res) => {
  const { status } = req.body;
  const reqItem = store.friendRequests.find((fr) => fr.id === req.params.id || fr._id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  reqItem.status = status;
  res.json({ success: true, request: reqItem });
});

// --- Super Admin Actions ---
router.get('/admin/stats', (req, res) => {
  const stats = {
    totalUsers: store.users.length,
    pendingApprovals: store.users.filter((u) => u.status === 'pending').length,
    approvedStudents: store.users.filter((u) => u.status === 'approved' && u.account_type === 'student').length,
    approvedProfessionals: store.users.filter((u) => u.status === 'approved' && u.account_type === 'professional').length,
    totalPosts: store.posts.length,
    totalNotes: store.notes.length,
    totalCommunities: store.communities.length,
    totalEvents: store.events.length,
  };
  res.json(stats);
});

router.put('/admin/users/:id/approve', (req, res) => {
  const user = store.users.find((u) => u.id === req.params.id || u._id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = 'approved';
  user.is_verified = true;
  res.json({ success: true, user });
});

router.put('/admin/users/:id/reject', (req, res) => {
  const user = store.users.find((u) => u.id === req.params.id || u._id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = 'rejected';
  res.json({ success: true, user });
});

router.put('/admin/users/:id/verify', (req, res) => {
  const user = store.users.find((u) => u.id === req.params.id || u._id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.is_verified = !user.is_verified;
  res.json({ success: true, user });
});

export default router;

