
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Store, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeGuideProps {
  userType: 'customer' | 'business';
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ userType }) => {
  const customerSteps = [
    {
      icon: <QrCode className="h-5 w-5" />,
      title: "Scan QR Codes",
      description: "Visit participating businesses and scan their QR codes to earn points",
      action: "Start Scanning",
      link: "/scanner"
    },
    {
      icon: <Store className="h-5 w-5" />,
      title: "Discover Businesses",
      description: "Find Black-owned businesses in your area and support your community",
      action: "Browse Directory",
      link: "/directory"
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Earn Rewards",
      description: "Redeem your loyalty points for discounts and exclusive offers",
      action: "View Rewards",
      link: "/loyalty"
    }
  ];

  const businessSteps = [
    {
      icon: <Store className="h-5 w-5" />,
      title: "Complete Your Profile",
      description: "Add your business information and photos to attract customers",
      action: "Edit Profile",
      link: "/business/profile"
    },
    {
      icon: <QrCode className="h-5 w-5" />,
      title: "Generate QR Codes",
      description: "Create loyalty and discount QR codes for your customers",
      action: "Create QR Code",
      link: "/business/qr-codes"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Engage Customers",
      description: "Track scans and reward loyal customers with points",
      action: "View Analytics",
      link: "/business/dashboard"
    }
  ];

  const steps = userType === 'customer' ? customerSteps : businessSteps;

  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-blue-400" />
          Welcome to Mansa Musa Marketplace
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 border border-white/10 rounded-lg bg-slate-800/40 backdrop-blur-sm hover:bg-slate-800/60 transition-all">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-3 text-blue-400">
                {step.icon}
              </div>
              <h3 className="font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-sm text-white/70 mb-4">{step.description}</p>
              <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to={step.link}>{step.action}</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeGuide;
