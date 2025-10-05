import { supabase } from '@/integrations/supabase/client';

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: 'owner' | 'renter' | 'both';
}

export const signUp = async (data: SignUpData) => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  return { data: authData, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
