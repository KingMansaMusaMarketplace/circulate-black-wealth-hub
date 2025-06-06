
import React from 'react';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

const BlogPage = () => {
  return (
    <ResponsiveLayout
      title="Blog"
      description="Latest news and insights from Mansa Musa Marketplace"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mansablue mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest news, insights, and stories from our community
          </p>
        </div>

        <div className="grid gap-8">
          <article className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-mansablue mb-3">
              Building Economic Empowerment Through Technology
            </h2>
            <p className="text-gray-500 text-sm mb-4">Published on January 15, 2024</p>
            <p className="text-gray-600 mb-4">
              Discover how Mansa Musa Marketplace is revolutionizing the way we support 
              Black-owned businesses through innovative technology and community engagement.
            </p>
            <a href="#" className="text-mansagold hover:text-mansagold-dark font-medium">
              Read more →
            </a>
          </article>

          <article className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-mansablue mb-3">
              The Power of Loyalty Programs in Community Building
            </h2>
            <p className="text-gray-500 text-sm mb-4">Published on January 10, 2024</p>
            <p className="text-gray-600 mb-4">
              Learn how our gamified loyalty system creates meaningful connections between 
              customers and businesses while driving economic circulation.
            </p>
            <a href="#" className="text-mansagold hover:text-mansagold-dark font-medium">
              Read more →
            </a>
          </article>

          <article className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-mansablue mb-3">
              Success Stories: Businesses Thriving on Our Platform
            </h2>
            <p className="text-gray-500 text-sm mb-4">Published on January 5, 2024</p>
            <p className="text-gray-600 mb-4">
              Read inspiring stories from business owners who have grown their customer base 
              and increased revenue through the Mansa Musa Marketplace.
            </p>
            <a href="#" className="text-mansagold hover:text-mansagold-dark font-medium">
              Read more →
            </a>
          </article>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">More blog posts coming soon!</p>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default BlogPage;
