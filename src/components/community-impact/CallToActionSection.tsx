
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CallToActionSectionProps {
  user: any;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ user }) => {
  return (
    <Card className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white">
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-bold mb-2">
          {user ? 'Ready to Increase Your Impact?' : 'Ready to Make an Impact?'}
        </h3>
        <p className="mb-4 text-blue-100">
          {user 
            ? 'Discover more Black-owned businesses in your area and continue building community wealth.'
            : 'Join our community and start supporting Black-owned businesses to build wealth together.'
          }
        </p>
        <div className="flex gap-3 justify-center">
          {user ? (
            <>
              <Link to="/directory">
                <Button className="bg-white text-mansablue hover:bg-gray-100">
                  Find Businesses
                </Button>
              </Link>
              <Link to="/scanner">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Scan QR Code
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup">
                <Button className="bg-white text-mansablue hover:bg-gray-100">
                  Join the Movement
                </Button>
              </Link>
              <Link to="/directory">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Businesses
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CallToActionSection;
