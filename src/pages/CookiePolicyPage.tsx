
import React from 'react';
import { Cookie, ShieldCheck, BarChart3, Settings as SettingsIcon, Mail, Info } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="py-16 px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="p-4 bg-yellow-500/20 rounded-full backdrop-blur-sm">
                <Cookie className="h-16 w-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Cookie Policy
            </h1>
            <p className="text-xl text-blue-200 mb-4">
              Learn about how we use cookies to enhance your experience
            </p>
            <p className="text-sm text-white/60">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* What Are Cookies */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="flex items-center gap-3 text-white font-bold text-xl">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <Info className="h-6 w-6 text-blue-400" />
                  </div>
                  What Are Cookies
                </h2>
              </div>
              <div className="p-6">
                <p className="text-blue-200 leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They help us provide you with a better experience by remembering your preferences and improving our services.
                </p>
              </div>
            </div>

            {/* How We Use Cookies */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="flex items-center gap-3 text-white font-bold text-xl">
                  <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    <Cookie className="h-6 w-6 text-yellow-400" />
                  </div>
                  How We Use Cookies
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30 flex-shrink-0">
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-green-400">Essential Cookies</h3>
                  </div>
                  <p className="text-blue-200 leading-relaxed ml-11">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-400">Performance Cookies</h3>
                  </div>
                  <p className="text-blue-200 leading-relaxed ml-11">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30 flex-shrink-0">
                      <SettingsIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-yellow-400">Functional Cookies</h3>
                  </div>
                  <p className="text-blue-200 leading-relaxed ml-11">
                    These cookies enable the website to provide enhanced functionality and personalization, 
                    such as remembering your login status and preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="flex items-center gap-3 text-white font-bold text-xl">
                  <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    <SettingsIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  Managing Cookies
                </h2>
              </div>
              <div className="p-6">
                <p className="text-blue-200 leading-relaxed">
                  You can control and manage cookies through your browser settings. Please note that disabling cookies 
                  may affect the functionality of our website. Most browsers allow you to refuse cookies or delete 
                  existing cookies.
                </p>
              </div>
            </div>

            {/* Contact Us */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="flex items-center gap-3 text-white font-bold text-xl">
                  <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    <Mail className="h-6 w-6 text-yellow-400" />
                  </div>
                  Contact Us
                </h2>
              </div>
              <div className="p-6">
                <p className="text-blue-200 leading-relaxed">
                  If you have any questions about our Cookie Policy, please contact us at{' '}
                  <a 
                    href="mailto:contact@mansamusamarketplace.com" 
                    className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    contact@mansamusamarketplace.com
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
