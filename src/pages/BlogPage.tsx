
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Blog - Mansa Musa Marketplace</title>
        <meta name="description" content="Read the latest insights, stories, and updates from the Mansa Musa Marketplace community about Black economic empowerment and business success." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-mansagold/20 to-amber-500/20 rounded-full backdrop-blur-sm border border-mansagold/30 shadow-lg shadow-mansagold/20 animate-pulse">
                  <BookOpen className="h-12 w-12 text-mansagold" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Mansa Musa Marketplace</span>
                <span className="text-white"> Blog</span> 📚
              </h1>
              <p className="text-xl text-blue-100/90 max-w-2xl mx-auto font-medium">
                Stories, insights, and updates from our community of entrepreneurs 
                and supporters building Black economic empowerment ✨
              </p>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-white">Coming </span>
                  <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Soon</span> 🚀
                </h2>
                <p className="text-blue-100/90 max-w-2xl mx-auto text-lg">
                  We're preparing valuable content about economic empowerment, 
                  business success stories, and community impact. Stay tuned!
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {comingSoonPosts.map((post, index) => {
                  const gradients = [
                    { badge: 'from-mansablue to-blue-600', icon: 'text-mansablue' },
                    { badge: 'from-green-500 to-emerald-600', icon: 'text-green-400' },
                    { badge: 'from-mansagold to-amber-500', icon: 'text-mansagold' }
                  ];
                  const style = gradients[index % gradients.length];
                  
                  return (
                    <Card key={index} className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 hover:shadow-xl hover:shadow-mansagold/20 transition-all duration-300 hover:scale-105">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold text-white bg-gradient-to-r ${style.badge} px-3 py-1.5 rounded-full shadow-lg`}>
                            {post.category}
                          </span>
                          <span className="text-xs font-semibold text-orange-300 bg-orange-500/20 border border-orange-500/30 px-2 py-1 rounded-full">Coming Soon</span>
                        </div>
                        <CardTitle className="text-lg text-white font-bold">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-100/90 text-sm mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-blue-200/70">
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
              <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:shadow-xl hover:shadow-mansagold/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-block mb-4">
                    <div className="p-3 bg-gradient-to-br from-mansagold to-amber-500 rounded-xl shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    <span className="text-white">Stay </span>
                    <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Updated</span> 📬
                  </h3>
                  <p className="text-blue-100/90 mb-6 max-w-md mx-auto text-lg">
                    Be the first to know when we publish new articles about 
                    economic empowerment and business success.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow bg-slate-900/60 border-white/10 text-white placeholder:text-blue-200/50 focus:border-mansagold"
                      required
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-white font-semibold shadow-lg shadow-mansagold/30"
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
