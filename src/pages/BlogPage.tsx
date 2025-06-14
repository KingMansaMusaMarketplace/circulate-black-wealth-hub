
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BlogPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Blog - Mansa Musa Marketplace</title>
        <meta name="description" content="Read the latest news, insights, and stories from the Mansa Musa Marketplace community." />
      </Helmet>

      <Navbar />
      <main className="flex-grow">
        <div className="bg-mansablue py-16">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Blog</h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Stay updated with the latest news, insights, and stories from our community.
            </p>
          </div>
        </div>
        
        <div className="py-16">
          <div className="container-custom">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our blog is currently under development. Check back soon for the latest updates, 
                  success stories, and insights from the Mansa Musa Marketplace community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
