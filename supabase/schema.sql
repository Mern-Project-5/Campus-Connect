-- ==============================================================================
-- CampusConnect Supabase PostgreSQL Schema & Security Architecture
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerations & Custom Types
CREATE TYPE user_role AS ENUM ('student', 'professional', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE account_type AS ENUM ('student', 'professional');
CREATE TYPE post_type AS ENUM ('regular', 'project', 'question', 'achievement', 'notes');
CREATE TYPE friend_request_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE community_category AS ENUM ('AI/ML', 'Coding', 'Placements', 'Academics', 'Design', 'Robotics', 'Sports');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    username VARCHAR(60) NOT NULL UNIQUE,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    cover_url TEXT DEFAULT 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    account_type account_type NOT NULL DEFAULT 'student',
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'pending',
    department VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    academic_year VARCHAR(30),
    graduation_year VARCHAR(10) NOT NULL,
    company_or_institution VARCHAR(150),
    designation VARCHAR(100),
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    projects JSONB DEFAULT '[]',
    achievements TEXT[] DEFAULT '{}',
    linkedin_url TEXT,
    github_url TEXT,
    instagram_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMMUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    category community_category NOT NULL,
    description TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMMUNITY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

-- 6. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    post_type post_type NOT NULL DEFAULT 'regular',
    media_url TEXT,
    media_type VARCHAR(20), -- 'image', 'pdf', 'document'
    attachment_name TEXT,
    attachment_size VARCHAR(20),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- 9. STUDY NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(30) NOT NULL,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(60) NOT NULL,
    location VARCHAR(200) NOT NULL,
    is_virtual BOOLEAN DEFAULT FALSE,
    banner_url TEXT,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 12. MESSAGES TABLE (One-to-One Private Chat)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. FRIEND REQUESTS / CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.friend_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status friend_request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

-- 14. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Helper function to check if requesting user is approved super admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if requesting user is approved member
CREATE OR REPLACE FUNCTION public.is_approved()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by approved users"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_approved() OR public.is_admin());

CREATE POLICY "Users can create their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- 2. Posts Policies
CREATE POLICY "Approved users can read posts"
    ON public.posts FOR SELECT
    USING (public.is_approved() OR public.is_admin());

CREATE POLICY "Approved users can insert posts"
    ON public.posts FOR INSERT
    WITH CHECK ((auth.uid() = user_id) AND public.is_approved());

CREATE POLICY "Authors or admin can delete posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 3. Messages Policies (Only sender and receiver can read/write)
CREATE POLICY "Users can read their own messages"
    ON public.messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Approved users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id AND public.is_approved());

-- ==============================================================================
-- INITIAL SUPER ADMIN CREATION SCRIPT
-- ==============================================================================
-- Run this block after signing up with your phone number to promote to Super Admin:
/*
UPDATE public.profiles
SET role = 'admin', status = 'approved', is_verified = TRUE
WHERE phone = '+91 98765 00001';
*/

