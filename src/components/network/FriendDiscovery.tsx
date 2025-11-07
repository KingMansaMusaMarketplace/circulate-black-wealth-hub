import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { useUserSearch } from '@/hooks/use-user-search';
import { useFriends } from '@/hooks/use-friends';
import { motion } from 'framer-motion';

const FriendDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, loading, searchUsers } = useUserSearch();
  const { friends, pendingRequests, sendFriendRequest } = useFriends();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      searchUsers(query);
    }
  };

  const isFriend = (userId: string) => {
    return friends.some(f => f.friend_id === userId || f.user_id === userId);
  };

  const hasPendingRequest = (userId: string) => {
    return pendingRequests.some(r => r.user_id === userId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Find Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Search Results */}
        {!loading && searchQuery.length >= 2 && (
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No users found</p>
                <p className="text-sm mt-1">Try searching by name or email</p>
              </div>
            ) : (
              searchResults.map((user, index) => {
                const alreadyFriend = isFriend(user.id);
                const pending = hasPendingRequest(user.id);

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    {alreadyFriend ? (
                      <Button size="sm" variant="outline" disabled>
                        Friends
                      </Button>
                    ) : pending ? (
                      <Button size="sm" variant="outline" disabled>
                        Pending
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => sendFriendRequest(user.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Initial State */}
        {!loading && searchQuery.length < 2 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Search for friends to connect</p>
            <p className="text-sm mt-1">Enter at least 2 characters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendDiscovery;
