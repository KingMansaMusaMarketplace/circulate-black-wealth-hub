import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Database, Eye, Lock, Share2, Settings, Heart, AlertCircle, Mail, Users, CreditCard, Mic } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Privacy Policy | Mansa Musa Marketplace</title>
        <meta name="description" content="Privacy Policy for Mansa Musa Marketplace - Learn how we collect, use, and protect your data." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
            <div className="inline-block mb-6">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-xl">
                <Shield className="h-16 w-16 text-slate-900" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Privacy Policy 🔒
            </h1>
            <p className="text-xl text-blue-200 font-medium mb-4">
              Your privacy is our priority - learn how we protect your data
            </p>
            <p className="text-sm text-white/60">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* About Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-blue-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">About This Policy 💙</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 leading-relaxed">
                Mansa Musa Marketplace is committed to empowering Black-owned businesses and strengthening community wealth. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application and services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-purple-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Information We Collect 📊</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Contact Information</h3>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">Name:</strong> First and last name for account creation and business profiles</li>
                  <li><strong className="text-white">Email Address:</strong> Required for account authentication and communication</li>
                  <li><strong className="text-white">Phone Number:</strong> Optional for customer profiles and required for business verification</li>
                  <li><strong className="text-white">Physical Address:</strong> Business addresses for directory listings and customer addresses for location-based services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Camera Access 📷</h3>
                <p className="text-blue-200 mb-3">We request camera access for the following purposes:</p>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">QR Code Scanning:</strong> To scan QR codes at participating businesses for loyalty rewards and quick check-ins</li>
                  <li><strong className="text-white">Photo Upload:</strong> To allow business owners to take and upload photos of their products, services, and storefronts</li>
                  <li><strong className="text-white">Profile Pictures:</strong> To capture and upload profile images for user and business accounts</li>
                </ul>
                <p className="text-blue-200 mt-3">
                  Camera access is only used when you actively choose to scan a QR code or take a photo. We do not access your camera in the background or without your explicit action. You can manage camera permissions in your device settings at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Location Information & Proximity Triggers 📍</h3>
                <p className="text-blue-200 mb-3">
                  We use <strong className="text-white">Geofencing technology</strong> to power our Proximity Notification system, which alerts you when you're near Black-owned businesses you might be interested in.
                </p>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">Local Processing First:</strong> Location data is processed locally on your device whenever possible to minimize data transmission</li>
                  <li><strong className="text-white">Anonymized Storage:</strong> When location data is stored, it is anonymized to improve our AI's "Interest Zone" accuracy without identifying you personally</li>
                  <li><strong className="text-white">Coarse Location:</strong> We collect approximate location data (coarse location) to help you discover nearby businesses</li>
                  <li><strong className="text-white">Precise Location:</strong> We do not collect precise GPS coordinates unless specifically required for a feature you choose to use</li>
                  <li><strong className="text-white">User Control:</strong> Location access can be controlled through your device settings, and you can choose to deny location access while still using most app features</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Push Notifications 🔔</h3>
                <p className="text-blue-200 mb-3">With your permission, we send push notifications for:</p>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">Loyalty Rewards:</strong> Notifications when you earn or redeem rewards at participating businesses</li>
                  <li><strong className="text-white">Booking Updates:</strong> Reminders and updates about your appointments and reservations</li>
                  <li><strong className="text-white">Subscription Updates:</strong> Important notifications about your subscription status, renewals, and billing</li>
                  <li><strong className="text-white">Community Updates:</strong> Optional notifications about new businesses, special offers, and community events</li>
                </ul>
                <p className="text-blue-200 mt-3">
                  You can manage notification preferences in your device settings or within the app settings. You can opt out of promotional notifications while still receiving important account and transactional notifications.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Payment and Subscription Data 💳</h3>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">Subscription Information:</strong> Subscription tier, status, billing cycle, and subscription dates</li>
                  <li><strong className="text-white">Payment Processor Data:</strong> We work with third-party payment processors (Stripe, Apple App Store, Google Play) who handle payment information securely</li>
                  <li><strong className="text-white">Transaction Records:</strong> Purchase history, refunds, and subscription changes for account management</li>
                  <li><strong className="text-white">Billing Information:</strong> Stored securely by our payment processors, not directly by us</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">User Content</h3>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">Photos and Images:</strong> Business logos, banners, and product images uploaded by business owners</li>
                  <li><strong className="text-white">Business Information:</strong> Descriptions, categories, and other business details</li>
                  <li><strong className="text-white">Reviews and Ratings:</strong> Customer feedback and business reviews</li>
                  <li><strong className="text-white">Customer Support:</strong> Information provided in support requests or feedback forms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Usage and Analytics Data</h3>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">App Interactions:</strong> QR code scans, business visits, loyalty point activities</li>
                  <li><strong className="text-white">Account Identifiers:</strong> Unique user IDs for account management</li>
                  <li><strong className="text-white">Performance Data:</strong> App performance metrics and crash reports to improve user experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI Processing & Lovable AI Gateway */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-yellow-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                  <Mic className="h-6 w-6 text-slate-900" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Processing & Voice Assistant 🤖</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">AI-Powered Features</h3>
                <p className="text-blue-200 mb-3">
                  Mansa Musa Marketplace uses AI to enhance your experience through features including:
                </p>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">Business Recommendations:</strong> Personalized suggestions based on your preferences and activity</li>
                  <li><strong className="text-white">Review Sentiment Analysis:</strong> Understanding customer feedback to help businesses improve</li>
                  <li><strong className="text-white">B2B Matching:</strong> Connecting businesses with potential partners and suppliers</li>
                  <li><strong className="text-white">Business Insights:</strong> AI-generated analytics and growth recommendations</li>
                  <li><strong className="text-white">Fraud Detection:</strong> Protecting the marketplace from suspicious activity</li>
                  <li><strong className="text-white">Voice Assistant "Kayla":</strong> Conversational assistance for marketplace navigation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">AI Processing Through Secure Gateway</h3>
                <p className="text-blue-200 mb-3">
                  Data processed by our AI features (such as reviews, voice notes, or business descriptions) is transmitted through a <strong className="text-white">secure AI Gateway</strong> that connects to Google Gemini AI models.
                </p>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li>All AI requests are encrypted in transit using industry-standard TLS</li>
                  <li>Personal identifiers are minimized before AI processing when possible</li>
                  <li>AI models do not retain your data after processing your request</li>
                  <li>Voice recordings are processed in real-time and NOT permanently stored</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Voice Data Collection</h3>
                <p className="text-blue-200 mb-3">
                  When you use our AI voice assistant "Kayla," we collect and process your voice recordings to provide conversational assistance.
                </p>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li><strong className="text-white">No Permanent Storage:</strong> Voice recordings are NOT permanently stored by Mansa Musa Marketplace</li>
                  <li><strong className="text-white">Real-Time Processing:</strong> Audio is processed in real-time and discarded after the conversation session ends</li>
                  <li><strong className="text-white">Session Cache:</strong> Conversation transcripts may be temporarily cached in your device's session storage for context</li>
                  <li><strong className="text-white">User Control:</strong> You can clear this data by closing the app or clearing your browser/app cache</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Microphone Permission 🎙️</h3>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li>The app requests microphone access only when you activate the voice assistant</li>
                  <li>You can revoke microphone permission at any time through your device settings</li>
                  <li>Microphone is only active during voice conversations - we do not record in the background</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Optional Use</h3>
                <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                  <li>AI features are optional - you can use the marketplace without them</li>
                  <li>All marketplace features remain accessible through traditional navigation</li>
                  <li>You can end voice conversations at any time by tapping "End Chat"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* B2B Marketplace Transparency */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-violet-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">B2B Marketplace Transparency 🤝</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-blue-200">
                If you are a business owner participating in our B2B Marketplace features, please be aware of the following:
              </p>
              <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                <li><strong className="text-white">Discoverability:</strong> By opting into the B2B Marketplace, your inventory data, business capabilities, and service offerings will be "discoverable" by other verified vendors for the purpose of business matching</li>
                <li><strong className="text-white">AI-Powered Matching:</strong> Our b2b-match AI function analyzes your business profile to suggest potential partners, suppliers, and collaboration opportunities</li>
                <li><strong className="text-white">Opt-In Required:</strong> B2B features are opt-in only - your data will not be shared with other businesses unless you explicitly enable these features</li>
                <li><strong className="text-white">Control:</strong> You can disable B2B discoverability at any time through your business dashboard settings</li>
              </ul>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-green-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">How We Use Your Information ✅</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="text-blue-200 space-y-2 ml-6 list-disc">
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
            </div>
          </div>

          {/* Payment Processing */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-indigo-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Payment Processing & Subscription Management 💳</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-blue-200">We use trusted third-party payment processors to handle subscription billing and payments:</p>
              <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                <li><strong className="text-white">Stripe:</strong> Processes credit card payments and manages subscription billing for web users</li>
                <li><strong className="text-white">Apple App Store:</strong> Handles in-app purchases and subscriptions for iOS users</li>
              </ul>
              <p className="text-blue-200"><strong className="text-white">Subscription Notifications:</strong> We receive automated notifications from payment processors about subscription events (renewals, cancellations, payment failures) to maintain accurate account status and provide seamless service. These notifications help us:</p>
              <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                <li>Update your subscription status in real-time</li>
                <li>Provide appropriate access to marketplace services and tools</li>
                <li>Send you relevant notifications about your subscription</li>
                <li>Handle subscription issues promptly</li>
              </ul>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-orange-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Information Sharing and Disclosure 🤝</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-blue-200">We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                <li><strong className="text-white">With Your Consent:</strong> When you explicitly agree to share information</li>
                <li><strong className="text-white">Business Directory:</strong> Business information is publicly displayed to help customers discover Black-owned businesses</li>
                <li><strong className="text-white">Service Providers:</strong> With trusted third-party services (like Supabase for data storage, Stripe for payments) that help us operate the app</li>
                <li><strong className="text-white">AI Voice Processing:</strong> Voice recordings are shared with OpenAI for real-time speech recognition and AI assistant responses when you use the voice assistant feature</li>
                <li><strong className="text-white">Payment Processors:</strong> Subscription and payment data is shared with our payment processors (Stripe, Apple, Google) as necessary to process transactions and manage subscriptions</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
            </div>
          </div>

          {/* Privacy Rights */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-teal-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Your Privacy Rights and Choices ⚙️</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="text-blue-200 space-y-2 ml-6 list-disc">
                <li><strong className="text-white">Access and Update:</strong> View and update your profile information at any time</li>
                <li><strong className="text-white">Subscription Management:</strong> Manage your subscription through our app or directly through your payment provider (Apple App Store, Google Play, or Stripe)</li>
                <li><strong className="text-white">Microphone Control:</strong> Control microphone permissions through your device settings and turn off voice assistant features at any time</li>
                <li><strong className="text-white">Location Services:</strong> Control location permissions through your device settings</li>
                <li><strong className="text-white">Account Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong className="text-white">Communication Preferences:</strong> Opt out of non-essential communications</li>
                <li><strong className="text-white">Data Portability:</strong> Request a copy of your personal data</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-red-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Data Security 🔐</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 leading-relaxed">
                We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission, and regular security assessments. Payment information is secured by our payment processors using industry-standard encryption and security protocols. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>
          </div>

          {/* Data Retention */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-violet-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Data Retention 📦</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 leading-relaxed">
                We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Subscription data is retained as long as your account is active and for a reasonable period thereafter for customer service and legal compliance purposes. Business listings may remain active until the business owner requests removal.
              </p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-pink-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Children's Privacy 👶</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-amber-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-lg">
                  <AlertCircle className="h-6 w-6 text-slate-900" />
                </div>
                <h2 className="text-xl font-bold text-white">Changes to This Privacy Policy 🔄</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes affecting subscription services or payment processing will be communicated via email or in-app notification. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Contact Us */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-sky-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Contact Us 📧</h2>
              </div>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-blue-200">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="text-white font-medium">
                <p>Email: privacy@mansamusamarketplace.com</p>
                <p>Subject Line: Privacy Policy Inquiry</p>
              </div>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-green-500/20 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Our Commitment 💚</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-blue-200 leading-relaxed">
                As part of our mission to empower Black-owned businesses and strengthen economic communities, we are committed to maintaining your trust through transparent and responsible data practices. Your privacy is essential to achieving our shared goals of economic empowerment and community building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
