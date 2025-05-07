
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatarUrl || ''} alt="Profile" />
            <AvatarFallback className="text-lg">{getInitial()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">
              {user?.user_metadata?.fullName || user?.email}
            </CardTitle>
            <CardDescription>
              {userType && `${userType.charAt(0).toUpperCase()}${userType.slice(1)} Account`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          <p>Email: {user?.email || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
