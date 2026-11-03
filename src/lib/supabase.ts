import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback stub client if Supabase is not configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

/**
 * Send real OTP if Supabase is configured
 */
export async function sendOtp(phone: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, isDemo: true };
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    throw error;
  }
  return { success: true, isDemo: false };
}

/**
 * Verify real OTP if Supabase is configured
 */
export async function verifyOtp(phone: string, token: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, isDemo: true };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    throw error;
  }
  return { data, success: true, isDemo: false };
}

