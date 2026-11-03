const API_BASE = '/api';

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', stack: 'MERN fallback' };
  }
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function registerApiUser(userData: any) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function updateApiUser(userId: string, data: any) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
}

export async function createApiPost(postData: any) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return res.json();
}

export async function deleteApiPost(postId: string) {
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function toggleLikeApiPost(postId: string, userId: string) {
  const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function addApiComment(postId: string, userId: string, content: string) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, content }),
  });
  return res.json();
}

export async function fetchNotes() {
  const res = await fetch(`${API_BASE}/notes`);
  return res.json();
}

export async function createApiNote(noteData: any) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  return res.json();
}

export async function downloadApiNote(noteId: string) {
  const res = await fetch(`${API_BASE}/notes/${noteId}/download`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchCommunities() {
  const res = await fetch(`${API_BASE}/communities`);
  return res.json();
}

export async function createApiCommunity(commData: any) {
  const res = await fetch(`${API_BASE}/communities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commData),
  });
  return res.json();
}

export async function toggleJoinApiCommunity(communityId: string, userId: string) {
  const res = await fetch(`${API_BASE}/communities/${communityId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/events`);
  return res.json();
}

export async function createApiEvent(eventData: any) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  return res.json();
}

export async function toggleRegisterApiEvent(eventId: string, userId: string) {
  const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function fetchMessages() {
  const res = await fetch(`${API_BASE}/messages`);
  return res.json();
}

export async function sendApiMessage(sender_id: string, receiver_id: string, content: string) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id, receiver_id, content }),
  });
  return res.json();
}

export async function fetchConnections() {
  const res = await fetch(`${API_BASE}/connections`);
  return res.json();
}

export async function sendApiConnection(sender_id: string, receiver_id: string) {
  const res = await fetch(`${API_BASE}/connections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id, receiver_id }),
  });
  return res.json();
}

export async function respondApiConnection(requestId: string, status: 'accepted' | 'rejected') {
  const res = await fetch(`${API_BASE}/connections/${requestId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function approveApiUser(userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/approve`, {
    method: 'PUT',
  });
  return res.json();
}

export async function rejectApiUser(userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/reject`, {
    method: 'PUT',
  });
  return res.json();
}

export async function verifyApiUser(userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/verify`, {
    method: 'PUT',
  });
  return res.json();
}

