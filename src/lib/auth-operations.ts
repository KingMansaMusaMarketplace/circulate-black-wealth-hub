
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function handleSignOut(
  toastCallback?: (message: string) => void
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toastCallback?.('Error signing out. Please try again.');
      console.error('Sign out error:', error);
      return { success: false, error };
    }
    
    toastCallback?.('You have been signed out successfully');
    
    // Redirect to the login page
    window.location.href = '/login';
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    toastCallback?.('An unexpected error occurred. Please try again.');
    return { success: false, error };
  }
}
