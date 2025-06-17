import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Check, 
  Copy, 
  DollarSign, 
  Download, 
  LineChart, 
  Share2, 
  Users 
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

const SalesAgentDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data
  const referralCode = "AGENT123";
  const referralStats = {
    totalReferrals: 24,
    pendingReferrals: 3,
    successfulReferrals: 21,
    totalEarnings: 450,
    pendingEarnings: 75,
    businessSignups: 8,
    customerSignups: 16
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard');
  };

  const handleShare = () => {
    // In a real application, this would open a share dialog
    toast.success('Share dialog opened!');
  };

  return (
    <>
      <Helmet>
        <title>Sales Agent Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your referrals and track your commissions" />
      </Helmet>

      <ResponsiveLayout title="Sales Agent Dashboard">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>
                Share this code with potential users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center mb-4">
                <p className="text-sm text-gray-500 mb-1">Your Unique Code</p>
                <p className="text-2xl font-bold tracking-wider text-mansablue">{referralCode}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCopyReferral} 
                  className="flex-1 flex items-center justify-center"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Code
                </Button>
                <Button 
                  onClick={handleShare} 
                  className="flex-1 flex items-center justify-center"
                >
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch pt-0">
              <Link to="/referrals" className="w-full">
                <Button variant="ghost" className="w-full">
                  View Referral Program Details
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Referral Performance</CardTitle>
              <CardDescription>
                Your referral metrics and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Total Referrals</p>
                  <p className="text-xl font-bold">{referralStats.totalReferrals}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="text-xl font-bold">
                    {Math.round((referralStats.successfulReferrals / referralStats.totalReferrals) * 100)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Earnings</p>
                  <p className="text-xl font-bold">${referralStats.totalEarnings}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-xl font-bold">${referralStats.pendingEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Your referral activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">Referral Analytics</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      Track your referral performance and earnings over time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Referral Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Business Signups</span>
                        <div className="flex items-center">
                          <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {referralStats.businessSignups}
                          </Badge>
                          <span className="text-sm text-gray-500">33%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Signups</span>
                        <div className="flex items-center">
                          <Badge variant="secondary" className="mr-2 bg-green-100 text-green-700 hover:bg-green-200">
                            {referralStats.customerSignups}
                          </Badge>
                          <span className="text-sm text-gray-500">67%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Top Performing Locations</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Atlanta, GA</span>
                        <span className="text-sm">8 referrals</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Chicago, IL</span>
                        <span className="text-sm">6 referrals</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Houston, TX</span>
                        <span className="text-sm">5 referrals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
                <CardDescription>
                  Track all your referrals and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          May 18, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Business
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Black Star Bakery
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Completed
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $25.00
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          May 15, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Customer
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          James Wilson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Completed
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $15.00
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          May 10, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Customer
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Maria Johnson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                            Pending
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $15.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Commission Payouts</CardTitle>
                <CardDescription>
                  Track your commission payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Available Balance</p>
                        <p className="text-2xl font-bold">${referralStats.totalEarnings - referralStats.pendingEarnings}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold">${referralStats.pendingEarnings}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-amber-500" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Paid to Date</p>
                        <p className="text-2xl font-bold">$175</p>
                      </div>
                      <Check className="h-8 w-8 text-blue-500" />
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          April 30, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $100.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Direct Deposit
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Paid
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          March 31, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $75.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Direct Deposit
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Paid
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ResponsiveLayout>
    </>
  );
};

export default SalesAgentDashboardPage;
