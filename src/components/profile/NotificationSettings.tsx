
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import SocialShareButtons from '@/components/common/SocialShareButtons';
import { Bell, Share2, Users, Mail, MessageSquare } from 'lucide-react';

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    marketing: true,
    social: true,
    security: true,
    promotions: false
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    newBusinesses: true,
    points: true,
    rewards: true,
    messages: false
  });

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} email notifications ${emailNotifications[key] ? 'disabled' : 'enabled'}.`);
  };

  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} push notifications ${pushNotifications[key] ? 'disabled' : 'enabled'}.`);
  };

  const handleSave = () => {
    toast.success('Notification preferences saved successfully');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-mansablue" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Configure what emails you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-email" className="font-medium">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">Receive emails about new features and opportunities</p>
            </div>
            <Switch 
              id="marketing-email" 
              checked={emailNotifications.marketing}
              onCheckedChange={() => handleEmailToggle('marketing')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="social-email" className="font-medium">Social Activity</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
            </div>
            <Switch 
              id="social-email" 
              checked={emailNotifications.social}
              onCheckedChange={() => handleEmailToggle('social')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security-email" className="font-medium">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Important notifications about your account security</p>
            </div>
            <Switch 
              id="security-email" 
              checked={emailNotifications.security}
              onCheckedChange={() => handleEmailToggle('security')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promotions-email" className="font-medium">Promotions</Label>
              <p className="text-sm text-muted-foreground">Special offers and discounts from businesses</p>
            </div>
            <Switch 
              id="promotions-email" 
              checked={emailNotifications.promotions}
              onCheckedChange={() => handleEmailToggle('promotions')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-mansablue" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Configure what mobile and desktop notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-businesses" className="font-medium">New Businesses</Label>
              <p className="text-sm text-muted-foreground">When new businesses join near you</p>
            </div>
            <Switch 
              id="new-businesses" 
              checked={pushNotifications.newBusinesses}
              onCheckedChange={() => handlePushToggle('newBusinesses')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="points" className="font-medium">Loyalty Points</Label>
              <p className="text-sm text-muted-foreground">When you earn or redeem loyalty points</p>
            </div>
            <Switch 
              id="points" 
              checked={pushNotifications.points}
              onCheckedChange={() => handlePushToggle('points')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rewards" className="font-medium">Reward Availability</Label>
              <p className="text-sm text-muted-foreground">When you qualify for new rewards</p>
            </div>
            <Switch 
              id="rewards" 
              checked={pushNotifications.rewards}
              onCheckedChange={() => handlePushToggle('rewards')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="messages" className="font-medium">Messages</Label>
              <p className="text-sm text-muted-foreground">When you receive new messages</p>
            </div>
            <Switch 
              id="messages" 
              checked={pushNotifications.messages}
              onCheckedChange={() => handlePushToggle('messages')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-mansablue" />
            Social Connections
          </CardTitle>
          <CardDescription>
            Connect social accounts and share your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Connect your social media accounts to share your marketplace activity and discoveries.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="flex justify-start gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
                Connect Google
              </Button>
              
              <Button variant="outline" className="flex justify-start gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                Connect Email
              </Button>
              
              <Button variant="outline" className="flex justify-start gap-3">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                Connect SMS
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-mansablue" />
              Share Mansa Musa Marketplace
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Invite friends and family to join our economic empowerment movement
            </p>
            
            <SocialShareButtons 
              title="Join Mansa Musa Marketplace" 
              text="I'm circulating wealth in the Black community with Mansa Musa Marketplace. Join me!" 
              url={window.location.origin}
              showLabels={true}
              className="justify-start"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50/50 px-6 py-4">
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
