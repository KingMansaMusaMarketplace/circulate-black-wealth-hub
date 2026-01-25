
import React from 'react';
import { FileText, CheckCircle, Key, Shield, AlertTriangle, Mail, Scale, Database, Bot, Users, Briefcase, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Acceptance of Terms",
      content: "By accessing and using Mansa Musa Marketplace, you accept and agree to be bound by the terms and provision of this agreement. Your continued use of the platform constitutes acceptance of any updates or modifications to these terms.",
      iconBg: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Ownership & Aggregate Insights",
      content: "While merchants retain full ownership of their specific business data (name, address, inventory, customer lists), Mansa Musa Marketplace owns all 'Aggregate Data' and 'AI-Derived Insights' generated from platform-wide activity. This includes anonymized trend reports, market analysis, spending patterns, and community economic impact metrics. This aggregate data may be used for research, reporting, and commercial purposes without individual attribution.",
      iconBg: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "License to Content",
      content: "By listing your business or posting content on Mansa Musa Marketplace, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your business names, logos, product images, descriptions, and promotional materials. This license enables us to operate the Proximity Notification system, populate the business directory, feature your content in the social feed, and promote the marketplace ecosystem.",
      iconBg: "from-green-500 to-emerald-600"
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Services Disclaimer",
      content: "Mansa Musa Marketplace provides AI-powered features including but not limited to: b2b-match (business matching), generate-business-insights, ai-recommendations, detect-fraud, and analyze-review-sentiment. These services are provided 'as-is' for informational purposes only. AI-generated suggestions, recommendations, and insights are NOT professional advice. The platform is NOT liable for any business decisions, financial outcomes, or actions taken based on AI-generated output. Users should exercise independent judgment and consult qualified professionals for business, legal, or financial decisions.",
      iconBg: "from-violet-500 to-purple-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Agent Non-Solicitation",
      content: "Merchants and businesses agree NOT to directly solicit, recruit, hire, or engage Mansa Musa Marketplace Sales Agents ('Ambassadors') for the purpose of bypassing the platform's commission structure. This prohibition extends for 24 months following any interaction with a Sales Agent through the platform. Violation of this clause may result in account termination and legal action to recover lost commissions and damages.",
      iconBg: "from-orange-500 to-red-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "User Accounts & Security",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.",
      iconBg: "from-teal-500 to-cyan-600"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Subscription & Transaction Fees",
      content: "Mansa Musa Marketplace operates on a multi-tier revenue model including: Business Subscriptions (Basic, Premium, Enterprise), Sponsor Subscriptions (Community, Corporate), Platform Transaction Fees, Sales Agent Commissions, B2B Marketplace Fees, Premium AI Features, and Verified Certification Fees. All fees are processed via Stripe Connect and Apple In-App Purchase (for iOS). Subscription fees are non-refundable except as required by applicable law or platform policies. Transaction fees are deducted automatically from applicable transactions.",
      iconBg: "from-emerald-500 to-green-600"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "B2B Marketplace Terms",
      content: "Businesses participating in the B2B Marketplace acknowledge that their inventory, capabilities, and service offerings will be 'discoverable' by other verified vendors. By opting into B2B features, you consent to automated matching via our b2b-match AI system. All B2B transactions, contracts, and agreements are between the participating businesses; Mansa Musa Marketplace acts solely as a facilitator and is not party to any B2B contracts.",
      iconBg: "from-sky-500 to-blue-600"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Prohibited Uses",
      content: "You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any local, state, national, or international law, infringe upon the rights of others, submit false verification documents, manipulate reviews or ratings, abuse the loyalty points system, or transmit any harmful code or viruses. Violations will result in immediate account termination and may be reported to appropriate authorities.",
      iconBg: "from-red-500 to-rose-600"
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Limitation of Liability",
      content: "In no event shall Mansa Musa Marketplace, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from: (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) AI-generated recommendations or insights; (iv) unauthorized access, use or alteration of your transmissions or content.",
      iconBg: "from-gray-500 to-slate-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us at Thomas@1325.AI. For urgent matters, you may also reach our compliance team at Thomas@1325.AI. We're here to help clarify any concerns you may have about our terms and your rights as a user.",
      iconBg: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Terms of Service | Mansa Musa Marketplace</title>
        <meta name="description" content="Terms of Service for Mansa Musa Marketplace - Your rights and responsibilities when using our platform." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="p-4 backdrop-blur-xl bg-white/10 rounded-full border border-white/20">
                <FileText className="h-16 w-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-200 font-medium mb-4">
              Understanding your rights and responsibilities
            </p>
            <p className="text-sm text-blue-300/80">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-lg text-blue-200">
              Please read these terms carefully before using our platform. By using Mansa Musa Marketplace, you agree to these terms and conditions.
            </p>
          </div>

          <div className="grid gap-6">
            {sections.map((section, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all backdrop-blur-xl bg-white/5 border border-white/10"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white font-bold">
                    <div className={`p-3 bg-gradient-to-br ${section.iconBg} rounded-xl shadow-lg`}>
                      {React.cloneElement(section.icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100/80 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legal & Compliance Badge */}
          <Card className="mt-12 backdrop-blur-xl bg-green-500/10 border border-green-400/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-green-400 mb-2 text-lg">Built for Trust & Compliance</h3>
                  <p className="text-green-100/80 leading-relaxed">
                    The Mansa Musa Marketplace infrastructure is built for CCPA and GDPR compliance. By utilizing Supabase Row-Level Security, we ensure that user data is mathematically isolated. Our Stripe Connect integration ensures that we never touch raw sensitive financial data, reducing our regulatory footprint while maximizing merchant security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Notice */}
          <Card className="mt-6 backdrop-blur-xl bg-yellow-500/10 border border-yellow-400/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400 mb-2 text-lg">Important Notice</h3>
                  <p className="text-yellow-100/80 leading-relaxed">
                    These terms may be updated from time to time. We will notify you of any significant changes via email or through a prominent notice on our platform. Your continued use after such modifications constitutes acceptance of the updated terms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
