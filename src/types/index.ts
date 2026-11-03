export type UserRole = 'student' | 'professional' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type AccountType = 'student' | 'professional';

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  tags?: string[];
}

export interface Profile {
  id: string;
  phone: string;
  full_name: string;
  username: string;
  avatar_url: string;
  cover_url?: string;
  account_type: AccountType;
  role: UserRole;
  status: UserStatus;
  department: string;
  branch: string;
  academic_year?: string; // e.g. "3rd Year"
  graduation_year: string; // e.g. "2026"
  company_or_institution?: string; // e.g. "Google" or "CampusTech Institute"
  designation?: string; // e.g. "Software Engineer" or "B.Tech Undergrad"
  bio: string;
  skills: string[];
  interests: string[];
  projects: Project[];
  achievements: string[];
  linkedin_url?: string;
  github_url?: string;
  instagram_url?: string;
  is_verified: boolean;
  created_at: string;
}

export type PostType = 'regular' | 'project' | 'question' | 'achievement' | 'notes';

export interface Post {
  id: string;
  user_id: string;
  author: Profile;
  content: string;
  post_type: PostType;
  media_url?: string;
  media_type?: 'image' | 'pdf' | 'document';
  attachment_name?: string;
  attachment_size?: string;
  tags: string[];
  community_id?: string;
  community_name?: string;
  likes_count: number;
  comments_count: number;
  has_liked?: boolean;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  author: Profile;
  content: string;
  created_at: string;
}


export interface StudyNote {
  id: string;
  user_id: string;
  author: Profile;
  title: string;
  subject: string;
  department: string;
  year: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: string;
  downloads_count: number;
  created_at: string;
}

export type CommunityCategory = 'AI/ML' | 'Coding' | 'Placements' | 'Academics' | 'Design' | 'Robotics' | 'Sports';

export interface Community {
  id: string;
  name: string;
  slug: string;
  category: CommunityCategory;
  description: string;
  avatar_url: string;
  banner_url?: string;
  members_count: number;
  is_member?: boolean;
  created_by: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  is_virtual: boolean;
  banner_url?: string;
  organizer_id: string;
  organizer_name: string;
  registered_count: number;
  is_registered?: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender?: Profile;
  receiver?: Profile;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface PlatformStats {
  totalUsers: number;
  pendingApprovals: number;
  approvedStudents: number;
  approvedProfessionals: number;
  totalPosts: number;
  totalNotes: number;
  totalCommunities: number;
  totalEvents: number;
}
