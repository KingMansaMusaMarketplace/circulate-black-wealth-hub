
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';

const BlogPage = () => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Blog - Mansa Musa Marketplace</title>
        <meta name="description" content="Read the latest insights, stories, and updates from the Mansa Musa Marketplace community about Black economic empowerment and business success." />
      </Helmet>

      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-mansablue py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-mansagold rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-mansablue" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Mansa Musa Marketplace Blog
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Stories, insights, and updates from our community of entrepreneurs 
                and supporters building Black economic empowerment.
              </p>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-mansablue mb-4">Coming Soon</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're preparing valuable content about economic empowerment, 
                  business success stories, and community impact. Stay tuned!
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {comingSoonPosts.map((post, index) => (
                  <Card key={index} className="border-mansagold/20 hover:border-mansagold/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-mansagold bg-mansagold/10 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">Coming Soon</span>
                      </div>
                      <CardTitle className="text-lg text-mansablue-dark">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Newsletter Signup */}
              <Card className="bg-white border-mansagold/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-mansablue mb-4">
                    Stay Updated
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Be the first to know when we publish new articles about 
                    economic empowerment and business success.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mansablue"
                    />
                    <Button className="bg-mansablue hover:bg-mansablue-dark text-white">
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
