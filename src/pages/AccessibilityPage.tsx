
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  Eye, 
  Mic, 
  Type, 
  Moon, 
  Contrast,
  Zap,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

const AccessibilityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-mansablue-light/10 to-amber-50">
      <Helmet>
        <title>Accessibility | Mansa Musa Marketplace</title>
        <meta name="description" content="Learn about accessibility features and support at Mansa Musa Marketplace. We're committed to making economic empowerment accessible to everyone." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-mansablue via-blue-700 to-blue-800 rounded-3xl shadow-2xl p-12 mb-12 animate-fade-in">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                  <Accessibility className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Accessibility at Mansa Musa Marketplace ♿
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow">
                We believe economic empowerment should be accessible to everyone in the Black community, regardless of ability.
              </p>
            </div>
          </div>

          {/* Our Commitment */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-mansablue-light/20 border-blue-200 shadow-lg hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-mansablue to-blue-700 rounded-lg">
                  <Accessibility className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent">
                  Our Commitment
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                At Mansa Musa Marketplace, accessibility isn't an afterthought—it's fundamental to our mission. 
                We're committed to ensuring that all members of our community can fully participate in the 
                economic empowerment we're building together. Our platform is designed to work seamlessly 
                with assistive technologies and accommodate users with diverse needs.
              </p>
            </CardContent>
          </Card>

          {/* Supported Features */}
          <Card className="mb-8 bg-gradient-to-br from-amber-50 to-mansagold/10 border-amber-200 shadow-lg hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-mansagold to-amber-600 rounded-lg">
                  <Type className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">
                  Supported Accessibility Features
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">VoiceOver Support 👁️</h3>
                      <p className="text-blue-700 text-sm">
                        Full screen reader compatibility for browsing businesses, scanning QR codes, and managing your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex-shrink-0">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">Voice Control 🎤</h3>
                      <p className="text-green-700 text-sm">
                        Navigate and interact with our app using voice commands. All buttons and controls respond to voice input.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex-shrink-0">
                      <Type className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 mb-1">Large Text Support 📝</h3>
                      <p className="text-orange-700 text-sm">
                        All text scales automatically with your device's text size settings for improved readability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border border-indigo-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex-shrink-0">
                      <Moon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 mb-1">Dark Interface 🌙</h3>
                      <p className="text-indigo-700 text-sm">
                        Automatic support for system dark mode preferences to reduce eye strain.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex-shrink-0">
                      <Contrast className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-pink-900 mb-1">Sufficient Contrast 🎨</h3>
                      <p className="text-pink-700 text-sm">
                        Our design meets WCAG contrast guidelines for enhanced visibility and readability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex-shrink-0">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-yellow-900 mb-1">Reduced Motion ⚡</h3>
                      <p className="text-yellow-700 text-sm">
                        Respects motion sensitivity preferences by minimizing animations when requested.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Use These Features */}
          <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  How to Enable These Features
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    On iPhone/iPad:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-1">→</span>
                      <span className="text-emerald-800 font-medium">VoiceOver: Settings → Accessibility → VoiceOver</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-1">→</span>
                      <span className="text-emerald-800 font-medium">Voice Control: Settings → Accessibility → Voice Control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-1">→</span>
                      <span className="text-emerald-800 font-medium">Large Text: Settings → Display & Brightness → Text Size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-1">→</span>
                      <span className="text-emerald-800 font-medium">Dark Mode: Settings → Display & Brightness → Dark</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-1">→</span>
                      <span className="text-emerald-800 font-medium">Reduce Motion: Settings → Accessibility → Motion → Reduce Motion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact and Feedback */}
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold">
                    Need Help? 💬
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 mb-4 font-medium">
                  If you need assistance using our accessibility features or encounter any barriers, we're here to help.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong className="text-blue-700">📧 Email:</strong> contact@mansamusamarketplace.com
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong className="text-blue-700">⏱️ Response Time:</strong> Within 24 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent font-bold">
                    Feedback & Suggestions 💡
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-violet-800 mb-4 font-medium">
                  We continuously improve our accessibility. Your feedback helps us build a more inclusive platform.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.location.href = 'mailto:contact@mansamusamarketplace.com?subject=Accessibility Feedback'}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Feedback ✨
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <Card className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                  Additional Resources 📚
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-900 mb-4 font-medium">
                Learn more about accessibility features and best practices:
              </p>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://support.apple.com/accessibility/" 
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-200 hover:shadow-md transition-all group" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span className="text-amber-900 font-semibold group-hover:text-amber-700">
                      Apple Accessibility Support
                    </span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.w3.org/WAI/WCAG21/quickref/" 
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-200 hover:shadow-md transition-all group" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span className="text-amber-900 font-semibold group-hover:text-amber-700">
                      Web Content Accessibility Guidelines
                    </span>
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;
