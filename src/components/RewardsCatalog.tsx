
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Gift, Coffee, ShoppingBag, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';

interface Reward {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  icon: React.ReactNode;
  isPopular?: boolean;
  isLimited?: boolean;
  business?: string;
}

interface RewardsCatalogProps {
  availablePoints: number;
  onRedeem?: (rewardId: number, pointsCost: number) => void;
}

const RewardsCatalog: React.FC<RewardsCatalogProps> = ({ availablePoints = 0, onRedeem }) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  
  // Sample rewards
  const rewards: Reward[] = [
    {
      id: 1,
      title: "Free Coffee",
      description: "Enjoy a free coffee at Soul Food Kitchen",
      pointsCost: 50,
      icon: <Coffee className="h-5 w-5" />,
      business: "Soul Food Kitchen",
      isPopular: true
    },
    {
      id: 2,
      title: "$10 Discount",
      description: "Get $10 off your next purchase at Heritage Bookstore",
      pointsCost: 100,
      icon: <ShoppingBag className="h-5 w-5" />,
      business: "Heritage Bookstore"
    },
    {
      id: 3,
      title: "Free Haircut",
      description: "Enjoy a complimentary haircut at Prestigious Cuts",
      pointsCost: 200,
      icon: <Gift className="h-5 w-5" />,
      business: "Prestigious Cuts",
      isLimited: true
    },
    {
      id: 4,
      title: "VIP Status",
      description: "Unlock VIP status across all participating businesses",
      pointsCost: 500,
      icon: <Sparkles className="h-5 w-5" />,
      isPopular: true
    },
  ];
  
  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemDialog(true);
  };
  
  const processRedemption = () => {
    if (!selectedReward) return;
    
    setIsRedeeming(true);
    
    // Simulate redemption process
    setTimeout(() => {
      setIsRedeeming(false);
      setShowRedeemDialog(false);
      
      if (onRedeem) {
        onRedeem(selectedReward.id, selectedReward.pointsCost);
      }
      
      toast("Reward Redeemed!", {
        description: `You've successfully redeemed ${selectedReward.title} for ${selectedReward.pointsCost} points.`,
      });
      
      setSelectedReward(null);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Rewards Catalog</h2>
        <div className="flex items-center gap-2">
          <Award className="text-mansagold" size={18} />
          <span className="font-semibold">{availablePoints} points available</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="relative overflow-hidden">
            {reward.isPopular && (
              <div className="absolute top-0 right-0 bg-mansablue text-white text-xs py-1 px-3 rounded-bl">
                Popular
              </div>
            )}
            {reward.isLimited && (
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs py-1 px-3 rounded-bl flex items-center gap-1">
                <Clock size={12} />
                Limited Time
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-mansablue/10 flex items-center justify-center text-mansablue">
                  {reward.icon}
                </div>
                {reward.title}
              </CardTitle>
              {reward.business && (
                <CardDescription>{reward.business}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{reward.description}</p>
              
              <div className="mt-3 mb-1 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {availablePoints}/{reward.pointsCost} points
                </div>
                <div className="text-sm font-medium">
                  {Math.min(Math.round((availablePoints / reward.pointsCost) * 100), 100)}%
                </div>
              </div>
              <Progress 
                value={Math.min((availablePoints / reward.pointsCost) * 100, 100)} 
                className="h-2"
              />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-mansablue hover:bg-mansablue-dark"
                disabled={availablePoints < reward.pointsCost}
                onClick={() => handleRedeemClick(reward)}
              >
                {availablePoints >= reward.pointsCost ? 'Redeem Reward' : `Need ${reward.pointsCost - availablePoints} more points`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              You're about to redeem the following reward:
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-mansablue/10 flex items-center justify-center text-mansablue">
                  {selectedReward.icon}
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
                  <p>{availablePoints} points</p>
                  <p>{availablePoints - selectedReward.pointsCost} points</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                This action cannot be undone. Once redeemed, your points will be deducted and you'll receive a confirmation code.
              </p>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowRedeemDialog(false)}
              disabled={isRedeeming}
            >
              Cancel
            </Button>
            <Button
              onClick={processRedemption}
              className="bg-mansablue hover:bg-mansablue-dark"
              disabled={isRedeeming}
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
    </div>
  );
};

export default RewardsCatalog;
