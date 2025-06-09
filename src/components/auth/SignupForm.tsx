
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Sign up to start using Mansa Musa Marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer">
            <CustomerSignupTab />
          </TabsContent>
          
          <TabsContent value="business">
            <BusinessSignupForm 
              referralCode=""
              referringAgent={null}
              onCheckReferralCode={async () => null}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
