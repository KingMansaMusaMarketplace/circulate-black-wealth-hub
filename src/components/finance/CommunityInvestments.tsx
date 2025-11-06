import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Building, Users } from 'lucide-react';
import { useCommunityInvestments } from '@/hooks/use-community-finance';
import { Badge } from '@/components/ui/badge';

export const CommunityInvestments: React.FC = () => {
  const { investments, myInvestments, isLoading, invest } = useCommunityInvestments();
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState('');

  const handleInvest = () => {
    if (selectedInvestment && investAmount) {
      invest({
        investmentId: selectedInvestment.id,
        amount: parseFloat(investAmount)
      });
      setSelectedInvestment(null);
      setInvestAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Community Investments</h2>
        <p className="text-muted-foreground">
          Invest in Black-owned businesses and share in their success
        </p>
      </div>

      {/* My Investments */}
      {myInvestments && myInvestments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">My Investments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myInvestments.map((investment: any) => (
              <Card key={investment.id} className="border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {investment.community_investments?.businesses?.logo_url && (
                      <img
                        src={investment.community_investments.businesses.logo_url}
                        alt=""
                        className="w-10 h-10 rounded-lg"
                      />
                    )}
                    <div>
                      <CardTitle className="text-base">
                        {investment.community_investments?.businesses?.business_name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Invested {new Date(investment.invested_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your Investment</span>
                      <span className="font-semibold">${investment.amount}</span>
                    </div>
                    {investment.equity_percentage && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Equity</span>
                        <span className="font-semibold">{investment.equity_percentage}%</span>
                      </div>
                    )}
                    <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                      {investment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Investments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Investment Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p className="col-span-full text-center py-8 text-muted-foreground">Loading...</p>
          ) : investments && investments.length > 0 ? (
            investments.map((investment: any) => {
              const progress = (investment.current_amount / investment.goal_amount) * 100;
              
              return (
                <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {investment.businesses?.logo_url && (
                        <img
                          src={investment.businesses.logo_url}
                          alt=""
                          className="w-12 h-12 rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">
                          {investment.businesses?.business_name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {investment.businesses?.category}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{investment.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {investment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            ${investment.current_amount.toLocaleString()} / $
                            {investment.goal_amount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {progress.toFixed(0)}% funded
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Min Investment</p>
                          <p className="font-semibold">${investment.min_investment}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Investors</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {investment.investor_count}
                          </p>
                        </div>
                      </div>

                      {investment.equity_offered && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Equity Offered</p>
                          <p className="text-lg font-bold text-primary">
                            {investment.equity_offered}%
                          </p>
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full gap-2"
                            onClick={() => setSelectedInvestment(investment)}
                          >
                            <TrendingUp className="w-4 h-4" />
                            Invest Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invest in {investment.businesses?.business_name}</DialogTitle>
                            <DialogDescription>{investment.title}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="amount">Investment Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                min={investment.min_investment}
                                step="0.01"
                                placeholder={`Min: $${investment.min_investment}`}
                                value={investAmount}
                                onChange={(e) => setInvestAmount(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleInvest} className="w-full">
                              Confirm Investment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No investment opportunities available yet
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
