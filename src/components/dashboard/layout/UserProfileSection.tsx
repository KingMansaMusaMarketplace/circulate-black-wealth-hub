
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { FoundingMemberBadge } from '@/components/badges/FoundingMemberBadge';

interface UserProfileSectionProps {
  user: User | null;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user }) => {
  const [isFoundingMember, setIsFoundingMember] = useState(false);

  useEffect(() => {
    const checkFoundingMember = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('is_founding_member')
        .eq('id', user.id)
        .single();
      
      if (data?.is_founding_member) {
        setIsFoundingMember(true);
      }
    };

    checkFoundingMember();
  }, [user?.id]);

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium mr-3">
          {user?.email?.[0].toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{user?.email}</p>
          <p className="text-xs text-white/50">Business Account</p>
        </div>
      </div>
      {isFoundingMember && (
        <FoundingMemberBadge size="sm" showTooltip={true} />
      )}
    </div>
  );
};

export default UserProfileSection;
