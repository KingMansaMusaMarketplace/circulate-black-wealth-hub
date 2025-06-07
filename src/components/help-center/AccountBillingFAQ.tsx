
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AccountBillingFAQ = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-mansablue">Account & Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="subscription">
            <AccordionTrigger>How do I manage my subscription?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>Managing your subscription is straightforward:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>View Current Plan:</strong> Check your subscription status in Settings</li>
                  <li><strong>Upgrade/Downgrade:</strong> Change plans anytime in your account settings</li>
                  <li><strong>Payment History:</strong> View all past transactions and receipts</li>
                  <li><strong>Auto-Renewal:</strong> Subscriptions auto-renew unless cancelled</li>
                  <li><strong>Cancellation:</strong> Cancel anytime - you keep access until period ends</li>
                </ul>
                <p>Need help? Contact our support team for assistance with billing questions.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-methods">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>We accept the following payment methods:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Credit Cards (Visa, MasterCard, American Express, Discover)</li>
                  <li>Debit Cards</li>
                  <li>PayPal</li>
                  <li>Apple Pay (on supported devices)</li>
                  <li>Google Pay (on supported devices)</li>
                </ul>
                <p>All payments are processed securely through Stripe, our payment processor.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="account-settings">
            <AccordionTrigger>How do I update my account settings?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>To update your account information:</p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li>Log in and go to your Profile page</li>
                  <li>Click "Edit Profile" to update personal information</li>
                  <li>For business accounts, use "Business Profile" to update business details</li>
                  <li>Go to Settings for notification preferences and privacy controls</li>
                  <li>Use Security Settings to change your password or enable two-factor authentication</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy">
            <AccordionTrigger>What privacy controls are available?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>We provide comprehensive privacy controls:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Profile Visibility:</strong> Control who can see your profile information</li>
                  <li><strong>Location Sharing:</strong> Choose when to share your location</li>
                  <li><strong>Email Preferences:</strong> Customize which emails you receive</li>
                  <li><strong>Data Export:</strong> Download your data anytime</li>
                  <li><strong>Account Deletion:</strong> Permanently delete your account if needed</li>
                </ul>
                <p>Read our full Privacy Policy for details on how we protect your information.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AccountBillingFAQ;
