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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-white/10 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-32 bg-white/10 rounded-xl"></div>
                <div className="h-32 bg-white/10 rounded-xl"></div>
                <div className="h-32 bg-white/10 rounded-xl"></div>
                <div className="h-32 bg-white/10 rounded-xl"></div>
              </div>
              <div className="h-96 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Profile Not Found</h1>
          <p className="text-blue-200/70">Unable to load your profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(234,179,8,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(234,179,8,0.2) 50%, transparent 70%)',
            animation: 'pulse 10s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(30,58,138,0.3) 60%, transparent 80%)',
            animation: 'pulse 6s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Enhanced Header with glass-morphism */}
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-yellow-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex items-center space-x-6 relative z-10">
                <Avatar className="h-24 w-24 border-4 border-yellow-500/30 shadow-2xl">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-slate-900 font-bold">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{profile.full_name || 'User'}</h1>
                  <p className="text-blue-200/80 text-lg">{profile.email}</p>
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm hover:bg-yellow-500/30 min-h-[44px] cursor-pointer"
                    >
                      <Link to="/subscription">
                        <Badge className="bg-transparent border-0 text-yellow-400 pointer-events-none">
                          {profile.subscription_tier}
                        </Badge>
                      </Link>
                    </Button>
                    <Badge className={profile.subscription_status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm' 
                      : 'bg-white/10 text-blue-200 border-white/20 backdrop-blur-sm'
                    }>
                      {profile.subscription_status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards with glass-morphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-yellow-500/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl mr-3">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 text-slate-900" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">{userStats.total_points}</p>
                  <p className="text-xs md:text-sm text-blue-200/70 font-medium">Total Points</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3">
                  <History className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-blue-400">{userStats.total_scans}</p>
                  <p className="text-xs md:text-sm text-blue-200/70 font-medium">QR Scans</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-green-500/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mr-3">
                  <MapPin className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-green-400">{userStats.businesses_visited}</p>
                  <p className="text-xs md:text-sm text-blue-200/70 font-medium">Businesses</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-500/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="flex items-center p-4 md:p-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-3">
                  <Star className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-purple-400">{userStats.rewards_redeemed}</p>
                  <p className="text-xs md:text-sm text-blue-200/70 font-medium">Rewards</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Management with glass-morphism */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Discovery</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-fade-in">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-yellow-400" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-blue-200">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/50 focus:border-yellow-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-200">Email</Label>
                      <Input
                        id="email"
                        value={profile.email || ''}
                        disabled
                        className="bg-white/10 border-white/10 text-blue-200/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-200">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/50 focus:border-yellow-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-blue-200">City</Label>
                      <Input
                        id="city"
                        value={profile.city || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, city: e.target.value} : null)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/50 focus:border-yellow-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-blue-200">State</Label>
                      <Input
                        id="state"
                        value={profile.state || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, state: e.target.value} : null)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/50 focus:border-yellow-500/50"
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
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 hover:from-yellow-400 hover:to-yellow-500 font-semibold"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="animate-fade-in">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                <DiscoveryPreferences />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="animate-fade-in">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                <NotificationSettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
