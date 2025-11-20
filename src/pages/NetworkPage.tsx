import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, ListChecks, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FriendsList from '@/components/network/FriendsList';
import SocialActivityFeed from '@/components/network/SocialActivityFeed';
import FriendDiscovery from '@/components/network/FriendDiscovery';

const NetworkPage = () => {
  return (
    <div className="relative min-h-screen py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Network <span className="bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">& Community</span>
          </h1>
          <p className="text-lg text-white/70">
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
          <div className="p-4 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white/70">Friends</span>
            </div>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white/70">Activities</span>
            </div>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-white/70">Shopping Lists</span>
            </div>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white/70">Combined Impact</span>
            </div>
            <p className="text-2xl font-bold text-white">$0</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/40 backdrop-blur-sm border border-white/10">
              <TabsTrigger value="feed" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Activity Feed</TabsTrigger>
              <TabsTrigger value="friends" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Friends</TabsTrigger>
              <TabsTrigger value="discover" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Discover</TabsTrigger>
              <TabsTrigger value="shopping" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Shopping Lists</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              <SocialActivityFeed />
            </TabsContent>

            <TabsContent value="friends" className="space-y-6">
              <FriendsList />
            </TabsContent>

            <TabsContent value="discover" className="space-y-6">
              <FriendDiscovery />
            </TabsContent>

            <TabsContent value="shopping" className="space-y-6">
              <div className="text-center py-12 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <ListChecks className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <h3 className="text-xl font-semibold mb-2 text-white">Shared Shopping Lists</h3>
                <p className="text-white/70">Coming soon! Plan group shopping trips with friends.</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default NetworkPage;
