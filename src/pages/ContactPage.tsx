
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
          inquiry_type: 'general'
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <MessageCircle className="h-16 w-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Contact Us
            </h1>
            <p className="text-xl text-blue-200">
              We'd love to hear from you! Get in touch with our team
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Get in Touch
                </h2>
                
                {/* Email Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                      <Mail className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Email Us</p>
                      <a href="mailto:contact@mansamusamarketplace.com" className="text-blue-300 hover:text-yellow-400 transition-colors">
                        contact@mansamusamarketplace.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                      <Phone className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Call Us</p>
                      <a href="tel:3127096006" className="text-green-300 hover:text-yellow-400 transition-colors">
                        312.709.6006
                      </a>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                      <MapPin className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Visit Us</p>
                      <p className="text-purple-300">
                        1000 E. 111th Street, Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Send className="h-6 w-6 text-yellow-400" />
                    Send us a Message
                  </h3>
                </div>
                <div className="p-6">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="rounded-full bg-green-500/20 p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Thank You!</h3>
                      <p className="text-white/70 mb-6">
                        Your message has been sent successfully. We'll get back to you soon.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <Label htmlFor="name" className="text-base font-semibold text-white">Name</Label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500/50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-base font-semibold text-white">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500/50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-base font-semibold text-white">Message</Label>
                        <Textarea 
                          id="message"
                          rows={5} 
                          placeholder="Tell us what's on your mind..."
                          value={formData.message}
                          onChange={handleChange}
                          className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500/50 resize-none"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold py-6 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
