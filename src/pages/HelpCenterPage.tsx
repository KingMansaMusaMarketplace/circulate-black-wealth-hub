
import React from 'react';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageCircle, HelpCircle } from 'lucide-react';

const HelpCenterPage = () => {
  const handleEmailSupport = () => {
    window.location.href = 'mailto:contact@mansamusamarketplace.com';
  };

  const handlePhoneSupport = () => {
    window.location.href = 'tel:+13127096006';
  };

  return (
    <ResponsiveLayout
      title="Help Center"
      description="Get help and support for using Mansa Musa Marketplace"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mansablue mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to your questions and get the support you need
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Support Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-mansablue flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-mansagold mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Email Support</p>
                  <a 
                    href="mailto:contact@mansamusamarketplace.com"
                    className="text-mansablue hover:text-mansablue-dark break-all"
                  >
                    contact@mansamusamarketplace.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-mansagold mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Phone Support</p>
                  <a 
                    href="tel:+13127096006"
                    className="text-mansablue hover:text-mansablue-dark"
                  >
                    312.709.6006
                  </a>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM CST</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-mansagold mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Office Location</p>
                  <p className="text-sm text-gray-600">
                    1000 E. 111th Street, Suite 1100<br />
                    Chicago, Illinois 60628
                  </p>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
            </CardContent>
          </Card>

          {/* FAQ Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Getting Started */}
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

            {/* Account & Billing */}
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

            {/* Business Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-mansablue">Business Features</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="qr-management">
                    <AccordionTrigger>How do I manage my QR codes?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-gray-600">
                        <p>QR Code Management gives you full control:</p>
                        <ul className="list-disc ml-6 space-y-2">
                          <li><strong>Create QR Codes:</strong> Generate codes for different promotions or locations</li>
                          <li><strong>Set Rewards:</strong> Define how many points customers earn per scan</li>
                          <li><strong>Expiration Dates:</strong> Set time limits for special offers</li>
                          <li><strong>Scan Limits:</strong> Control how many times each code can be used</li>
                          <li><strong>Analytics:</strong> Track which codes are performing best</li>
                          <li><strong>Bulk Actions:</strong> Create, edit, or delete multiple codes at once</li>
                        </ul>
                        <p>Use different QR codes for different campaigns to track their effectiveness!</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="analytics">
                    <AccordionTrigger>What analytics are available?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-gray-600">
                        <p>Your analytics dashboard provides insights into:</p>
                        <ul className="list-disc ml-6 space-y-2">
                          <li><strong>QR Code Scans:</strong> Track total scans, unique visitors, and repeat customers</li>
                          <li><strong>Customer Engagement:</strong> See when customers visit most often</li>
                          <li><strong>Points Distributed:</strong> Monitor your loyalty program impact</li>
                          <li><strong>Profile Views:</strong> Track how often your business profile is viewed</li>
                          <li><strong>Geographic Data:</strong> See where your customers are coming from</li>
                          <li><strong>Performance Trends:</strong> Compare performance over different time periods</li>
                        </ul>
                        <p>Use these insights to optimize your marketing and customer engagement strategies.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="customer-engagement">
                    <AccordionTrigger>How can I engage with customers?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-gray-600">
                        <p>Multiple ways to connect with your customers:</p>
                        <ul className="list-disc ml-6 space-y-2">
                          <li><strong>Loyalty Rewards:</strong> Create attractive point-earning opportunities</li>
                          <li><strong>Special Offers:</strong> Use limited-time QR codes for promotions</li>
                          <li><strong>Business Updates:</strong> Post news and updates to your profile</li>
                          <li><strong>Customer Reviews:</strong> Respond to customer feedback</li>
                          <li><strong>Social Sharing:</strong> Encourage customers to share their experiences</li>
                          <li><strong>Email Marketing:</strong> Reach customers through our platform (coming soon)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="verification">
                    <AccordionTrigger>How does the verification process work?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-gray-600">
                        <p>Getting verified builds customer trust:</p>
                        <ol className="list-decimal ml-6 space-y-2">
                          <li><strong>Submit Application:</strong> Complete your business profile with accurate information</li>
                          <li><strong>Provide Documentation:</strong> Upload business license, tax ID, or other proof</li>
                          <li><strong>Review Process:</strong> Our team reviews applications within 3-5 business days</li>
                          <li><strong>Verification Badge:</strong> Approved businesses get a verified badge</li>
                          <li><strong>Enhanced Features:</strong> Verified businesses get priority placement and additional features</li>
                        </ol>
                        <p>Verified businesses see 3x more customer engagement on average!</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Help Section */}
        <Card className="bg-gradient-to-r from-mansablue/5 to-mansagold/5 border-mansablue/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-mansablue mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed 
              on the Mansa Musa Marketplace platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-mansablue hover:bg-mansablue-dark"
                onClick={handleEmailSupport}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-mansablue text-mansablue hover:bg-mansablue/10"
                onClick={handlePhoneSupport}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default HelpCenterPage;
