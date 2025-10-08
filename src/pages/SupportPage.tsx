import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, MessageCircle, Book, Headphones, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SupportPage = () => {
  const supportOptions = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@mansamusamarketplace.com",
      action: "Send Email"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak with our support team directly",
      contact: "312.709.6006",
      action: "Call Now"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with us in real-time during business hours",
      contact: "Available Monday-Friday, 9AM-6PM CST",
      action: "Start Chat"
    }
  ];

  const faqCategories = [
    {
      title: "Account & Profile",
      questions: [
        "How do I create an account?",
        "How do I reset my password?",
        "How do I update my profile information?",
        "How do I delete my account?"
      ]
    },
    {
      title: "Business Directory",
      questions: [
        "How do I list my business?",
        "How do I update my business information?",
        "How do I verify my business?",
        "What are the listing requirements?"
      ]
    },
    {
      title: "QR Code & Rewards",
      questions: [
        "How do QR codes work?",
        "How do I earn loyalty points?",
        "How do I redeem rewards?",
        "What if a QR code doesn't work?"
      ]
    },
    {
      title: "Technical Issues",
      questions: [
        "App won't load or crashes",
        "Camera/QR scanner not working",
        "Location services issues",
        "Login/authentication problems"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Support Center - Mansa Musa Marketplace</title>
        <meta name="description" content="Get help with Mansa Musa Marketplace. Contact our support team, browse FAQs, and find solutions to common issues." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Support Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you make the most of Mansa Musa Marketplace. Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Support Options */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">How Can We Help You?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 text-primary flex justify-center">
                      {option.icon}
                    </div>
                    <CardTitle className="text-center">{option.title}</CardTitle>
                    <CardDescription className="text-center">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="font-medium text-center break-words">{option.contact}</p>
                    <Button className="w-full">{option.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.questions.map((question, qIndex) => (
                        <li key={qIndex}>
                          <button className="text-left hover:text-primary transition-colors text-sm">
                            {question}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* System Status */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  System Status & Service Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Support Hours
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM CST</li>
                      <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM CST</li>
                      <li><strong>Sunday:</strong> Closed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Current System Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">All systems operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Other ways to reach us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Mailing Address</p>
                      <p className="text-sm text-muted-foreground">
                        1000 E. 111th Street, Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">General Inquiries</p>
                      <p className="text-sm text-muted-foreground">
                        contact@mansamusamarketplace.com
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default SupportPage;