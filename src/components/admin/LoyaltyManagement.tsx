import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, Users, Gift, TrendingUp, Search, 
  Crown, Star, Diamond, Coins, ArrowUpRight,
  ArrowDownRight, RefreshCw, Download, Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LoyaltyStats {
  totalMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  activeRewards: number;
  bronzeMembers: number;
  silverMembers: number;
  goldMembers: number;
  platinumMembers: number;
}

interface LoyaltyMember {
  id: string;
  email: string;
  full_name: string;
  points_balance: number;
  tier: string;
  total_earned: number;
  total_redeemed: number;
  created_at: string;
}

interface RecentActivity {
  id: string;
  user_email: string;
  activity_type: string;
  points_involved: number;
  created_at: string;
  business_name?: string;
}

const LoyaltyManagement: React.FC = () => {
  const [stats, setStats] = useState<LoyaltyStats>({
    totalMembers: 0,
    totalPointsIssued: 0,
    totalPointsRedeemed: 0,
    activeRewards: 0,
    bronzeMembers: 0,
    silverMembers: 0,
    goldMembers: 0,
    platinumMembers: 0,
  });
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    setLoading(true);
    try {
      // Fetch loyalty points data - join with profiles using customer_id
      const { data: pointsData, error: pointsError } = await supabase
        .from('loyalty_points')
        .select('*, profiles:customer_id(email, full_name)');

      if (pointsError) throw pointsError;

      // Calculate stats by aggregating per user
      const userPointsMap = new Map<string, { 
        points: number; 
        email: string; 
        full_name: string; 
        created_at: string;
      }>();

      pointsData?.forEach((record: any) => {
        const customerId = record.customer_id;
        const existing = userPointsMap.get(customerId);
        
        if (existing) {
          existing.points += record.points || 0;
        } else {
          userPointsMap.set(customerId, {
            points: record.points || 0,
            email: record.profiles?.email || 'Unknown',
            full_name: record.profiles?.full_name || 'Unknown User',
            created_at: record.created_at
          });
        }
      });

      const totalMembers = userPointsMap.size;
      let totalPointsIssued = 0;
      let bronzeMembers = 0;
      let silverMembers = 0;
      let goldMembers = 0;
      let platinumMembers = 0;

      const membersList: LoyaltyMember[] = [];

      userPointsMap.forEach((userData, customerId) => {
        const points = userData.points;
        totalPointsIssued += points;

        // Determine tier based on total points
        let tier = 'Bronze';
        if (points >= 5000) {
          tier = 'Platinum';
          platinumMembers++;
        } else if (points >= 2000) {
          tier = 'Gold';
          goldMembers++;
        } else if (points >= 500) {
          tier = 'Silver';
          silverMembers++;
        } else {
          bronzeMembers++;
        }

        membersList.push({
          id: customerId,
          email: userData.email,
          full_name: userData.full_name,
          points_balance: points,
          tier,
          total_earned: points,
          total_redeemed: 0,
          created_at: userData.created_at,
        });
      });

      // Fetch redemption data
      const { data: redemptionsData } = await supabase
        .from('redeemed_rewards')
        .select('customer_id, points_used');

      let totalPointsRedeemed = 0;
      if (redemptionsData) {
        const redemptionsByUser = new Map<string, number>();
        redemptionsData.forEach((r: any) => {
          const current = redemptionsByUser.get(r.customer_id) || 0;
          redemptionsByUser.set(r.customer_id, current + (r.points_used || 0));
          totalPointsRedeemed += r.points_used || 0;
        });

        // Update members with redemption data
        membersList.forEach(member => {
          const redeemed = redemptionsByUser.get(member.id) || 0;
          member.total_redeemed = redeemed;
          member.points_balance = member.total_earned - redeemed;
        });
      }

      // Fetch rewards count
      const { count: rewardsCount } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*, profiles:user_id(email), businesses(business_name)')
        .in('activity_type', ['points_earned', 'points_redeemed', 'reward_claimed', 'qr_scan'])
        .order('created_at', { ascending: false })
        .limit(20);

      const formattedActivities: RecentActivity[] = (activityData || []).map((a: any) => ({
        id: a.id,
        user_email: a.profiles?.email || 'Unknown',
        activity_type: a.activity_type,
        points_involved: a.points_involved || 0,
        created_at: a.created_at,
        business_name: a.businesses?.business_name,
      }));

      setStats({
        totalMembers,
        totalPointsIssued,
        totalPointsRedeemed,
        activeRewards: rewardsCount || 0,
        bronzeMembers,
        silverMembers,
        goldMembers,
        platinumMembers,
      });
      setMembers(membersList);
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load loyalty data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Diamond className="h-4 w-4 text-cyan-400" />;
      case 'Gold': return <Crown className="h-4 w-4 text-mansagold" />;
      case 'Silver': return <Star className="h-4 w-4 text-slate-300" />;
      default: return <Award className="h-4 w-4 text-amber-600" />;
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Gold': return 'bg-mansagold/20 text-mansagold border-mansagold/30';
      case 'Silver': return 'bg-slate-400/20 text-slate-300 border-slate-400/30';
      default: return 'bg-amber-600/20 text-amber-500 border-amber-600/30';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'points_earned':
      case 'qr_scan':
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'points_redeemed':
      case 'reward_claimed':
        return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      default:
        return <Coins className="h-4 w-4 text-mansagold" />;
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || member.tier.toLowerCase() === tierFilter;
    return matchesSearch && matchesTier;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-mansagold" />
            Loyalty Program Management
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Monitor and manage the coalition loyalty program
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLoyaltyData}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mansagold/20 rounded-lg">
                <Users className="h-5 w-5 text-mansagold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalMembers.toLocaleString()}</p>
                <p className="text-xs text-white/60">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalPointsIssued.toLocaleString()}</p>
                <p className="text-xs text-white/60">Points Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Coins className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalPointsRedeemed.toLocaleString()}</p>
                <p className="text-xs text-white/60">Points Redeemed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Gift className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.activeRewards}</p>
                <p className="text-xs text-white/60">Active Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Tier Distribution</CardTitle>
          <CardDescription className="text-white/60">Members by loyalty tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-amber-900/30 rounded-lg border border-amber-600/30">
              <Award className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-xl font-bold text-white">{stats.bronzeMembers}</p>
                <p className="text-xs text-white/60">Bronze</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-400/30">
              <Star className="h-8 w-8 text-slate-300" />
              <div>
                <p className="text-xl font-bold text-white">{stats.silverMembers}</p>
                <p className="text-xs text-white/60">Silver</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-mansagold/20 rounded-lg border border-mansagold/30">
              <Crown className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-xl font-bold text-white">{stats.goldMembers}</p>
                <p className="text-xs text-white/60">Gold</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-cyan-900/30 rounded-lg border border-cyan-400/30">
              <Diamond className="h-8 w-8 text-cyan-300" />
              <div>
                <p className="text-xl font-bold text-white">{stats.platinumMembers}</p>
                <p className="text-xs text-white/60">Platinum</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Members and Activity */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="bg-white/10 border border-white/10">
          <TabsTrigger value="members" className="data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 text-white">
            Members
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 text-white">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-white text-lg">Loyalty Members</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/40 w-48"
                    />
                  </div>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20">
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-mansagold" />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No loyalty members found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Member</TableHead>
                        <TableHead className="text-white/70">Tier</TableHead>
                        <TableHead className="text-white/70 text-right">Balance</TableHead>
                        <TableHead className="text-white/70 text-right">Earned</TableHead>
                        <TableHead className="text-white/70 text-right">Redeemed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.slice(0, 10).map((member) => (
                        <TableRow key={member.id} className="border-white/10">
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">{member.full_name}</p>
                              <p className="text-xs text-white/50">{member.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getTierBadgeColor(member.tier)} flex items-center gap-1 w-fit`}>
                              {getTierIcon(member.tier)}
                              {member.tier}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-mansagold">
                            {member.points_balance.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-green-400">
                            +{member.total_earned.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-red-400">
                            -{member.total_redeemed.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
              <CardDescription className="text-white/60">Latest loyalty program transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-mansagold" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No recent activity found
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.activity_type)}
                        <div>
                          <p className="text-sm text-white">{activity.user_email}</p>
                          <p className="text-xs text-white/50">
                            {activity.activity_type.replace(/_/g, ' ')}
                            {activity.business_name && ` at ${activity.business_name}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${activity.points_involved >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {activity.points_involved >= 0 ? '+' : ''}{activity.points_involved} pts
                        </p>
                        <p className="text-xs text-white/50">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyManagement;
