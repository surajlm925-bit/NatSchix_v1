import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aczuaveodktaklativsb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjenVhdmVvZGt0YWtsYXRpdnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTQ0MjMsImV4cCI6MjA2OTczMDQyM30.q9D0EhsQ5rlq2NWPFwYnUTSOua14Ykl_wrTb5qkuI0A';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);