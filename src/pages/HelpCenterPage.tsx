
import React from 'react';
import { Helmet } from 'react-helmet';
import { Search, Book, MessageCircle, Phone, Headphones, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const HelpCenterPage = () => {
  const helpCategories = [
    {
      icon: <Book className="h-8 w-8" />,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      action: "View Docs",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Community",
      description: "Connect with other users and get answers",
      action: "Join Community",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Support",
      description: "Get direct help from our support team",
      action: "Contact Support",
      gradient: "from-mansagold to-amber-500"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Help Center | Mansa Musa Marketplace</title>
        <meta name="description" content="Get help with Mansa Musa Marketplace" />
      </Helmet>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/10 shadow-lg animate-pulse">
              <HelpCircle className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white font-display">
            Help <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-xl text-blue-200/80">
            Find answers to your questions and get the support you need
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <div className="text-center mb-12">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="text" 
                placeholder="Search for help..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-800/60 backdrop-blur-xl border-white/10 text-white placeholder:text-white/40 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
          </div>
          
          {/* Help Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {helpCategories.map((category, index) => (
              <Card 
                key={index}
                className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 bg-gradient-to-br ${category.gradient} rounded-2xl shadow-lg`}>
                    {React.cloneElement(category.icon as React.ReactElement, { className: "h-8 w-8 text-white" })}
                  </div>
                  <CardTitle className="text-xl font-bold text-white">{category.title}</CardTitle>
                  <CardDescription className="text-blue-200/70">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <Button 
                    className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white font-semibold shadow-lg`}
                  >
                    {category.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-mansagold border-0 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <CardContent className="relative p-8 text-center">
              <div className="inline-block mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Still Need Help?</h2>
              <p className="mb-6 text-white/90 text-lg">Our support team is here to help you succeed</p>
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 font-bold shadow-lg px-8"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
