
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
  ExternalLink
} from 'lucide-react';

const AccessibilityPage: React.FC = () => {
  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      <Helmet>
        <title>Accessibility | Mansa Musa Marketplace</title>
        <meta name="description" content="Learn about accessibility features and support at Mansa Musa Marketplace. We're committed to making economic empowerment accessible to everyone." />
      </Helmet>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-mansagold/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mansagold/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 mb-8 shadow-2xl animate-fade-in text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                <Accessibility className="h-10 w-10 text-mansagold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Accessibility at Mansa Musa Marketplace
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-body">
              We believe economic empowerment should be accessible to everyone in the Black community, regardless of ability.
            </p>
          </div>

          {/* Our Commitment */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 mb-6 shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                <Accessibility className="h-6 w-6 text-mansagold" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Our Commitment</h2>
            </div>
            <p className="text-white/80 leading-relaxed text-lg font-body">
              At Mansa Musa Marketplace, accessibility isn't an afterthought—it's fundamental to our mission. 
              We're committed to ensuring that all members of our community can fully participate in the 
              economic empowerment we're building together. Our platform is designed to work seamlessly 
              with assistive technologies and accommodate users with diverse needs.
            </p>
          </div>

          {/* Supported Features */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 mb-6 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                <Type className="h-6 w-6 text-mansagold" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Supported Accessibility Features</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* VoiceOver Support */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30 flex-shrink-0">
                    <Eye className="h-5 w-5 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">VoiceOver Support</h3>
                    <p className="text-white/70 text-sm">
                      Full screen reader compatibility for browsing businesses, scanning QR codes, and managing your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Control */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30 flex-shrink-0">
                    <Mic className="h-5 w-5 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Voice Control</h3>
                    <p className="text-white/70 text-sm">
                      Navigate and interact with our app using voice commands. All buttons and controls respond to voice input.
                    </p>
                  </div>
                </div>
              </div>

              {/* Large Text Support */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30 flex-shrink-0">
                    <Type className="h-5 w-5 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Large Text Support</h3>
                    <p className="text-white/70 text-sm">
                      All text scales automatically with your device's text size settings for improved readability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark Interface */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30 flex-shrink-0">
                    <Moon className="h-5 w-5 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Dark Interface</h3>
                    <p className="text-white/70 text-sm">
                      Automatic support for system dark mode preferences to reduce eye strain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sufficient Contrast */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30 flex-shrink-0">
                    <Contrast className="h-5 w-5 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Sufficient Contrast</h3>
                    <p className="text-white/70 text-sm">
                      Our design meets WCAG contrast guidelines for enhanced visibility and readability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30 flex-shrink-0">
                    <Zap className="h-5 w-5 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Reduced Motion</h3>
                    <p className="text-white/70 text-sm">
                      Respects motion sensitivity preferences by minimizing animations when requested.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use These Features */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 mb-6 shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                <Zap className="h-6 w-6 text-mansagold" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">How to Enable These Features</h2>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                On iPhone/iPad:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-mansagold font-bold mt-0.5">→</span>
                  <span className="text-white/80">VoiceOver: Settings → Accessibility → VoiceOver</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-mansagold font-bold mt-0.5">→</span>
                  <span className="text-white/80">Voice Control: Settings → Accessibility → Voice Control</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-mansagold font-bold mt-0.5">→</span>
                  <span className="text-white/80">Large Text: Settings → Display & Brightness → Text Size</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-mansagold font-bold mt-0.5">→</span>
                  <span className="text-white/80">Dark Mode: Settings → Display & Brightness → Dark</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-mansagold font-bold mt-0.5">→</span>
                  <span className="text-white/80">Reduce Motion: Settings → Accessibility → Motion → Reduce Motion</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact and Feedback */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                  <Mail className="h-5 w-5 text-mansagold" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Need Help?</h3>
              </div>
              <p className="text-white/80 mb-4">
                If you need assistance using our accessibility features or encounter any barriers, we're here to help.
              </p>
              <div className="space-y-3">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/80">
                    <strong className="text-mansagold">📧 Email:</strong> Thomas@1325.AI
                  </p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/80">
                    <strong className="text-mansagold">⏱️ Response Time:</strong> Within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                  <ExternalLink className="h-5 w-5 text-mansagold" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Feedback & Suggestions</h3>
              </div>
              <p className="text-white/80 mb-4">
                We continuously improve our accessibility. Your feedback helps us build a more inclusive platform.
              </p>
              <a 
                href="mailto:Thomas@1325.AI?subject=Accessibility Feedback"
                className="w-full"
              >
                <Button 
                  className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold"
                  type="button"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Feedback
                </Button>
              </a>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
                <ExternalLink className="h-6 w-6 text-mansagold" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Additional Resources</h2>
            </div>
            <p className="text-white/80 mb-4">
              Learn more about accessibility features and best practices:
            </p>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://support.apple.com/accessibility/" 
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-5 w-5 text-mansagold group-hover:scale-110 transition-transform" />
                  <span className="text-white font-semibold group-hover:text-mansagold transition-colors">
                    Apple Accessibility Support
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.w3.org/WAI/WCAG21/quickref/" 
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-5 w-5 text-mansagold group-hover:scale-110 transition-transform" />
                  <span className="text-white font-semibold group-hover:text-mansagold transition-colors">
                    Web Content Accessibility Guidelines
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;
