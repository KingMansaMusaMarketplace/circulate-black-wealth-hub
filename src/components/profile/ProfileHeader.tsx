
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const ProfileHeader = () => {
  const { user, userType } = useAuth();
  
  // Get the first letter of email or name for avatar fallback
  const getInitial = () => {
    if (!user) return '?';
    
    if (user.user_metadata?.fullName) {
      return user.user_metadata.fullName.charAt(0).toUpperCase();
    }
    
    return user.email?.charAt(0).toUpperCase() || '?';
  };

  return (
    <Card className="mb-2">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatarUrl || ''} alt="Profile" />
            <AvatarFallback className="text-lg">{getInitial()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl text-white">
              {user?.user_metadata?.fullName || user?.email}
            </CardTitle>
            <CardDescription className="text-white/70">
              {userType && `${userType.charAt(0).toUpperCase()}${userType.slice(1)} Account`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-sm text-white/80">
          <p>Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          <p>Email: {user?.email || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
