import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Trophy, History, MapPin, Star, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DiscoveryPreferences } from '@/components/user/DiscoveryPreferences';
import { NotificationSettings } from '@/components/user/NotificationSettings';
import { FoundingMemberBadge } from '@/components/badges/FoundingMemberBadge';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
  is_founding_member?: boolean;
  founding_member_since?: string;
}

interface UserStats {
  total_points: number;
  total_scans: number;
  businesses_visited: number;
  rewards_redeemed: number;
}

export default function UserProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total_points: 0,
    total_scans: 0,
    businesses_visited: 0,
    rewards_redeemed: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      fetchUserProfile();
      fetchUserStats();
    } else {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('points_earned')
        .eq('customer_id', user?.id);

      const { data: scans } = await supabase
        .from('qr_scans')
        .select('id, business_id')
        .eq('customer_id', user?.id);

      const { data: rewards } = await supabase
        .from('redeemed_rewards')
        .select('id')
        .eq('customer_id', user?.id);

      const totalPoints = transactions?.reduce((sum, t) => sum + t.points_earned, 0) || 0;
      const uniqueBusinesses = new Set(scans?.map(s => s.business_id)).size;

      setUserStats({
        total_points: totalPoints,
        total_scans: scans?.length || 0,
        businesses_visited: uniqueBusinesses,
        rewards_redeemed: rewards?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<UserProfile>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-white/5 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-32 bg-white/5 rounded-xl"></div>
                <div className="h-32 bg-white/5 rounded-xl"></div>
                <div className="h-32 bg-white/5 rounded-xl"></div>
                <div className="h-32 bg-white/5 rounded-xl"></div>
              </div>
              <div className="h-96 bg-white/5 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight mb-4 text-white">Profile Not Found</h1>
          <p className="text-slate-400">Unable to load your profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.05), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative animate-fade-in">
            <div className="bg-slate-900/40 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 ring-1 ring-mansagold/40">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl bg-mansagold text-black font-bold">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">{profile.full_name || 'User'}</h1>
                  <p className="text-slate-400 text-lg">{profile.email}</p>
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {profile.is_founding_member && (
                      <FoundingMemberBadge size="md" />
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="bg-mansagold/10 text-mansagold border-mansagold/30 hover:bg-mansagold/20 hover:text-mansagold min-h-[44px] cursor-pointer"
                    >
                      <Link to="/subscription">
                        <Badge className="bg-transparent border-0 text-mansagold pointer-events-none">
                          {profile.subscription_tier}
                        </Badge>
                      </Link>
                    </Button>
                    <Badge className={profile.subscription_status === 'active' 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-white/5 text-slate-300 border border-white/10'
                    }>
                      {profile.subscription_status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="bg-slate-900/40 border-white/10 hover:border-mansagold/40 transition-colors">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-xl mr-3">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 text-mansagold" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white">{userStats.total_points}</p>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">Total Points</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 hover:border-mansagold/40 transition-colors">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-mansablue/15 ring-1 ring-mansablue/40 rounded-xl mr-3">
                  <History className="h-6 w-6 md:h-8 md:w-8 text-blue-300" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white">{userStats.total_scans}</p>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">QR Scans</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 hover:border-mansagold/40 transition-colors">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-emerald-500/10 ring-1 ring-emerald-500/30 rounded-xl mr-3">
                  <MapPin className="h-6 w-6 md:h-8 md:w-8 text-emerald-300" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white">{userStats.businesses_visited}</p>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">Businesses</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 hover:border-mansagold/40 transition-colors">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-xl mr-3">
                  <Star className="h-6 w-6 md:h-8 md:w-8 text-mansagold" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white">{userStats.rewards_redeemed}</p>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">Rewards</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Management */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/40 border border-white/10 p-1 rounded-xl">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Discovery</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-fade-in">
              <Card className="bg-slate-900/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 font-display tracking-tight">
                    <User className="h-5 w-5 text-mansagold" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-slate-300">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                        className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus-visible:ring-mansagold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        value={profile.email || ''}
                        disabled
                        className="bg-slate-900/40 border-white/10 text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                        className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus-visible:ring-mansagold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-slate-300">City</Label>
                      <Input
                        id="city"
                        value={profile.city || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, city: e.target.value} : null)}
                        className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus-visible:ring-mansagold/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-slate-300">State</Label>
                      <Input
                        id="state"
                        value={profile.state || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, state: e.target.value} : null)}
                        className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus-visible:ring-mansagold/40"
                      />
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleUpdateProfile({
                        full_name: profile.full_name,
                        phone: profile.phone,
                        city: profile.city,
                        state: profile.state
                      })}
                      disabled={isSaving}
                      className="bg-mansagold text-black hover:bg-mansagold/90 font-medium"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="animate-fade-in">
              <div className="bg-slate-900/40 border border-white/10 rounded-xl">
                <DiscoveryPreferences />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="animate-fade-in">
              <div className="bg-slate-900/40 border border-white/10 rounded-xl">
                <NotificationSettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
