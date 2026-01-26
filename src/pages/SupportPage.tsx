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
      contact: "Thomas@1325.AI",
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        {/* Hero Section */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block mb-6">
                <div className="p-4 bg-gradient-to-br from-mansagold/20 to-amber-500/20 rounded-full backdrop-blur-sm border border-mansagold/30 shadow-lg shadow-mansagold/20 animate-pulse">
                  <Headphones className="h-16 w-16 text-mansagold" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Support <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Center</span> 🎧
              </h1>
              <p className="text-xl text-blue-100/90 font-medium">
                We're here to help you make the most of Mansa Musa Marketplace ✨
              </p>
            </div>
          </div>
        </div>

        <main className="relative z-10 container mx-auto px-4 py-16">

          {/* Support Options */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-white">How Can We </span>
              <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Help You?</span> 💬
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => {
                const iconBgs = [
                  'from-mansablue to-blue-600',
                  'from-green-500 to-emerald-600',
                  'from-mansagold to-amber-500'
                ];
                return (
                  <Card key={index} className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 hover:shadow-xl hover:shadow-mansagold/20 transition-all duration-300 hover:scale-105">
                    <CardHeader className="text-center">
                      <div className={`mx-auto mb-4 p-3 bg-gradient-to-br ${iconBgs[index]} rounded-xl shadow-lg flex justify-center w-fit`}>
                        {React.cloneElement(option.icon as React.ReactElement, { className: "h-6 w-6 text-white" })}
                      </div>
                      <CardTitle className="text-center text-white">{option.title}</CardTitle>
                      <CardDescription className="text-center text-blue-200/70">{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="font-semibold text-center break-words bg-gradient-to-r from-blue-300 to-mansagold bg-clip-text text-transparent">{option.contact}</p>
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
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-white">Frequently Asked </span>
              <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Questions</span> 📚
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqCategories.map((category, index) => {
                const iconColors = [
                  'text-mansagold',
                  'text-blue-400',
                  'text-amber-400',
                  'text-mansablue'
                ];
                return (
                  <Card key={index} className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/30 hover:shadow-xl hover:shadow-mansagold/10 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 font-bold text-white`}>
                        <Book className={`h-5 w-5 ${iconColors[index]}`} />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, qIndex) => (
                          <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`} className="border-white/10">
                            <AccordionTrigger className="text-left text-sm font-semibold text-blue-200/90 hover:text-mansagold transition-colors">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-blue-100/80">
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
            <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:shadow-xl hover:shadow-mansagold/20 transition-all duration-300">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white font-bold">
                  <Headphones className="h-6 w-6 text-mansagold" />
                  System Status & Service Hours ⏰
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-white/10">
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-white">
                      <Clock className="h-5 w-5 text-mansagold" />
                      Support Hours
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-100/90">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM CST
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <strong>Saturday:</strong> 10:00 AM - 4:00 PM CST
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        <strong>Sunday:</strong> Closed
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-white/10">
                    <h4 className="font-bold mb-3 text-white">Current System Status</h4>
                    <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-sm font-semibold text-green-300">All systems operational ✅</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section>
            <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:shadow-xl hover:shadow-mansagold/20 transition-all duration-300">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white font-bold">Contact Information 📍</CardTitle>
                <CardDescription className="text-blue-200/70">
                  Other ways to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-slate-900/60 rounded-lg border border-white/10 hover:border-mansagold/30 hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-gradient-to-br from-mansablue to-blue-600 rounded-lg shadow-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Mailing Address</p>
                      <p className="text-sm text-blue-100/90 font-medium">
                        1000 E. 111th Street, Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-900/60 rounded-lg border border-white/10 hover:border-mansagold/30 hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-gradient-to-br from-mansagold to-amber-500 rounded-lg shadow-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">General Inquiries</p>
                      <p className="text-sm text-blue-100/90 font-medium break-words">
                        Thomas@1325.AI
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