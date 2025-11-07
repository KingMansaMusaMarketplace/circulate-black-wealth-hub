import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  accepted_at?: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
    email?: string;
  };
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFriends();
      subscribeToFriendUpdates();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get accepted friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friendships_friend_id_fkey(full_name, avatar_url, email)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;
      setFriends(friendsData || []);

      // Get pending requests (where current user is the receiver)
      const { data: pendingData, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friendships_user_id_fkey(full_name, avatar_url, email)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;
      setPendingRequests(pendingData || []);

    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToFriendUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel('friendships_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `user_id=eq.${user.id},friend_id=eq.${user.id}`
        },
        () => {
          fetchFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Friend request sent!');
      fetchFriends();
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast.error(error.message || 'Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', friendshipId);

      if (error) throw error;
      toast.success('Friend request accepted!');
      fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;
      toast.success('Friend removed');
      fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  return {
    friends,
    pendingRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    refetch: fetchFriends
  };
};
