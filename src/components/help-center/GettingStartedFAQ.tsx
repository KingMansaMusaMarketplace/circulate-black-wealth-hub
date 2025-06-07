
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const GettingStartedFAQ = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-mansablue flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="create-account">
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>Creating an account is easy:</p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li>Click "Sign Up" in the top right corner</li>
                  <li>Choose between "Customer" or "Business" account</li>
                  <li>Fill in your name, email, and create a secure password</li>
                  <li>Enter a referral code if you have one (optional)</li>
                  <li>Check the box if you're an HBCU member for special benefits</li>
                  <li>Click "Create Account" and verify your email</li>
                </ol>
                <p>Once verified, you can start exploring Black-owned businesses and earning loyalty points!</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="business-profile">
            <AccordionTrigger>How do I set up my business profile?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>After creating a business account:</p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li>Go to your Dashboard and click "Business Profile"</li>
                  <li>Fill in your business details (name, description, category)</li>
                  <li>Add your location and contact information</li>
                  <li>Upload your business logo and banner images</li>
                  <li>Add photos of your products or services</li>
                  <li>Submit for verification to get a verified badge</li>
                </ol>
                <p>A complete profile helps customers find and trust your business!</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="loyalty-points">
            <AccordionTrigger>How do loyalty points work?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>Our loyalty system rewards you for supporting Black-owned businesses:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Earn Points:</strong> Scan QR codes at participating businesses to earn points</li>
                  <li><strong>Point Values:</strong> Each business sets their own point rewards (typically 10-100 points per visit)</li>
                  <li><strong>Redeem Rewards:</strong> Use points for discounts, free items, or special offers</li>
                  <li><strong>Track Progress:</strong> View your points balance and history in your dashboard</li>
                  <li><strong>Leaderboard:</strong> Compete with other community members</li>
                </ul>
                <p>The more you support Black businesses, the more rewards you earn!</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="qr-codes">
            <AccordionTrigger>How do I use QR codes?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>QR codes are your gateway to earning loyalty points:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-mansablue mb-2">For Customers:</h4>
                    <ol className="list-decimal ml-6 space-y-1 text-sm">
                      <li>Open the QR scanner in your app</li>
                      <li>Point your camera at the business QR code</li>
                      <li>Confirm your visit</li>
                      <li>Earn loyalty points instantly!</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium text-mansablue mb-2">For Businesses:</h4>
                    <ol className="list-decimal ml-6 space-y-1 text-sm">
                      <li>Go to QR Management in your dashboard</li>
                      <li>Create custom QR codes for different offers</li>
                      <li>Set point values and expiration dates</li>
                      <li>Display QR codes for customers to scan</li>
                    </ol>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default GettingStartedFAQ;
