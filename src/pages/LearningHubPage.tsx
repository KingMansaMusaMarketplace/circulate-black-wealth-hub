import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, TrendingUp, Users, DollarSign, Building2, Heart, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const LearningHubPage = () => {
  const learningCategories = [
    {
      title: "Financial Empowerment",
      description: "Build wealth and financial literacy in our community",
      icon: <DollarSign className="h-8 w-8" />,
      topics: [
        "Understanding Credit & Building Credit Score",
        "Savings & Investment Strategies",
        "Creating Multiple Income Streams",
        "Estate Planning & Wealth Transfer"
      ],
      gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
      iconColor: "text-emerald-600",
      accentColor: "border-emerald-500/50",
      comingSoon: false
    },
    {
      title: "Business Growth",
      description: "Resources to help Black-owned businesses thrive",
      icon: <TrendingUp className="h-8 w-8" />,
      topics: [
        "Marketing Your Business Effectively",
        "Managing Cash Flow & Finances",
        "Scaling Your Business",
        "Building a Strong Brand"
      ],
      gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
      iconColor: "text-purple-600",
      accentColor: "border-purple-500/50",
      comingSoon: false
    },
    {
      title: "Community Economics",
      description: "Understanding the power of circulating Black dollars",
      icon: <Users className="h-8 w-8" />,
      topics: [
        "The Multiplier Effect in Communities",
        "How Economic Circulation Creates Jobs",
        "Supporting Local vs Corporate Businesses",
        "Building Generational Wealth Together"
      ],
      gradient: "from-amber-500/20 via-orange-500/20 to-red-500/20",
      iconColor: "text-amber-600",
      accentColor: "border-amber-500/50",
      comingSoon: false
    },
    {
      title: "Marketplace Mastery",
      description: "Get the most out of Mansa Musa Marketplace",
      icon: <Building2 className="h-8 w-8" />,
      topics: [
        "How to Use QR Code Rewards",
        "Tracking Your Community Impact",
        "Finding the Best Black-Owned Businesses",
        "Earning & Redeeming Loyalty Points"
      ],
      gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
      iconColor: "text-blue-600",
      accentColor: "border-blue-500/50",
      comingSoon: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Learning Hub - Mansa Musa Marketplace</title>
        <meta name="description" content="Educational resources for financial empowerment, business growth, and building Black wealth through community support." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="container-custom mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 rounded-full mb-6 shadow-lg">
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">Empowerment Through Education</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Learning Hub
                </span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Access resources, guides, and knowledge to build wealth, grow your business, and strengthen our community through economic empowerment.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800">
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">💰 Financial Growth</span>
                </div>
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">📈 Business Success</span>
                </div>
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">🤝 Community Power</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Categories */}
        <section className="py-12 px-4">
          <div className="container-custom mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {learningCategories.map((category, index) => (
                <Card key={index} className={`relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 ${category.accentColor} bg-gradient-to-br ${category.gradient} backdrop-blur-sm hover:scale-[1.02]`}>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 bg-white/80 dark:bg-gray-800/80 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg ${category.iconColor}`}>
                        {React.cloneElement(category.icon as React.ReactElement, { className: `h-8 w-8 ${category.iconColor}` })}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-white">{category.title}</CardTitle>
                        <CardDescription className="text-base text-gray-700 dark:text-gray-300">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                      <ul className="space-y-3">
                        {category.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
                            <div className={`p-1 ${category.iconColor} bg-white/80 dark:bg-gray-700/80 rounded-lg mt-0.5 flex-shrink-0`}>
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {category.comingSoon && (
                      <div className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full inline-block shadow-lg">
                        <span className="text-sm font-bold text-white">✨ Coming Soon</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 border-none shadow-2xl">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi1oMnYtMmgtMnptMCA0djJoMnYtMmgtMnptLTItMnYyaDJ2LTJoLTJ6bTAtMnYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse" />
              </div>
              
              {/* Decorative Orbs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <CardContent className="relative z-10 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-white/30">
                    <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                    <span className="text-sm font-bold text-white">Start Your Journey Today</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                    Ready to Build Wealth & Empower Your Community?
                  </h2>
                  <p className="text-xl text-white/95 mb-10 leading-relaxed drop-shadow">
                    Join thousands of entrepreneurs and community members learning, growing, and prospering together through economic empowerment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-purple-700 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-white/50">
                      <Link to="/directory">
                        <Building2 className="mr-2 h-5 w-5" />
                        Explore Businesses
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-yellow-300/50">
                      <Link to="/how-it-works">
                        <Heart className="mr-2 h-5 w-5" />
                        Learn How It Works
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container-custom mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">More Ways to Learn & Grow</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/community" className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-mansagold/50">
                    <CardContent className="p-6 text-center">
                      <Users className="h-10 w-10 text-mansagold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2">Join the Community</h3>
                      <p className="text-sm text-muted-foreground">Connect with other members</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/impact" className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-mansagold/50">
                    <CardContent className="p-6 text-center">
                      <Heart className="h-10 w-10 text-mansagold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2">Track Your Impact</h3>
                      <p className="text-sm text-muted-foreground">See your community contribution</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/help" className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-mansagold/50">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-10 w-10 text-mansagold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2">Get Support</h3>
                      <p className="text-sm text-muted-foreground">Find answers to your questions</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LearningHubPage;
