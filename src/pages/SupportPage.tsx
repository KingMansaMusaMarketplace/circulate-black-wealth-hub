import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, MessageCircle, Book, Headphones, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SupportPage = () => {
  const supportOptions = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@mansamusamarketplace.com",
      action: "Send Email"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak with our support team directly",
      contact: "312.709.6006",
      action: "Call Now"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with us in real-time during business hours",
      contact: "Available Monday-Friday, 9AM-6PM CST",
      action: "Start Chat"
    }
  ];

  const faqCategories = [
    {
      title: "Account & Profile",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the navigation menu, choose between Customer or Business account, fill in your information, and verify your email address. It only takes a few minutes to get started!"
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Log In', then select 'Forgot Password'. Enter your email address and we'll send you a secure link to reset your password. The link is valid for 24 hours."
        },
        {
          question: "How do I update my profile information?",
          answer: "Once logged in, go to your Dashboard and click on 'Profile Settings'. From there you can update your name, email, phone number, profile picture, and other personal information."
        },
        {
          question: "How do I delete my account?",
          answer: "Go to Settings > Account > Delete Account. Please note this action is permanent and will remove all your data including loyalty points, saved businesses, and transaction history."
        }
      ]
    },
    {
      title: "Business Directory",
      faqs: [
        {
          question: "How do I list my business?",
          answer: "Sign up for a Business account, complete your business profile with details like name, description, hours, and location. Choose a subscription plan and submit for verification. Most businesses are approved within 24-48 hours."
        },
        {
          question: "How do I update my business information?",
          answer: "Log into your Business Dashboard and navigate to 'Business Profile'. You can update your business hours, contact information, photos, services, and more. Changes take effect immediately."
        },
        {
          question: "How do I verify my business?",
          answer: "After creating your business listing, our team will review your submission. You may be asked to provide documentation such as business license, EIN, or proof of ownership. Verified businesses display a badge on their profile."
        },
        {
          question: "What are the listing requirements?",
          answer: "Your business must be Black-owned (at least 51%), have a valid business license, provide accurate contact information, and comply with our community guidelines. See our Terms of Service for complete requirements."
        }
      ]
    },
    {
      title: "QR Code & Rewards",
      faqs: [
        {
          question: "How do QR codes work?",
          answer: "Each participating business has a unique QR code. When you make a purchase, scan the code using our app's QR Scanner. This earns you loyalty points and helps track your support of Black-owned businesses."
        },
        {
          question: "How do I earn loyalty points?",
          answer: "Earn points by scanning QR codes at participating businesses, referring friends, completing your profile, and engaging with the community. Different actions earn different point values."
        },
        {
          question: "How do I redeem rewards?",
          answer: "Visit the Rewards page to see available offers. Select a reward, confirm redemption, and show the generated code to the business. Points are deducted automatically when you redeem."
        },
        {
          question: "What if a QR code doesn't work?",
          answer: "Make sure you have camera permissions enabled and good lighting. If it still doesn't work, you can manually enter the business code or contact support. The business can also manually credit your points."
        }
      ]
    },
    {
      title: "Technical Issues",
      faqs: [
        {
          question: "App won't load or crashes",
          answer: "Try clearing your browser cache, updating to the latest version, or using a different browser. If the issue persists, check our System Status page or contact support with details about your device and browser."
        },
        {
          question: "Camera/QR scanner not working",
          answer: "Ensure camera permissions are enabled in your device settings. On iOS: Settings > Safari > Camera. Restart the app after granting permissions."
        },
        {
          question: "Location services issues",
          answer: "Enable location services in your device settings to find nearby businesses. We only use your location when you're actively using the map feature. You can disable it anytime in Settings."
        },
        {
          question: "Login/authentication problems",
          answer: "Clear your cookies and cache, ensure you're using the correct email address, and check if your account is verified. If you recently changed your password, sign out of all devices and log back in with the new password."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Support Center - Mansa Musa Marketplace</title>
        <meta name="description" content="Get help with Mansa Musa Marketplace. Contact our support team, browse FAQs, and find solutions to common issues." />
        <link rel="canonical" href="https://mansamusamarketplace.com/support" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Support Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you make the most of Mansa Musa Marketplace. Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Support Options */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">How Can We Help You?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 text-primary flex justify-center">
                      {option.icon}
                    </div>
                    <CardTitle className="text-center">{option.title}</CardTitle>
                    <CardDescription className="text-center">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="font-medium text-center break-words">{option.contact}</p>
                    <Button className="w-full">{option.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, qIndex) => (
                        <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                          <AccordionTrigger className="text-left text-sm font-medium hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* System Status */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  System Status & Service Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Support Hours
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM CST</li>
                      <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM CST</li>
                      <li><strong>Sunday:</strong> Closed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Current System Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">All systems operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Other ways to reach us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Mailing Address</p>
                      <p className="text-sm text-muted-foreground">
                        1000 E. 111th Street, Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">General Inquiries</p>
                      <p className="text-sm text-muted-foreground">
                        contact@mansamusamarketplace.com
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default SupportPage;