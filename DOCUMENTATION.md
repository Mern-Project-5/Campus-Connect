# 🎓 CampusConnect — Comprehensive System Documentation

## 1. Project Overview & Objective

**CampusConnect** is a centralized collegiate social and professional networking platform designed exclusively for students, faculty, and alumni belonging to one college or university. It combines the professional networking paradigms of platforms like LinkedIn with student-centric academic collaboration tools like Discord and Piazza.

### Core Objectives:
- **Academic Collaboration:** Peer-to-peer sharing of semester study notes, formula sheets, and past question papers.
- **Project & Hackathon Teammate Matching:** High-precision search filter for multidisciplinary hackathon teams based on verified technical skills.
- **Alumni Mentorship & Placement Readiness:** Verified alumni working across top technology firms conducting resume reviews and sharing off-campus referrals.
- **Trusted Campus Verification:** Strict gated registration where new accounts must be verified and approved by the College Administration (Super Admin) before accessing the platform.

---

## 2. Tech Stack & Architecture (MERN)

The application is architected on the **MERN** stack with TypeScript and modern utility-first styling:

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT 18 FRONTEND                        │
│   Vite • TypeScript • Tailwind CSS • Lucide Icons           │
│   (Runs on http://localhost:5173 with /api proxy)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON REST APIs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS BACKEND                       │
│   Node.js • CORS Middleware • Express Router                │
│   (Runs on http://localhost:5000)                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                         │
│   MongoDB Local Daemon / MongoDB Atlas Cluster              │
│   (mongodb://127.0.0.1:27017/campusconnect)                │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend API:** Express.js, Node.js, CORS, Dotenv.
- **Database & ODM:** MongoDB, Mongoose ODM.
- **Dual Engine Persistence:** Active connection to live MongoDB with an in-memory document store fallback mechanism ensuring zero downtime.

---

## 3. Database Schema & Data Models

All MongoDB collections are defined in `server/models/`:

### 3.1. User Model (`server/models/User.js`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Unique User Identifier |
| `phone` | String (Unique) | Mobile phone number used for registration |
| `full_name` | String | Full name of student or faculty |
| `username` | String (Unique) | Unique campus handle |
| `avatar_url` | String | Profile photo link |
| `cover_url` | String | Header cover banner |
| `account_type` | Enum | `'student'` \| `'professional'` |
| `role` | Enum | `'student'` \| `'professional'` \| `'admin'` |
| `status` | Enum | `'pending'` \| `'approved'` \| `'rejected'` |
| `department` | String | Academic department (e.g., CSE, ECE, AI/ML) |
| `branch` | String | Branch specialization |
| `academic_year` | String | Current year of study (e.g., 3rd Year) |
| `graduation_year` | String | Batch graduation year (e.g., 2026) |
| `company_or_institution` | String | Workplace or University |
| `designation` | String | Current title (e.g., Senior SDE, Student) |
| `bio` | String | Biography / pitch |
| `skills` | [String] | Array of technical competencies |
| `interests` | [String] | Hobbies and research interests |
| `projects` | [ProjectSchema] | Portfolio projects with titles, links, tags |
| `achievements` | [String] | Awards, ranks, and milestones |
| `is_verified` | Boolean | Campus identity badge verification status |

### 3.2. Post Model (`server/models/Post.js`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Post Identifier |
| `user_id` | String | ID of the authoring user |
| `author` | Embedded Object | Author profile snapshot (name, avatar, role) |
| `content` | String | Text content with markdown formatting |
| `post_type` | Enum | `'regular'` \| `'project'` \| `'question'` \| `'achievement'` \| `'notes'` |
| `media_url` | String | Media image or document attachment URL |
| `media_type` | Enum | `'image'` \| `'pdf'` \| `'document'` |
| `attachment_name` | String | File name for downloadable attachments |
| `attachment_size` | String | File size in MB |
| `tags` | [String] | Subject/topic hashtags |
| `community_id` | String | Linked community/society (optional) |
| `likes` | [String] | Array of user IDs who liked the post |
| `likes_count` | Number | Total likes count |
| `comments_count` | Number | Total comments count |

### 3.3. Comment Model (`server/models/Comment.js`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Comment Identifier |
| `post_id` | String | ID of parent post |
| `user_id` | String | Comment author user ID |
| `author` | Embedded Object | Snapshot of commenter profile |
| `content` | String | Comment text |

### 3.4. Note Model (`server/models/Note.js`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Note Identifier |
| `user_id` | String | Uploader user ID |
| `author` | Embedded Object | Uploader profile summary |
| `title` | String | Document title |
| `subject` | String | Course name and code (e.g. CS701) |
| `department` | String | Department |
| `year` | String | Academic year |
| `description` | String | Summary of chapters / concepts covered |
| `file_name` | String | File name |
| `downloads_count` | Number | Download counter |

### 3.5. Community Model (`server/models/Community.js`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Community Identifier |
| `name` | String | Society/Club name |
| `slug` | String (Unique) | URL slug |
| `category` | Enum | `'AI/ML'` \| `'Coding'` \| `'Placements'` \| `'Academics'` \| `'Design'` \| `'Robotics'` |
| `description` | String | Mission and activities |
| `members` | [String] | Array of joined user IDs |
| `members_count` | Number | Active member count |

### 3.6. Event Model (`server/models/Event.js`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Event Identifier |
| `title` | String | Event headline |
| `category` | String | Hackathon, Workshop, Tech Talk, Fest |
| `date` / `time` | String | Schedule details |
| `location` | String | Physical campus hall or virtual link |
| `is_virtual` | Boolean | Online vs Offline flag |
| `attendees` | [String] | Array of registered user IDs |
| `registered_count`| Number | Total RSVP count |

### 3.7. Message & FriendRequest Models
- **`Message.js`**: Private 1-to-1 messages (`sender_id`, `receiver_id`, `content`, `read`, timestamps).
- **`FriendRequest.js`**: Connections (`sender_id`, `receiver_id`, `status: 'pending' | 'accepted' | 'rejected'`).

---

## 4. REST API Reference

The Express.js backend serves all endpoints under `/api`:

### 4.1. System & Authentication
- `GET /api/health` — Checks server uptime and live MongoDB connectivity.
- `POST /api/auth/register` — Registers a user and sets status to `'pending'`.
- `POST /api/auth/login` — Retrieves profile credentials for session.

### 4.2. Users & Profiles
- `GET /api/users` — Returns list of all campus members.
- `GET /api/users/:id` — Fetches specific user profile.
- `PUT /api/users/:id` — Updates user biography, skills, projects, and social links.

### 4.3. Feed & Posts
- `GET /api/posts` — Retrieves chronological feed.
- `POST /api/posts` — Creates a post with tags, post type, and attachments.
- `DELETE /api/posts/:id` — Removes post (restricted to author or Admin).
- `POST /api/posts/:id/like` — Toggles like state for the calling user.
- `GET /api/posts/:id/comments` — Returns all comments for a post.
- `POST /api/posts/:id/comment` — Appends a comment to a post.

### 4.4. Study Notes Repository
- `GET /api/notes` — Retrieves all academic notes with subject and branch metadata.
- `POST /api/notes` — Uploads study note document.
- `POST /api/notes/:id/download` — Increments download metrics.

### 4.5. Communities & Events
- `GET /api/communities` — Returns active campus societies.
- `POST /api/communities` — Creates a new student club.
- `POST /api/communities/:id/join` — Toggles membership for current user.
- `GET /api/events` — Returns upcoming events and hackathons.
- `POST /api/events` — Publishes a new event.
- `POST /api/events/:id/register` — Toggles RSVP attendance.

### 4.6. Messaging & Connections
- `GET /api/messages` — Retrieves user conversation logs.
- `POST /api/messages` — Dispatches a direct message.
- `GET /api/connections` — Retrieves peer connection requests.
- `POST /api/connections` — Sends a connection invite.
- `PUT /api/connections/:id` — Accepts or declines an invite.

### 4.7. Super Admin Operations
- `GET /api/admin/stats` — Platform KPIs (users, pending reviews, notes, posts).
- `PUT /api/admin/users/:id/approve` — Approves pending account and verifies user.
- `PUT /api/admin/users/:id/reject` — Rejects account registration.
- `PUT /api/admin/users/:id/verify` — Toggles verified member checkmark.

---

## 5. Feature Breakdown

### 5.1. Phone + OTP Registration & Gated Approval
1. User enters mobile number (`+91 ...`).
2. OTP verification is entered (simulated with `123456` in Demo Mode or real SMS via Supabase).
3. User completes academic profile (department, branch, graduation year, skills).
4. Account is registered with `status: 'pending'`.
5. The user is gated by `PendingApprovalView` and cannot access the community until approved.
6. The Super Admin reviews the queue in the **Admin Dashboard** and clicks **"Approve User"**.

### 5.2. Study Notes Hub
- Organized repository categorized by department (CSE, ECE, AI/ML, IT).
- Full-text keyword search across subjects and lecture contents.
- Real-time download counter and simulated PDF download preview.

### 5.3. Hackathon Teammate Finder
- Filters peers by specific technology skills (e.g., `ROS2`, `FastAPI`, `PyTorch`, `React`, `Docker`).
- Direct action to connect or launch immediate 1-to-1 chat.

### 5.4. Societies & Events
- Join/Leave clubs across AI/ML, Competitive Programming, Placement Cell, and Robotics.
- RSVP for campus hackathons and tech talks with live registration headcounts.

---

## 6. How to Run Locally

### Prerequisites:
- Node.js (v18 or v22)
- MongoDB (running locally on port 27017 or remote Atlas URI)

### Setup Commands:
```powershell
# 1. Install dependencies
npm install

# 2. Run both Backend Express API and Frontend React Client concurrently:
npm run dev

# 3. Or run them independently:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:5173

# 4. Production Build:
npm run build
```

---

## 7. Demo Guide for Evaluators / Hackathon Judges

When opening **`http://127.0.0.1:5173/`**, look at the top header banner:
1. **Super Admin Persona:** Click **"Super Admin"** to access the restricted administrative console, view platform analytics, and approve pending applicant accounts.
2. **Student Persona:** Click **"Student (Aarav)"** to test creating project posts, downloading study notes, joining societies, and chatting.
3. **Pending Account Persona:** Click **"Pending (Neha)"** to view the live gated **Pending Approval View**.
4. **Register New Account:** Click **"Register New"** to test the complete phone verification and profile setup journey from start to finish.

