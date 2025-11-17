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

      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-teal-100 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-400 to-purple-400 opacity-40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-40 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 opacity-30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Floating Shapes */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }} />
            <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }} />
          </div>
          
          <div className="container-custom mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500/30 via-purple-500/30 via-blue-500/30 to-emerald-500/30 backdrop-blur-sm border-2 border-white/30 rounded-full mb-6 shadow-xl animate-pulse">
                <GraduationCap className="h-6 w-6 text-purple-700 dark:text-purple-300 animate-bounce" />
                <span className="text-sm font-bold bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">✨ Empowerment Through Education ✨</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg">
                  Learning Hub
                </span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Access resources, guides, and knowledge to build wealth, grow your business, and strengthen our community through economic empowerment.
              </p>
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
                <div className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 backdrop-blur-sm rounded-full border-2 border-emerald-300 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-white">💰 Financial Growth</span>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm rounded-full border-2 border-purple-300 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-white">📈 Business Success</span>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 backdrop-blur-sm rounded-full border-2 border-blue-300 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-white">🤝 Community Power</span>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-sm rounded-full border-2 border-orange-300 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-white">🌟 Impact Maker</span>
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
            <Card className="relative overflow-hidden bg-gradient-to-r from-pink-700 via-purple-700 via-blue-700 to-teal-700 border-none shadow-2xl">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi1oMnYtMmgtMnptMCA0djJoMnYtMmgtMnptLTItMnYyaDJ2LTJoLTJ6bTAtMnYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse" />
              </div>
              
              {/* Decorative Orbs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-pink-500 to-yellow-500 opacity-20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              <CardContent className="relative z-10 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 backdrop-blur-sm rounded-full mb-6 shadow-xl border-2 border-yellow-300/50">
                    <Sparkles className="h-6 w-6 text-yellow-200 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-sm font-black text-white">✨ Start Your Journey Today ✨</span>
                    <Sparkles className="h-6 w-6 text-yellow-200 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl">
                    Ready to Build Wealth & Empower Your Community?
                  </h2>
                  <p className="text-xl text-white mb-10 leading-relaxed drop-shadow-lg font-medium">
                    Join thousands of entrepreneurs and community members learning, growing, and prospering together through economic empowerment. 🚀
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-purple-700 font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-110 border-4 border-white/50 text-lg">
                      <Link to="/directory">
                        <Building2 className="mr-2 h-6 w-6" />
                        Explore Businesses
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-110 border-4 border-yellow-300/50 text-lg">
                      <Link to="/how-it-works">
                        <Heart className="mr-2 h-6 w-6 animate-pulse" />
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
        <section className="py-16 px-4 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30" />
          
          <div className="container-custom mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  More Ways to Learn & Grow
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">Discover additional resources to accelerate your journey</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/community" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:scale-105 hover:rotate-1">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-purple-700 dark:text-purple-300">Join the Community</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Connect with other members</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/impact" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:scale-105 hover:rotate-1">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg">
                        <Heart className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-blue-700 dark:text-blue-300">Track Your Impact</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">See your community contribution</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/help" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:scale-105 hover:rotate-1">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg">
                        <BookOpen className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-emerald-700 dark:text-emerald-300">Get Support</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Find answers to your questions</p>
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
