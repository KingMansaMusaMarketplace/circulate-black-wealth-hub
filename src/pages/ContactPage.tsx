
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-mansablue via-primary to-mansagold text-white">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
                <MessageCircle className="h-16 w-16 text-mansagold" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent">
              Contact Us 📧
            </h1>
            <p className="text-xl text-white/90 font-medium">
              We'd love to hear from you! Get in touch with our team ✨
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent mb-8">
                Get in Touch 🤝
              </h2>
              
              {/* Email Card */}
              <Card className="hover:shadow-xl transition-all hover:scale-105 border-2 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700 mb-1">Email Us</p>
                      <a href="mailto:contact@mansamusamarketplace.com" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        contact@mansamusamarketplace.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Card */}
              <Card className="hover:shadow-xl transition-all hover:scale-105 border-2 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700 mb-1">Call Us</p>
                      <a href="tel:3127096006" className="text-green-600 hover:text-green-800 font-medium hover:underline">
                        312.709.6006
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Card */}
              <Card className="hover:shadow-xl transition-all hover:scale-105 border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-700 mb-1">Visit Us</p>
                      <p className="text-purple-600 font-medium">
                        1000 E. 111th Street, Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-white via-primary/5 to-mansablue/5 shadow-2xl">
              <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-mansablue/5">
                <CardTitle className="text-2xl bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent flex items-center gap-2">
                  <Send className="h-6 w-6 text-primary" />
                  Send us a Message 💬
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Your full name"
                      className="mt-2 border-2 border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com"
                      className="mt-2 border-2 border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-base font-semibold">Message</Label>
                    <Textarea 
                      id="message"
                      rows={5} 
                      placeholder="Tell us what's on your mind..."
                      className="mt-2 border-2 border-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-mansablue via-primary to-mansagold hover:opacity-90 text-white font-semibold py-6 text-lg shadow-lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message ✨
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
