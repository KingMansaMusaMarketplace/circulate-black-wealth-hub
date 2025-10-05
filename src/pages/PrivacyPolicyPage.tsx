
import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy | Mansa Musa Marketplace</title>
        <meta name="description" content="Privacy Policy for Mansa Musa Marketplace - Learn how we collect, use, and protect your data." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mansablue mb-8">Privacy Policy</h1>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Policy</h2>
            <p className="text-gray-600 mb-4">
              Mansa Musa Marketplace is committed to empowering Black-owned businesses and strengthening community wealth. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">Contact Information</h3>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>Name:</strong> First and last name for account creation and business profiles</li>
              <li><strong>Email Address:</strong> Required for account authentication and communication</li>
              <li><strong>Phone Number:</strong> Optional for customer profiles and required for business verification</li>
              <li><strong>Physical Address:</strong> Business addresses for directory listings and customer addresses for location-based services</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Location Information</h3>
            <p className="text-gray-600 mb-4">
              We collect approximate location data (coarse location) to help you discover nearby Black-owned businesses. We do not collect precise GPS coordinates unless specifically required for a feature you choose to use.
            </p>

            <h3 className="text-xl font-medium mb-3">Payment and Subscription Data</h3>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>Subscription Information:</strong> Subscription tier, status, billing cycle, and subscription dates</li>
              <li><strong>Payment Processor Data:</strong> We work with third-party payment processors (Stripe, Apple App Store, Google Play) who handle payment information securely</li>
              <li><strong>Transaction Records:</strong> Purchase history, refunds, and subscription changes for account management</li>
              <li><strong>Billing Information:</strong> Stored securely by our payment processors, not directly by us</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">User Content</h3>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>Photos and Images:</strong> Business logos, banners, and product images uploaded by business owners</li>
              <li><strong>Business Information:</strong> Descriptions, categories, and other business details</li>
              <li><strong>Reviews and Ratings:</strong> Customer feedback and business reviews</li>
              <li><strong>Customer Support:</strong> Information provided in support requests or feedback forms</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Usage and Analytics Data</h3>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>App Interactions:</strong> QR code scans, business visits, loyalty point activities</li>
              <li><strong>Account Identifiers:</strong> Unique user IDs for account management</li>
              <li><strong>Performance Data:</strong> App performance metrics and crash reports to improve user experience</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li>Provide and maintain our marketplace services</li>
              <li>Facilitate connections between customers and Black-owned businesses</li>
              <li>Process QR code scans and loyalty point transactions</li>
              <li>Process subscription payments and manage subscription services</li>
              <li>Send subscription-related notifications and updates</li>
              <li>Handle subscription renewals, cancellations, and refunds</li>
              <li>Send important service notifications and updates</li>
              <li>Improve app functionality and user experience</li>
              <li>Provide customer support</li>
              <li>Verify business authenticity and maintain marketplace quality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment Processing and Subscription Management</h2>
            <p className="text-gray-600 mb-4">
              We use trusted third-party payment processors to handle subscription billing and payments:
            </p>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>Stripe:</strong> Processes credit card payments and manages subscription billing for web users</li>
              <li><strong>Apple App Store:</strong> Handles in-app purchases and subscriptions for iOS users</li>
              <li><strong>Google Play:</strong> Manages billing for Android app users</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Subscription Notifications:</strong> We receive automated notifications from payment processors about subscription events (renewals, cancellations, payment failures) to maintain accurate account status and provide seamless service. These notifications help us:
            </p>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li>Update your subscription status in real-time</li>
              <li>Provide appropriate access to premium features</li>
              <li>Send you relevant notifications about your subscription</li>
              <li>Handle subscription issues promptly</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Business Directory:</strong> Business information is publicly displayed to help customers discover Black-owned businesses</li>
              <li><strong>Service Providers:</strong> With trusted third-party services (like Supabase for data storage, Stripe for payments) that help us operate the app</li>
              <li><strong>Payment Processors:</strong> Subscription and payment data is shared with our payment processors (Stripe, Apple, Google) as necessary to process transactions and manage subscriptions</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights and Choices</h2>
            <ul className="text-gray-600 mb-4 ml-6 list-disc">
              <li><strong>Access and Update:</strong> View and update your profile information at any time</li>
              <li><strong>Subscription Management:</strong> Manage your subscription through our app or directly through your payment provider (Apple App Store, Google Play, or Stripe)</li>
              <li><strong>Location Services:</strong> Control location permissions through your device settings</li>
              <li><strong>Account Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Communication Preferences:</strong> Opt out of non-essential communications</li>
              <li><strong>Data Portability:</strong> Request a copy of your personal data</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission, and regular security assessments. Payment information is secured by our payment processors using industry-standard encryption and security protocols. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Subscription data is retained as long as your account is active and for a reasonable period thereafter for customer service and legal compliance purposes. Business listings may remain active until the business owner requests removal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes affecting subscription services or payment processing will be communicated via email or in-app notification. Your continued use of our services after any changes constitutes acceptance of the updated policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="text-gray-600">
              <p>Email: privacy@mansamusamarketplace.com</p>
              <p>Subject Line: Privacy Policy Inquiry</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-600">
              As part of our mission to empower Black-owned businesses and strengthen economic communities, we are committed to maintaining your trust through transparent and responsible data practices. Your privacy is essential to achieving our shared goals of economic empowerment and community building.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
