
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Gift, GiftIcon, CheckCircle, Clock, AlertTriangle, Info } from 'lucide-react';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import RewardDetailsView from './RewardDetailsView';

interface LoyaltyRewardsCardProps {
  totalPoints: number;
  availableRewards: LoyaltyReward[];
  onRedeemReward: (rewardId: string, pointsCost: number) => Promise<boolean>;
}

const LoyaltyRewardsCard: React.FC<LoyaltyRewardsCardProps> = ({
  totalPoints,
  availableRewards,
  onRedeemReward
}) => {
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Group rewards by category
  const groupedRewards = availableRewards.reduce((acc, reward) => {
    const category = reward.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(reward);
    return acc;
  }, {} as Record<string, LoyaltyReward[]>);

  // Sort rewards by points cost (lowest first)
  const sortedCategories = Object.keys(groupedRewards).sort();
  
  const handleShowConfirmation = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setConfirmDialogOpen(true);
  };
  
  const handleShowDetails = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setDetailsDialogOpen(true);
  };
  
  const handleConfirmRedeem = async () => {
    if (!selectedReward || !user) return;
    
    setIsRedeeming(true);
    
    try {
      const success = await onRedeemReward(selectedReward.id, selectedReward.pointsCost);
      
      if (success) {
        // Dialog will close automatically on success
        setConfirmDialogOpen(false);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiresAt?: string): number | null => {
    if (!expiresAt) return null;
    
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <GiftIcon className="h-5 w-5 mr-2 text-mansagold" />
              Available Rewards
            </CardTitle>
            <Badge variant="outline" className="bg-mansablue/10 text-mansablue">
              {totalPoints} Points Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-6">
              {sortedCategories.map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupedRewards[category].map(reward => {
                      const daysUntilExpiry = getDaysUntilExpiration(reward.expiresAt);
                      const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 5;
                      const progress = Math.min((totalPoints / reward.pointsCost) * 100, 100);
                      
                      return (
                        <div 
                          key={reward.id} 
                          className="border rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{reward.title}</div>
                              <div className="text-sm text-gray-500 mt-1">{reward.description}</div>
                              {reward.businessName && (
                                <div className="text-xs text-mansablue mt-1">
                                  {reward.businessName}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className="bg-gray-100">
                              {reward.pointsCost} pts
                            </Badge>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-3 mb-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{totalPoints} / {reward.pointsCost}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          
                          {/* Expiration badge */}
                          {daysUntilExpiry !== null && (
                            <div className={`text-xs flex items-center mt-2 mb-2 ${isExpiringSoon ? 'text-red-500' : 'text-amber-600'}`}>
                              {isExpiringSoon ? (
                                <AlertTriangle size={14} className="mr-1" />
                              ) : (
                                <Clock size={14} className="mr-1" />
                              )}
                              {daysUntilExpiry === 0 ? (
                                <span>Expires today!</span>
                              ) : (
                                <span>Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleShowDetails(reward)}
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button 
                              size="sm"
                              className="flex-1"
                              variant={totalPoints >= reward.pointsCost ? "default" : "outline"}
                              disabled={totalPoints < reward.pointsCost || !user}
                              onClick={() => handleShowConfirmation(reward)}
                            >
                              {totalPoints >= reward.pointsCost ? 'Redeem' : `Need ${reward.pointsCost - totalPoints} more`}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium">No Rewards Available</h3>
              <p className="text-gray-500 text-sm mt-1">
                Check back soon for exciting loyalty rewards!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redemption Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              You're about to redeem this reward using your loyalty points
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-mansablue/10 flex items-center justify-center text-mansablue">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedReward.title}</h3>
                  <p className="text-gray-500 text-sm">{selectedReward.description}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Points Cost:</p>
                  <p>Your Available Points:</p>
                  <p>Remaining After Redemption:</p>
                </div>
                <div className="text-right font-medium">
                  <p>{selectedReward.pointsCost} points</p>
                  <p>{totalPoints} points</p>
                  <p>{totalPoints - selectedReward.pointsCost} points</p>
                </div>
              </div>
              
              {selectedReward.businessName && (
                <div className="text-sm bg-blue-50 p-3 rounded mb-4">
                  <span className="font-medium">Redeemable at:</span> {selectedReward.businessName}
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                This action cannot be undone. Once redeemed, your points will be deducted and the reward will be added to your account.
              </p>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isRedeeming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRedeem}
              className="bg-mansablue hover:bg-mansablue/80"
              disabled={isRedeeming || !selectedReward}
            >
              {isRedeeming ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Confirm Redemption</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reward Details Dialog */}
      <RewardDetailsView
        reward={selectedReward}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        totalPoints={totalPoints}
        onRedeem={() => {
          setDetailsDialogOpen(false);
          setConfirmDialogOpen(true);
        }}
        isRedeeming={isRedeeming}
      />
    </>
  );
};

export default LoyaltyRewardsCard;
