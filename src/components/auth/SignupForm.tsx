
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BusinessSignupForm from './forms/BusinessSignupForm';
import CustomerSignupTab from './forms/CustomerSignupTab';

const SignupForm: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Sign up to start using Mansa Musa Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md mx-auto">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer" className="w-full">
              <div className="max-w-md mx-auto">
                <CustomerSignupTab />
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="w-full">
              <BusinessSignupForm 
                referralCode=""
                referringAgent={null}
                onCheckReferralCode={async () => null}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
