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
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-primary to-blue-600 text-white">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
                  <Headphones className="h-16 w-16 text-yellow-300" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Support Center 🎧
              </h1>
              <p className="text-xl text-white/90 font-medium">
                We're here to help you make the most of Mansa Musa Marketplace ✨
              </p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-16">

          {/* Support Options */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-primary to-blue-600 bg-clip-text text-transparent mb-8 text-center">
              How Can We Help You? 💬
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => {
                const gradients = [
                  'from-blue-50 via-cyan-50 to-blue-50 border-blue-200',
                  'from-green-50 via-emerald-50 to-green-50 border-green-200',
                  'from-purple-50 via-pink-50 to-purple-50 border-purple-200'
                ];
                const iconBgs = [
                  'from-blue-500 to-cyan-600',
                  'from-green-500 to-emerald-600',
                  'from-purple-500 to-pink-600'
                ];
                const textColors = [
                  'text-blue-700',
                  'text-green-700',
                  'text-purple-700'
                ];
                return (
                  <Card key={index} className={`hover:shadow-xl transition-all hover:scale-105 border-2 bg-gradient-to-br ${gradients[index]}`}>
                    <CardHeader className="text-center">
                      <div className={`mx-auto mb-4 p-3 bg-gradient-to-br ${iconBgs[index]} rounded-xl shadow-lg flex justify-center w-fit`}>
                        {React.cloneElement(option.icon as React.ReactElement, { className: "h-6 w-6 text-white" })}
                      </div>
                      <CardTitle className={`text-center ${textColors[index]}`}>{option.title}</CardTitle>
                      <CardDescription className="text-center">{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className={`font-semibold text-center break-words ${textColors[index]}`}>{option.contact}</p>
                      <Button className={`w-full bg-gradient-to-r ${iconBgs[index]} hover:opacity-90 text-white font-semibold shadow-lg`}>
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-primary to-blue-600 bg-clip-text text-transparent mb-8 text-center">
              Frequently Asked Questions 📚
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqCategories.map((category, index) => {
                const cardGradients = [
                  'from-orange-50 via-yellow-50 to-orange-50 border-orange-200',
                  'from-teal-50 via-cyan-50 to-teal-50 border-teal-200',
                  'from-rose-50 via-pink-50 to-rose-50 border-rose-200',
                  'from-indigo-50 via-purple-50 to-indigo-50 border-indigo-200'
                ];
                const iconColors = [
                  'text-orange-600',
                  'text-teal-600',
                  'text-rose-600',
                  'text-indigo-600'
                ];
                return (
                  <Card key={index} className={`hover:shadow-xl transition-all border-2 bg-gradient-to-br ${cardGradients[index]}`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 font-bold ${iconColors[index]}`}>
                        <Book className={`h-5 w-5 ${iconColors[index]}`} />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, qIndex) => (
                          <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                            <AccordionTrigger className="text-left text-sm font-semibold hover:text-primary">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-foreground/80">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* System Status */}
          <section className="mb-16">
            <Card className="border-2 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200 hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-b border-green-200">
                <CardTitle className="flex items-center gap-2 text-green-700 font-bold">
                  <Headphones className="h-6 w-6 text-green-600" />
                  System Status & Service Hours ⏰
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-green-700">
                      <Clock className="h-5 w-5 text-green-600" />
                      Support Hours
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM CST
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <strong>Saturday:</strong> 10:00 AM - 4:00 PM CST
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <strong>Sunday:</strong> Closed
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold mb-3 text-green-700">Current System Status</h4>
                    <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span className="text-sm font-semibold text-green-700">All systems operational ✅</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section>
            <Card className="border-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-blue-200 hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 border-b border-blue-200">
                <CardTitle className="text-blue-700 font-bold">Contact Information 📍</CardTitle>
                <CardDescription className="text-blue-600/80">
                  Other ways to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700 mb-1">Mailing Address</p>
                      <p className="text-sm text-foreground/80 font-medium">
                        1000 E. 111th Street, Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700 mb-1">General Inquiries</p>
                      <p className="text-sm text-foreground/80 font-medium break-words">
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