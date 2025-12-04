
import React from 'react';
import { FileText, CheckCircle, Key, Shield, AlertTriangle, Mail, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Acceptance of Terms",
      content: "By accessing and using Mansa Musa Marketplace, you accept and agree to be bound by the terms and provision of this agreement. Your continued use of the platform constitutes acceptance of any updates or modifications to these terms.",
      iconBg: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Use License",
      content: "Permission is granted to temporarily use Mansa Musa Marketplace for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or remove any copyright or other proprietary notations.",
      iconBg: "from-purple-500 to-pink-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password and for all activities that occur under your account.",
      iconBg: "from-green-500 to-emerald-600"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Prohibited Uses",
      content: "You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any local, state, national, or international law, infringe upon the rights of others, or transmit any harmful code or viruses. Violations will result in immediate account termination.",
      iconBg: "from-orange-500 to-yellow-600"
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Limitation of Liability",
      content: "In no event shall Mansa Musa Marketplace be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website. We make no warranties about the accuracy or completeness of the content.",
      iconBg: "from-red-500 to-rose-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us at legal@mansamusamarketplace.com. We're here to help clarify any concerns you may have about our terms and your rights as a user.",
      iconBg: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
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
              Terms of Service 📜
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

          {/* Footer Notice */}
          <Card className="mt-12 backdrop-blur-xl bg-yellow-500/10 border border-yellow-400/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400 mb-2 text-lg">Important Notice ⚠️</h3>
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
