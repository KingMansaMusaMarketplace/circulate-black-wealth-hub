
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
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
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Accessibility | Mansa Musa Marketplace</title>
        <meta name="description" content="Learn about accessibility features and support at Mansa Musa Marketplace. We're committed to making economic empowerment accessible to everyone." />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-mansablue rounded-full flex items-center justify-center">
                <Accessibility className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-mansablue mb-4">
              Accessibility at Mansa Musa Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We believe economic empowerment should be accessible to everyone in the Black community, regardless of ability.
            </p>
          </div>

          {/* Our Commitment */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-mansablue">Our Commitment</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                At Mansa Musa Marketplace, accessibility isn't an afterthought—it's fundamental to our mission. 
                We're committed to ensuring that all members of our community can fully participate in the 
                economic empowerment we're building together. Our platform is designed to work seamlessly 
                with assistive technologies and accommodate users with diverse needs.
              </p>
            </CardContent>
          </Card>

          {/* Supported Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-mansablue flex items-center">
                <Type className="h-6 w-6 mr-2" />
                Supported Accessibility Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-mansagold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">VoiceOver Support</h3>
                      <p className="text-gray-600 text-sm">
                        Full screen reader compatibility for browsing businesses, scanning QR codes, and managing your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mic className="h-5 w-5 text-mansagold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Voice Control</h3>
                      <p className="text-gray-600 text-sm">
                        Navigate and interact with our app using voice commands. All buttons and controls respond to voice input.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Type className="h-5 w-5 text-mansagold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Large Text Support</h3>
                      <p className="text-gray-600 text-sm">
                        All text scales automatically with your device's text size settings for improved readability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Moon className="h-5 w-5 text-mansagold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Dark Interface</h3>
                      <p className="text-gray-600 text-sm">
                        Automatic support for system dark mode preferences to reduce eye strain.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Contrast className="h-5 w-5 text-mansagold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Sufficient Contrast</h3>
                      <p className="text-gray-600 text-sm">
                        Our design meets WCAG contrast guidelines for enhanced visibility and readability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-mansagold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Reduced Motion</h3>
                      <p className="text-gray-600 text-sm">
                        Respects motion sensitivity preferences by minimizing animations when requested.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Use These Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-mansablue">How to Enable These Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">On iPhone/iPad:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>VoiceOver: Settings → Accessibility → VoiceOver</li>
                    <li>Voice Control: Settings → Accessibility → Voice Control</li>
                    <li>Large Text: Settings → Display & Brightness → Text Size</li>
                    <li>Dark Mode: Settings → Display & Brightness → Dark</li>
                    <li>Reduce Motion: Settings → Accessibility → Motion → Reduce Motion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact and Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-mansablue flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you need assistance using our accessibility features or encounter any barriers, we're here to help.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> accessibility@mansamusamarketplace.com
                  </p>
                  <p className="text-sm">
                    <strong>Response Time:</strong> Within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-mansablue">Feedback & Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We continuously improve our accessibility. Your feedback helps us build a more inclusive platform.
                </p>
                <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Feedback
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-mansablue">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <ul className="space-y-2">
                  <li>
                    <a href="https://support.apple.com/accessibility/" className="text-mansablue hover:underline" target="_blank" rel="noopener noreferrer">
                      Apple Accessibility Support
                    </a>
                  </li>
                  <li>
                    <a href="https://www.w3.org/WAI/WCAG21/quickref/" className="text-mansablue hover:underline" target="_blank" rel="noopener noreferrer">
                      Web Content Accessibility Guidelines
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccessibilityPage;
