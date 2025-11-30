
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Database, Eye, Lock, Share2, Settings, Heart, AlertCircle, Mail, Users, CreditCard, Bell, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Mansa Musa Marketplace</title>
        <meta name="description" content="Privacy Policy for Mansa Musa Marketplace - Learn how we collect, use, and protect your data." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 text-white">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
                <Shield className="h-16 w-16 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              Privacy Policy 🔒
            </h1>
            <p className="text-xl text-white/90 font-medium mb-4">
              Your privacy is our priority - learn how we protect your data
            </p>
            <p className="text-sm text-white/80">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* About Section */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                About This Policy 💙
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Mansa Musa Marketplace is committed to empowering Black-owned businesses and strengthening community wealth. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application and services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                Information We Collect 📊
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">Contact Information</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>Name:</strong> First and last name for account creation and business profiles</li>
                  <li><strong>Email Address:</strong> Required for account authentication and communication</li>
                  <li><strong>Phone Number:</strong> Optional for customer profiles and required for business verification</li>
                  <li><strong>Physical Address:</strong> Business addresses for directory listings and customer addresses for location-based services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">Camera Access 📷</h3>
                <p className="text-foreground/80 mb-3">We request camera access for the following purposes:</p>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>QR Code Scanning:</strong> To scan QR codes at participating businesses for loyalty rewards and quick check-ins</li>
                  <li><strong>Photo Upload:</strong> To allow business owners to take and upload photos of their products, services, and storefronts</li>
                  <li><strong>Profile Pictures:</strong> To capture and upload profile images for user and business accounts</li>
                </ul>
                <p className="text-foreground/80 mt-3">
                  Camera access is only used when you actively choose to scan a QR code or take a photo. We do not access your camera in the background or without your explicit action. You can manage camera permissions in your device settings at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">Location Information 📍</h3>
                <p className="text-foreground/80">
                  We collect approximate location data (coarse location) to help you discover nearby Black-owned businesses. We do not collect precise GPS coordinates unless specifically required for a feature you choose to use. Location access can be controlled through your device settings, and you can choose to deny location access while still using most app features.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">Push Notifications 🔔</h3>
                <p className="text-foreground/80 mb-3">With your permission, we send push notifications for:</p>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>Loyalty Rewards:</strong> Notifications when you earn or redeem rewards at participating businesses</li>
                  <li><strong>Booking Updates:</strong> Reminders and updates about your appointments and reservations</li>
                  <li><strong>Subscription Updates:</strong> Important notifications about your subscription status, renewals, and billing</li>
                  <li><strong>Community Updates:</strong> Optional notifications about new businesses, special offers, and community events</li>
                </ul>
                <p className="text-foreground/80 mt-3">
                  You can manage notification preferences in your device settings or within the app settings. You can opt out of promotional notifications while still receiving important account and transactional notifications.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">Payment and Subscription Data 💳</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>Subscription Information:</strong> Subscription tier, status, billing cycle, and subscription dates</li>
                  <li><strong>Payment Processor Data:</strong> We work with third-party payment processors (Stripe, Apple App Store, Google Play) who handle payment information securely</li>
                  <li><strong>Transaction Records:</strong> Purchase history, refunds, and subscription changes for account management</li>
                  <li><strong>Billing Information:</strong> Stored securely by our payment processors, not directly by us</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">User Content</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>Photos and Images:</strong> Business logos, banners, and product images uploaded by business owners</li>
                  <li><strong>Business Information:</strong> Descriptions, categories, and other business details</li>
                  <li><strong>Reviews and Ratings:</strong> Customer feedback and business reviews</li>
                  <li><strong>Customer Support:</strong> Information provided in support requests or feedback forms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">Usage and Analytics Data</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>App Interactions:</strong> QR code scans, business visits, loyalty point activities</li>
                  <li><strong>Account Identifiers:</strong> Unique user IDs for account management</li>
                  <li><strong>Performance Data:</strong> App performance metrics and crash reports to improve user experience</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Voice Assistant */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 border-amber-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                AI Voice Assistant & Data Processing 🎤
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-amber-700 mb-3">Voice Data Collection</h3>
                <p className="text-foreground/80 mb-3">
                  When you use our AI voice assistant "Kayla," we collect and process your voice recordings to provide conversational assistance about our marketplace features, business directory, and services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-700 mb-3">Third-Party Processing</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li>Voice recordings are processed by OpenAI's API to generate responses</li>
                  <li>Audio data is transmitted securely to OpenAI's servers for real-time speech recognition and response generation</li>
                  <li>OpenAI processes this data according to their privacy policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://openai.com/privacy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-700 mb-3">Data Retention</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li><strong>No Permanent Storage:</strong> Voice recordings are NOT permanently stored by Mansa Musa Marketplace</li>
                  <li><strong>Real-Time Processing:</strong> Audio is processed in real-time and discarded after the conversation session ends</li>
                  <li><strong>Session Cache:</strong> Conversation transcripts may be temporarily cached in your device's session storage for context</li>
                  <li><strong>User Control:</strong> You can clear this data by closing the app or clearing your browser/app cache</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-700 mb-3">Microphone Permission 🎙️</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li>The app requests microphone access only when you activate the voice assistant</li>
                  <li>You can revoke microphone permission at any time through your device settings</li>
                  <li>Voice features will not work without microphone permission</li>
                  <li>Microphone is only active during voice conversations - we do not record in the background</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-700 mb-3">User Control and Optional Use</h3>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li>You can use the app without the voice assistant feature</li>
                  <li>All marketplace features remain accessible through traditional text input and navigation</li>
                  <li>You can end voice conversations at any time by tapping "End Chat"</li>
                  <li>Voice assistant is completely optional and opt-in</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-700 mb-3">Purpose Limitation</h3>
                <p className="text-foreground/80 mb-2">Voice data is used solely to provide AI-powered assistance with:</p>
                <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                  <li>Finding Black-owned businesses in your area</li>
                  <li>Understanding marketplace features and how to use them</li>
                  <li>Booking appointments and managing reservations</li>
                  <li>Navigating rewards and community features</li>
                  <li>Getting help with app functionality and support questions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                How We Use Your Information ✅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                <li>Provide and maintain our marketplace services</li>
                <li>Facilitate connections between customers and Black-owned businesses</li>
                <li>Enable camera access for QR code scanning and photo uploads (only when you choose to use these features)</li>
                <li>Process voice recordings through OpenAI's API to provide AI voice assistant "Kayla" (only when you activate this feature)</li>
                <li>Use location data to help you discover nearby Black-owned businesses</li>
                <li>Send push notifications for loyalty rewards, bookings, and important updates (with your permission)</li>
                <li>Process QR code scans and loyalty point transactions</li>
                <li>Process subscription payments and manage subscription services</li>
                <li>Send subscription-related notifications and updates</li>
                <li>Handle subscription renewals, cancellations, and refunds</li>
                <li>Send important service notifications and updates</li>
                <li>Improve app functionality and user experience</li>
                <li>Provide customer support</li>
                <li>Verify business authenticity and maintain marketplace quality</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Processing */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 border-indigo-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-indigo-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                Payment Processing & Subscription Management 💳
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">We use trusted third-party payment processors to handle subscription billing and payments:</p>
              <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                <li><strong>Stripe:</strong> Processes credit card payments and manages subscription billing for web users</li>
                <li><strong>Apple App Store:</strong> Handles in-app purchases and subscriptions for iOS users</li>
              </ul>
              <p className="text-foreground/80"><strong>Subscription Notifications:</strong> We receive automated notifications from payment processors about subscription events (renewals, cancellations, payment failures) to maintain accurate account status and provide seamless service. These notifications help us:</p>
              <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                <li>Update your subscription status in real-time</li>
                <li>Provide appropriate access to marketplace services and tools</li>
                <li>Send you relevant notifications about your subscription</li>
                <li>Handle subscription issues promptly</li>
              </ul>
            </CardContent>
          </Card>
          {/* Information Sharing */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 border-orange-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                Information Sharing and Disclosure 🤝
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Business Directory:</strong> Business information is publicly displayed to help customers discover Black-owned businesses</li>
                <li><strong>Service Providers:</strong> With trusted third-party services (like Supabase for data storage, Stripe for payments) that help us operate the app</li>
                <li><strong>AI Voice Processing:</strong> Voice recordings are shared with OpenAI for real-time speech recognition and AI assistant responses when you use the voice assistant feature</li>
                <li><strong>Payment Processors:</strong> Subscription and payment data is shared with our payment processors (Stripe, Apple, Google) as necessary to process transactions and manage subscriptions</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy Rights */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 border-teal-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-teal-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                Your Privacy Rights and Choices ⚙️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-foreground/80 space-y-2 ml-6 list-disc">
                <li><strong>Access and Update:</strong> View and update your profile information at any time</li>
                <li><strong>Subscription Management:</strong> Manage your subscription through our app or directly through your payment provider (Apple App Store, Google Play, or Stripe)</li>
                <li><strong>Microphone Control:</strong> Control microphone permissions through your device settings and turn off voice assistant features at any time</li>
                <li><strong>Location Services:</strong> Control location permissions through your device settings</li>
                <li><strong>Account Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Communication Preferences:</strong> Opt out of non-essential communications</li>
                <li><strong>Data Portability:</strong> Request a copy of your personal data</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-red-50 via-rose-50 to-red-50 border-red-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                Data Security 🔐
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission, and regular security assessments. Payment information is secured by our payment processors using industry-standard encryption and security protocols. However, no method of transmission over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 border-violet-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-violet-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                Data Retention 📦
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Subscription data is retained as long as your account is active and for a reasonable period thereafter for customer service and legal compliance purposes. Business listings may remain active until the business owner requests removal.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 border-pink-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-pink-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Children's Privacy 👶
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 border-amber-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                Changes to This Privacy Policy 🔄
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes affecting subscription services or payment processing will be communicated via email or in-app notification. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-sky-50 via-blue-50 to-sky-50 border-sky-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-sky-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                Contact Us 📧
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-foreground/80">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="text-foreground/80 font-medium">
                <p>Email: privacy@mansamusamarketplace.com</p>
                <p>Subject Line: Privacy Policy Inquiry</p>
              </div>
            </CardContent>
          </Card>

          {/* Our Commitment */}
          <Card className="border-2 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                Our Commitment 💚
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                As part of our mission to empower Black-owned businesses and strengthen economic communities, we are committed to maintaining your trust through transparent and responsible data practices. Your privacy is essential to achieving our shared goals of economic empowerment and community building.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
