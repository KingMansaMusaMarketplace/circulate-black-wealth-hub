
import React from 'react';
import { Cookie, ShieldCheck, BarChart3, Settings as SettingsIcon, Mail, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-600 text-white">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
                <Cookie className="h-16 w-16 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              Cookie Policy 🍪
            </h1>
            <p className="text-xl text-white/90 font-medium mb-4">
              Learn about how we use cookies to enhance your experience
            </p>
            <p className="text-sm text-white/80">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          
          {/* What Are Cookies */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                  <Info className="h-6 w-6 text-white" />
                </div>
                What Are Cookies 🔍
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They help us provide you with a better experience by remembering your preferences and improving our services.
              </p>
            </CardContent>
          </Card>

          {/* How We Use Cookies */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Cookie className="h-6 w-6 text-white" />
                </div>
                How We Use Cookies 🎯
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/50 p-5 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-700">Essential Cookies 🛡️</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed ml-11">
                  These cookies are necessary for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility.
                </p>
              </div>

              <div className="bg-white/50 p-5 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-700">Performance Cookies 📊</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed ml-11">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously.
                </p>
              </div>

              <div className="bg-white/50 p-5 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg flex-shrink-0">
                    <SettingsIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-700">Functional Cookies ⚙️</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed ml-11">
                  These cookies enable the website to provide enhanced functionality and personalization, 
                  such as remembering your login status and preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                Managing Cookies ⚙️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                You can control and manage cookies through your browser settings. Please note that disabling cookies 
                may affect the functionality of our website. Most browsers allow you to refuse cookies or delete 
                existing cookies.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="border-2 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 border-indigo-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-indigo-700 font-bold">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                Contact Us 📧
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about our Cookie Policy, please contact us at{' '}
                <a 
                  href="mailto:contact@mansamusamarketplace.com" 
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  contact@mansamusamarketplace.com
                </a>
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
