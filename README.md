<<<<<<< HEAD
# CampusConnect 🎓 (MERN Stack Edition)

**CampusConnect** has been migrated and configured to a full **MERN Stack** (MongoDB, Express.js, React, Node.js) platform with Tailwind CSS, TypeScript, and Mongoose schemas.

---

## 🏗️ Architecture & The MERN Stack

- **M — MongoDB & Mongoose**:
  - Live connection to `mongodb://127.0.0.1:27017/campusconnect` (or MongoDB Atlas via `MONGODB_URI`).
  - Mongoose models defined in `server/models/`:
    - `User.js` (phone, role, account_type, status, department, skills, verified badge)
    - `Post.js` (post_type, media, tags, community, likes, comments count)
    - `Comment.js` (one-to-many relationship with posts)
    - `Note.js` (study notes repository with download metrics)
    - `Community.js` (AI/ML, Coding, Placements, Robotics, Design societies)
    - `Event.js` (hackathons, talks, workshops, RSVPs)
    - `Message.js` (one-to-one private messages)
    - `FriendRequest.js` (peer connections with pending/accepted states)
  - Built-in fallback to high-fidelity document store engine so the server never crashes even when MongoDB daemon is starting up or restarting.

- **E — Express.js REST API**:
  - Modular REST router in `server/routes/api.js`:
    - Auth & Profiles: `/api/auth/register`, `/api/auth/login`, `/api/users`, `/api/users/:id`
    - Campus Feed: `/api/posts`, `/api/posts/:id/like`, `/api/posts/:id/comment`
    - Academic Repository: `/api/notes`, `/api/notes/:id/download`
    - Clubs & Events: `/api/communities`, `/api/events`, `/api/events/:id/register`
    - Chat & Networking: `/api/messages`, `/api/connections`
    - Super Admin Console: `/api/admin/stats`, `/api/admin/users/:id/approve`, `/api/admin/users/:id/reject`, `/api/admin/users/:id/verify`

- **R — React Frontend**:
  - React 18 with Vite & TypeScript, Tailwind CSS, and Lucide icons.
  - Proxy configuration in `vite.config.ts`: `/api` automatically routes to Express (`http://127.0.0.1:5000`).

- **N — Node.js Runtime**:
  - Powers the Express backend server and concurrent dev processes.

---

## ⚡ Active Ports & Local URLs

| Service | Port / URL | Description |
|---|---|---|
| **Frontend UI (React + Vite)** | **`http://127.0.0.1:5173/`** | Main Web App |
| **Backend API (Express.js)** | **`http://127.0.0.1:5000/`** | REST API Server |
| **API Health Check** | **`http://127.0.0.1:5000/api/health`** | Stack & MongoDB Status |
| **Database (MongoDB)** | **`mongodb://127.0.0.1:27017/campusconnect`** | Live MongoDB Database |

---

## 💻 Local Run Commands

```powershell
# Run both Frontend (Vite) and Backend (Express) concurrently:
npm run dev

# Or run them in separate terminals:
# Terminal 1 - Express + MongoDB Server:
npm run server

# Terminal 2 - React Client:
npm run client

# Production Build:
npm run build
```

---

## 🔑 Demo & Role Switcher Instructions

Open **`http://127.0.0.1:5173/`** in your browser. The top header banner lets you immediately exercise all roles:
1. **Super Admin (`Dr. Vikram Sen`)**: View platform statistics, approve or reject pending student registrations, and toggle verified member badges.
2. **Student (`Aarav Sharma`)**: Create project posts, upload and download study notes, join student societies, and chat.
3. **Alumni / Working Pro (`Rohan Mehta`)**: Review student portfolios, mentor juniors, and answer technical doubts.
4. **Pending Applicant (`Neha Patel`)**: Experience the gated **Pending Approval Screen**.
5. **Register New**: Complete a phone registration + demo OTP (`123456`) + profile setup to test the full lifecycle into the admin queue.
=======
# Campus-Connect
CampusConnect is a private, university-exclusive social and professional networking platform combining academic collaboration, peer study resources, hackathon teammate matching, and alumni mentorship under a secure, admin-verified ecosystem.
>>>>>>> 84e831142a70fc9e4754dba0599c039ad7b867a0
