
import { supabase } from '@/lib/supabase';

export const getCurrentProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { profile: null };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return { error };
    }

    return { profile };
  } catch (error) {
    console.error('Error in getCurrentProfile:', error);
    return { error };
  }
};

export const updateProfile = async (updates: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user found');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { error };
    }

    return { profile: data };
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return { error };
  }
};
