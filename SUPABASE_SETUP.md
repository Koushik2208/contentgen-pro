# Supabase Authentication Setup

This project is now configured with Supabase authentication. Follow these steps to complete the setup:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: `contentgen-pro` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest region to your users

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## 3. Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from step 2.

## 4. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Set to: `http://localhost:5173` (for development)
- For production, set to your domain: `https://yourdomain.com`

### Redirect URLs
Add these URLs to the "Redirect URLs" list:
- `http://localhost:5173/**` (for development)
- `https://yourdomain.com/**` (for production)

### Email Settings
1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your email provider (or use Supabase's default for testing)
3. Customize email templates if needed

## 5. Database Schema (Optional)

If you want to store additional user data, you can create tables in the **Table Editor**:

```sql
-- Example: User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 6. Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Click "Get Started" to test signup
4. Click "Sign In" to test login
5. Try accessing protected routes like `/dashboard`

## Features Included

✅ **Complete Authentication System**
- User registration with email verification
- User login/logout
- Protected routes
- Authentication context for state management
- Beautiful UI components for auth flows

✅ **Security Features**
- Email verification for new accounts
- Password reset functionality
- Row Level Security (RLS) ready
- Secure session management

✅ **User Experience**
- Modal-based authentication
- Loading states and error handling
- Responsive design
- Smooth transitions and animations

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env.local` file exists and has the correct variable names
   - Restart your development server after adding environment variables

2. **Authentication not working**
   - Check that your Supabase URL and anon key are correct
   - Verify that your site URL is set correctly in Supabase settings
   - Check the browser console for any error messages

3. **Email verification not working**
   - Check your email settings in Supabase
   - Make sure redirect URLs are configured correctly
   - Check spam folder for verification emails

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the authentication logs in your Supabase dashboard

## Next Steps

1. Customize the authentication UI to match your brand
2. Add user profile management
3. Implement role-based access control
4. Add social authentication (Google, GitHub, etc.)
5. Set up email templates and branding
