
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Share2, Trophy, ChevronRight, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import SocialShareDialog from '@/components/loyalty/SocialShareDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReferralPage = () => {
  const { user } = useAuth();
  const { referralCode, isAgent, referrals, commissions, loading } = useSalesAgent();
  
  const handleCopyReferral = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied to clipboard');
    } else {
      toast.error('No referral code available');
    }
  };
  
  const handleCopyReferralLink = () => {
    if (referralCode) {
      const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard');
    } else {
      toast.error('No referral code available');
    }
  };

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  };
  
  const shareContent = {
    title: 'Join me on Mansa Musa!',
    text: `Use my referral code ${referralCode} to sign up on Mansa Musa and we'll both earn rewards!`,
    customPath: `/signup?ref=${referralCode}`
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse h-8 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8 max-w-5xl">
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Sign in to access your referral program</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Join our referral program to earn rewards when you invite friends and family to Mansa Musa.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is not an agent yet, show agent application prompt
  if (!isAgent) {
    return (
      <div className="container py-8 max-w-5xl">
        <h1 className="text-3xl font-semibold mb-6">Referral Program</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto text-purple-600 mb-4" />
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Become a Sales Agent to Access Referrals</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Apply to become a sales agent and start earning commissions by referring new businesses and customers.
            </p>
            <Button asChild>
              <Link to="/become-agent">Apply Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-6">My Referral Program</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-4 w-4 mr-2 text-purple-600" /> 
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{referrals?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" /> 
              Earned Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.amount || 0), 0) || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Trophy className="h-4 w-4 mr-2 text-mansagold" /> 
              Pending Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.amount || 0), 0) || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>Share this code with businesses and customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4 text-center">
              <p className="text-3xl font-bold tracking-wider text-mansablue mb-4">{referralCode}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button 
                  variant="outline"
                  onClick={handleCopyReferral}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Code
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleCopyReferralLink}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
                <SocialShareDialog 
                  {...shareContent}
                  triggerContent={
                    <Button>
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Referral Instructions</CardTitle>
            <CardDescription>How to maximize your commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-2 text-purple-600">
                  <span className="block h-5 w-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium">Share your unique referral code</p>
                  <p className="text-sm text-gray-500">Share with businesses and customers who might be interested</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-2 text-purple-600">
                  <span className="block h-5 w-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium">They sign up using your code</p>
                  <p className="text-sm text-gray-500">They'll enter your code during registration</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-2 text-purple-600">
                  <span className="block h-5 w-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium">Earn commissions</p>
                  <p className="text-sm text-gray-500">You'll earn a commission on their subscription</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Referrals</h2>
        <Card>
          {referrals && referrals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.slice(0, 5).map((referral, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(referral.referral_date).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{referral.referred_user_type}</TableCell>
                    <TableCell>{referral.referred_user?.email || "—"}</TableCell>
                    <TableCell className="capitalize">{referral.commission_status}</TableCell>
                    <TableCell>${referral.commission_amount || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Referrals Yet</h3>
              <p className="text-gray-500 mb-4">Start sharing your code to earn commissions</p>
              <SocialShareDialog 
                {...shareContent}
                triggerContent={
                  <Button>
                    <Share2 className="h-4 w-4 mr-2" /> Share Your Code
                  </Button>
                }
              />
            </CardContent>
          )}
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Commissions</h2>
        <Card>
          {commissions && commissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.slice(0, 5).map((commission, index) => (
                  <TableRow key={index}>
                    <TableCell>{commission.due_date ? new Date(commission.due_date).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>${commission.amount}</TableCell>
                    <TableCell className="capitalize">{commission.status}</TableCell>
                    <TableCell>{commission.paid_date ? new Date(commission.paid_date).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{commission.payment_reference || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Commissions Yet</h3>
              <p className="text-gray-500">Your commissions will appear here once they're processed</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
