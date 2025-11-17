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
      gradient: "from-mansablue/20 via-blue-600/20 to-blue-800/20",
      iconColor: "text-mansagold",
      accentColor: "border-mansagold/50",
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
      gradient: "from-blue-600/20 via-blue-700/20 to-blue-900/20",
      iconColor: "text-blue-400",
      accentColor: "border-blue-400/50",
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
      gradient: "from-mansagold/20 via-amber-500/20 to-amber-600/20",
      iconColor: "text-mansagold",
      accentColor: "border-mansagold/50",
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
      gradient: "from-amber-500/20 via-mansagold/20 to-amber-700/20",
      iconColor: "text-amber-400",
      accentColor: "border-amber-400/50",
      comingSoon: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Learning Hub - Mansa Musa Marketplace</title>
        <meta name="description" content="Educational resources for financial empowerment, business growth, and building Black wealth through community support." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Dark gradient mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-40 right-1/4 w-64 h-64 bg-gradient-to-br from-mansagold/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Floating Shapes */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-mansagold/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-mansagold/70 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }} />
            <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-mansablue/60 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }} />
          </div>
          
          <div className="container-custom mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mansagold/20 to-amber-500/20 backdrop-blur-xl border border-mansagold/30 rounded-full mb-6 shadow-xl animate-pulse">
                <GraduationCap className="h-6 w-6 text-mansagold animate-bounce" />
                <span className="text-sm font-bold text-white">✨ Empowerment Through Education ✨</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                  Learning Hub
                </span>
              </h1>
              <p className="text-xl text-blue-100/90 mb-8 leading-relaxed">
                Access resources, guides, and knowledge to build wealth, grow your business, and strengthen our community through economic empowerment.
              </p>
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
                <div className="px-5 py-2.5 bg-gradient-to-r from-mansablue to-blue-700 backdrop-blur-xl rounded-full border border-blue-400/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-white">💰 Financial Growth</span>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 backdrop-blur-xl rounded-full border border-blue-300/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-white">📈 Business Success</span>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-mansagold to-amber-600 backdrop-blur-xl rounded-full border border-mansagold/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-slate-900">🤝 Community Power</span>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-mansagold backdrop-blur-xl rounded-full border border-amber-400/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm font-bold text-slate-900">🌟 Impact Maker</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Categories */}
        <section className="py-12 px-4 relative">
          <div className="container-custom mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {learningCategories.map((category, index) => (
                <Card key={index} className={`relative overflow-hidden group bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/30 hover:shadow-2xl hover:shadow-mansagold/10 transition-all duration-300 hover:scale-[1.02]`}>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/10 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-mansablue/10 to-transparent rounded-tr-full" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 bg-slate-900/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg border border-white/10 ${category.iconColor}`}>
                        {React.cloneElement(category.icon as React.ReactElement, { className: `h-8 w-8 ${category.iconColor}` })}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 text-white">{category.title}</CardTitle>
                        <CardDescription className="text-base text-blue-200/70">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <ul className="space-y-3">
                        {category.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-3 text-white">
                            <div className={`p-1 ${category.iconColor} bg-slate-800/80 rounded-lg mt-0.5 flex-shrink-0 border border-white/10`}>
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {category.comingSoon && (
                      <div className="mt-4 px-4 py-2 bg-gradient-to-r from-mansagold to-amber-500 rounded-full inline-block shadow-lg">
                        <span className="text-sm font-bold text-slate-900">✨ Coming Soon</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border border-white/10 shadow-2xl">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi1oMnYtMmgtMnptMCA0djJoMnYtMmgtMnptLTItMnYyaDJ2LTJoLTJ6bTAtMnYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse" />
              </div>
              
              {/* Decorative Orbs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-mansagold/30 to-amber-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              <CardContent className="relative z-10 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mansagold/20 to-amber-500/20 backdrop-blur-xl rounded-full mb-6 shadow-xl border border-mansagold/30">
                    <Sparkles className="h-6 w-6 text-mansagold animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-sm font-black text-white">✨ Start Your Journey Today ✨</span>
                    <Sparkles className="h-6 w-6 text-mansagold animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl">
                    Ready to Build Wealth & Empower Your Community?
                  </h2>
                  <p className="text-xl text-blue-100/90 mb-10 leading-relaxed drop-shadow-lg font-medium">
                    Join thousands of entrepreneurs and community members learning, growing, and prospering together through economic empowerment. 🚀
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-mansablue font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-110 border-2 border-white/30 text-lg">
                      <Link to="/directory">
                        <Building2 className="mr-2 h-6 w-6" />
                        Explore Businesses
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="bg-gradient-to-r from-mansagold via-amber-500 to-mansagold hover:from-amber-500 hover:via-mansagold hover:to-amber-500 text-slate-900 font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-110 border-2 border-mansagold/50 text-lg">
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
          
          <div className="container-custom mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
                  More Ways to Learn & Grow
                </h2>
                <p className="text-lg text-blue-200/70">Discover additional resources to accelerate your journey</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/community" className="group">
                  <Card className="h-full bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansablue/50 hover:shadow-2xl hover:shadow-mansablue/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-gradient-to-br from-mansablue to-blue-600 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg border border-blue-400/30">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-white">Join the Community</h3>
                      <p className="text-sm text-blue-200/70 font-medium">Connect with other members</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/impact" className="group">
                  <Card className="h-full bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 hover:shadow-2xl hover:shadow-mansagold/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-gradient-to-br from-mansagold to-amber-500 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg border border-amber-400/30">
                        <Heart className="h-10 w-10 text-slate-900" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-white">Track Your Impact</h3>
                      <p className="text-sm text-blue-200/70 font-medium">See your community contribution</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/help" className="group">
                  <Card className="h-full bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg border border-blue-400/30">
                        <BookOpen className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-white">Get Support</h3>
                      <p className="text-sm text-blue-200/70 font-medium">Find answers to your questions</p>
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
