
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const BlogPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const comingSoonPosts = [
    {
      title: "The Economic Impact of Black Dollar Circulation",
      excerpt: "Exploring how every dollar spent at Black-owned businesses creates a multiplier effect in our communities.",
      author: "Economic Research Team",
      readTime: "8 min read",
      category: "Economic Impact"
    },
    {
      title: "Success Stories: Businesses Thriving on Mansa Musa Marketplace",
      excerpt: "Real stories from entrepreneurs who have grown their businesses through our platform.",
      author: "Community Team",
      readTime: "5 min read",
      category: "Success Stories"
    },
    {
      title: "Building Generational Wealth Through Black Business Support",
      excerpt: "How supporting Black-owned businesses creates lasting economic change for future generations.",
      author: "Wealth Building Team",
      readTime: "10 min read",
      category: "Wealth Building"
    }
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Insert into email_subscriptions table
      const { error: insertError } = await supabase
        .from('email_subscriptions')
        .insert({ 
          email,
          source: 'blog_newsletter'
        });

      if (insertError) {
        // Check if already subscribed
        if (insertError.code === '23505') {
          toast.success('You are already subscribed!');
          setEmail('');
          return;
        }
        throw insertError;
      }

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-newsletter-welcome', {
        body: { email }
      });

      if (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the whole process if email fails
        toast.success('Successfully subscribed! Welcome email will arrive shortly.');
      } else {
        toast.success('Successfully subscribed! Check your email for a welcome message.');
      }
      
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Blog - Mansa Musa Marketplace</title>
        <meta name="description" content="Read the latest insights, stories, and updates from the Mansa Musa Marketplace community about Black economic empowerment and business success." />
      </Helmet>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-primary to-pink-600 text-white py-20">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
                  <BookOpen className="h-12 w-12 text-yellow-300" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Mansa Musa Marketplace Blog 📚
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                Stories, insights, and updates from our community of entrepreneurs 
                and supporters building Black economic empowerment ✨
              </p>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-primary to-pink-600 bg-clip-text text-transparent mb-4">
                  Coming Soon 🚀
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  We're preparing valuable content about economic empowerment, 
                  business success stories, and community impact. Stay tuned!
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {comingSoonPosts.map((post, index) => {
                  const gradients = [
                    { card: 'from-blue-50 via-cyan-50 to-blue-50', border: 'border-blue-200', badge: 'from-blue-500 to-cyan-600', text: 'text-blue-700' },
                    { card: 'from-green-50 via-emerald-50 to-green-50', border: 'border-green-200', badge: 'from-green-500 to-emerald-600', text: 'text-green-700' },
                    { card: 'from-purple-50 via-pink-50 to-purple-50', border: 'border-purple-200', badge: 'from-purple-500 to-pink-600', text: 'text-purple-700' }
                  ];
                  const style = gradients[index % gradients.length];
                  
                  return (
                    <Card key={index} className={`border-2 bg-gradient-to-br ${style.card} ${style.border} hover:shadow-xl transition-all hover:scale-105`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold text-white bg-gradient-to-r ${style.badge} px-3 py-1.5 rounded-full shadow-lg`}>
                            {post.category}
                          </span>
                          <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Coming Soon</span>
                        </div>
                        <CardTitle className={`text-lg ${style.text} font-bold`}>
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-foreground/60">
                          <div className="flex items-center gap-1 font-medium">
                            <User className="h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Newsletter Signup */}
              <Card className="border-2 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 border-indigo-200 hover:shadow-xl transition-all">
                <CardContent className="p-8 text-center">
                  <div className="inline-block mb-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
                    Stay Updated 📬
                  </h3>
                  <p className="text-foreground/80 mb-6 max-w-md mx-auto text-lg">
                    Be the first to know when we publish new articles about 
                    economic empowerment and business success.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow border-2 border-indigo-200 focus:border-indigo-500"
                      required
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white font-semibold shadow-lg"
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
