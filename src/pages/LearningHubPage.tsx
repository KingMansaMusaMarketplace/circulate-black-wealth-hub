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
      icon: <DollarSign className="h-8 w-8 text-mansagold" />,
      topics: [
        "Understanding Credit & Building Credit Score",
        "Savings & Investment Strategies",
        "Creating Multiple Income Streams",
        "Estate Planning & Wealth Transfer"
      ],
      comingSoon: false
    },
    {
      title: "Business Growth",
      description: "Resources to help Black-owned businesses thrive",
      icon: <TrendingUp className="h-8 w-8 text-mansagold" />,
      topics: [
        "Marketing Your Business Effectively",
        "Managing Cash Flow & Finances",
        "Scaling Your Business",
        "Building a Strong Brand"
      ],
      comingSoon: false
    },
    {
      title: "Community Economics",
      description: "Understanding the power of circulating Black dollars",
      icon: <Users className="h-8 w-8 text-mansagold" />,
      topics: [
        "The Multiplier Effect in Communities",
        "How Economic Circulation Creates Jobs",
        "Supporting Local vs Corporate Businesses",
        "Building Generational Wealth Together"
      ],
      comingSoon: false
    },
    {
      title: "Marketplace Mastery",
      description: "Get the most out of Mansa Musa Marketplace",
      icon: <Building2 className="h-8 w-8 text-mansagold" />,
      topics: [
        "How to Use QR Code Rewards",
        "Tracking Your Community Impact",
        "Finding the Best Black-Owned Businesses",
        "Earning & Redeeming Loyalty Points"
      ],
      comingSoon: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Learning Hub - Mansa Musa Marketplace</title>
        <meta name="description" content="Educational resources for financial empowerment, business growth, and building Black wealth through community support." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 via-transparent to-mansagold/5" />
          <div className="container-custom mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mansagold/10 rounded-full mb-6">
                <GraduationCap className="h-5 w-5 text-mansagold" />
                <span className="text-sm font-semibold text-mansagold">Empowerment Through Education</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-mansablue via-mansablue to-mansagold bg-clip-text text-transparent">
                Learning Hub
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Access resources, guides, and knowledge to build wealth, grow your business, and strengthen our community through economic empowerment.
              </p>
            </div>
          </div>
        </section>

        {/* Learning Categories */}
        <section className="py-12 px-4">
          <div className="container-custom mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {learningCategories.map((category, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-mansagold/50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/10 to-transparent rounded-bl-[100px] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300" />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-mansablue/10 to-mansagold/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      {category.comingSoon && (
                        <span className="px-3 py-1 bg-mansagold/20 text-mansagold text-xs font-semibold rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2">{category.title}</CardTitle>
                    <CardDescription className="text-base">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2 text-sm">
                          <Sparkles className="h-4 w-4 text-mansagold mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-mansablue via-mansablue/90 to-mansagold text-white border-0">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center">
                  <Heart className="h-12 w-12 text-mansagold mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Start Learning?
                  </h2>
                  <p className="text-lg text-white/90 mb-8">
                    Our comprehensive guides and resources are currently being prepared to help you maximize your impact and build lasting wealth in our community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/how-it-works">
                      <Button size="lg" variant="secondary" className="group">
                        <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        How It Works
                      </Button>
                    </Link>
                    <Link to="/businesses">
                      <Button size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue group">
                        <Building2 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Explore Businesses
                      </Button>
                    </Link>
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
