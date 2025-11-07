import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, ListChecks, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FriendsList from '@/components/network/FriendsList';
import SocialActivityFeed from '@/components/network/SocialActivityFeed';

const NetworkPage = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Network <span className="text-primary">& Community</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with friends and build economic power together
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Friends</span>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Activities</span>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Shopping Lists</span>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Combined Impact</span>
            </div>
            <p className="text-2xl font-bold">$0</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Activity Feed</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="shopping">Shopping Lists</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              <SocialActivityFeed />
            </TabsContent>

            <TabsContent value="friends" className="space-y-6">
              <FriendsList />
            </TabsContent>

            <TabsContent value="shopping" className="space-y-6">
              <div className="text-center py-12 text-muted-foreground">
                <ListChecks className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Shared Shopping Lists</h3>
                <p>Coming soon! Plan group shopping trips with friends.</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default NetworkPage;
