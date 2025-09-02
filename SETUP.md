# StakeShare Authentication Setup Guide

## 🚀 **Quick Start**

This guide will help you set up authentication for StakeShare using Supabase and Google OAuth.

## 📋 **Prerequisites**

- Node.js 18+ installed
- A Supabase account
- A Google Cloud Console account (for OAuth)

## 🔧 **Step 1: Supabase Setup**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `stakeshare-app`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Get Project Credentials
1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 1.3 Enable Google OAuth
1. Go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Go to [Google Cloud Console](https://console.cloud.google.com/)
4. Create a new project or select existing one
5. Enable **Google+ API**
6. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
7. Configure OAuth consent screen:
   - **User Type**: External
   - **App name**: StakeShare
   - **User support email**: Your email
   - **Developer contact information**: Your email
8. Create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Name**: StakeShare Web Client
   - **Authorized redirect URIs**: 
     - `https://your-project.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth-callback` (for development)
9. Copy the **Client ID** and **Client Secret**
10. Back in Supabase, paste these values and save

## 🔑 **Step 2: Environment Variables**

### 2.1 Create .env.local file
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 2.2 For Production (Vercel)
Add these environment variables in your Vercel project settings.

## 🗄️ **Step 3: Database Schema**

### 3.1 Create Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('founder', 'creator')) DEFAULT 'founder',
  preferred_dashboard TEXT DEFAULT 'founder',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  industry TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creators table
CREATE TABLE public.creators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  primary_platform TEXT,
  follower_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs table
CREATE TABLE public.programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES public.companies(id),
  status TEXT DEFAULT 'draft',
  equity_percentage DECIMAL(5,2),
  max_creators INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  creator_id UUID REFERENCES public.creators(id),
  status TEXT DEFAULT 'applied',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Companies are viewable by owner" ON public.companies
  FOR SELECT USING (created_by = (SELECT email FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "Companies can be created by authenticated users" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Creators are viewable by owner" ON public.creators
  FOR SELECT USING (email = (SELECT email FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "Programs are viewable by company owner" ON public.programs
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM public.companies 
      WHERE created_by = (SELECT email FROM public.user_profiles WHERE id = auth.uid())
    )
  );
```

## 🚀 **Step 4: Test Authentication**

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Test Login Flow
1. Go to `http://localhost:5173/home`
2. Click "Founder Login" or "Creator Login"
3. You should be redirected to Google OAuth
4. After authentication, you'll be redirected back to the appropriate dashboard

## 🌐 **Step 5: Deploy to Vercel**

### 5.1 Build and Deploy
```bash
npm run build
```

### 5.2 Vercel Configuration
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

## 🔍 **Troubleshooting**

### Common Issues:

1. **"Invalid redirect URI" error**
   - Check that your redirect URI in Google Cloud Console matches exactly
   - Include both development and production URLs

2. **"Supabase client not initialized"**
   - Verify your environment variables are set correctly
   - Check that `.env.local` is in your project root

3. **Authentication callback not working**
   - Ensure the `AuthCallback` route is properly configured
   - Check browser console for errors

4. **User role not persisting**
   - Verify localStorage is working
   - Check that the role is being set during auth callback

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 🆘 **Need Help?**

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure database tables and policies are created
4. Check Supabase logs for authentication errors
