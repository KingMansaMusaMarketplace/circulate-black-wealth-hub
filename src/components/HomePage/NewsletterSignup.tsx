import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, TrendingUp, Bell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const { count } = await supabase
          .from('email_subscriptions')
          .select('*', { count: 'exact', head: true });
        setSubscriberCount(count || 0);
      } catch (error) {
        console.error('Error fetching subscriber count:', error);
      }
    };
    fetchSubscriberCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the email subscription in the database
      const { error } = await supabase
        .from('email_subscriptions')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: 'homepage_newsletter',
            subscribed_at: new Date().toISOString()
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          toast.success('You\'re already subscribed!');
          setIsSubscribed(true);
        } else {
          throw error;
        }
      } else {
        toast.success('Welcome to our community! Check your email for updates.');
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                You're All Set!
              </h3>
              <p className="text-white/90">
                We'll keep you updated on new businesses, special offers, and community events.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-600">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  <Bell className="mr-2 h-4 w-4" />
                  Stay Connected
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get Weekly Updates
                </h2>
                <p className="text-white/90 mb-6">
                  Join our community and receive:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">
                      New business spotlights and exclusive discounts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">
                      Community events and networking opportunities
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">
                      Success stories and business growth tips
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">
                      Early access to new features and partnerships
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe for Free'}
                  </Button>
                  <p className="text-xs text-white/70 text-center">
                    No spam, ever. Unsubscribe anytime with one click.
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <Sparkles className="w-4 h-4 text-green-300" />
                    <span className="text-sm text-white/80">
                      {subscriberCount > 0 
                        ? `Join ${subscriberCount} ${subscriberCount === 1 ? 'subscriber' : 'subscribers'}`
                        : 'Be among the first to join'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
