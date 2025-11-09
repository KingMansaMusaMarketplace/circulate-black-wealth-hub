import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentCalculator from '@/components/business/PaymentCalculator';
import BusinessFAQ from '@/components/business/BusinessFAQ';
import VideoPlayer from '@/components/VideoPlayer';
import { 
  Smartphone, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Shield, 
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const HowItWorksPage = () => {
  const navigate = useNavigate();

  const customerSteps = [
    {
      icon: QrCode,
      title: "Customer Scans QR Code",
      description: "Customer finishes their meal or service and scans your MMM QR code displayed at the register or on their table.",
      time: "5 seconds"
    },
    {
      icon: Smartphone,
      title: "Opens Payment Screen",
      description: "Their phone opens the payment page showing your business info. New customers can sign up in 30 seconds, returning customers are auto-recognized.",
      time: "10 seconds"
    },
    {
      icon: CreditCard,
      title: "Enters Payment & Completes",
      description: "Customer enters the payment amount, adds optional tip, and pays with their saved card or a new one. All secure through Stripe.",
      time: "15 seconds"
    },
    {
      icon: CheckCircle2,
      title: "Gets Confirmation & Rewards",
      description: "Customer receives instant confirmation, digital receipt, and loyalty points (10 points per dollar). Payment complete!",
      time: "5 seconds"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Transactions complete in ~45 seconds vs 2-5 minutes with traditional payment methods"
    },
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Built-in loyalty program keeps customers coming back and spending more"
    },
    {
      icon: Users,
      title: "Know Your Customers",
      description: "Get valuable customer data and insights to make better business decisions"
    },
    {
      icon: Shield,
      title: "Secure & Protected",
      description: "Bank-level security powered by Stripe with fraud protection included"
    }
  ];

  return (
    <>
      <Helmet>
        <title>How MMM Payments Work - Business Owner Guide</title>
        <meta name="description" content="Complete guide for business owners on how MMM QR code payments work, including fees, timeline, and customer experience." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              How MMM Payments Work
            </h1>
            <p className="text-xl text-muted-foreground">
              A complete guide for business owners on accepting fast, secure QR code payments
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">45s</div>
                <div className="text-sm text-muted-foreground">Average Transaction</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">~89%</div>
                <div className="text-sm text-muted-foreground">You Keep</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">7.5%</div>
                <div className="text-sm text-muted-foreground">All-in Fee</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">2-3s</div>
                <div className="text-sm text-muted-foreground">Money Available</div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Experience Flow */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">What Your Customers Experience</h2>
              <p className="text-muted-foreground">
                See the payment process from your customer's perspective
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {customerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className="absolute -top-4 left-4 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{step.time}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-full font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                Total Time: ~45 Seconds ⚡
              </div>
            </div>
          </div>

          {/* Video Tutorial Section */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <PlayCircle className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Watch It In Action</h2>
              </div>
              <p className="text-muted-foreground">
                See a real customer scanning and completing a payment in under 60 seconds
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <VideoPlayer
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Customer QR Payment Flow Tutorial - Step by Step"
                    isYouTube={true}
                    description="Watch a real-time demonstration of a customer using the MMM QR code payment system at a restaurant. This tutorial shows every step from scanning the QR code to receiving the payment confirmation and loyalty points."
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Replace with Your Screen Recording
                      </p>
                      <p className="text-blue-800 dark:text-blue-200">
                        Record a screen capture showing the complete payment flow from your test account. 
                        Include voiceover explaining: scanning → login → payment entry → confirmation → loyalty points.
                        Upload to YouTube and replace the video URL in the code.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Calculator */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Calculate Your Earnings</h2>
              <p className="text-muted-foreground">
                See exactly how much you receive from any transaction
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <PaymentCalculator />
            </div>
          </div>

          {/* Where Money Goes */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Where Customer Payments Go</h2>
              <p className="text-muted-foreground">
                Complete transparency on payment flow and money distribution
              </p>
            </div>

            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Payment Flow Breakdown</CardTitle>
                <CardDescription>Customer pays MMM, money is instantly split</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-950 p-3 rounded-full flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Customer Pays MMM</div>
                      <div className="text-sm text-muted-foreground">
                        Customer sees "Pay Mansa Musa Marketplace" - builds trust
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">$100</div>
                  </div>

                  <div className="pl-8 border-l-2 border-dashed border-muted-foreground/30 space-y-4 ml-6">
                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-orange-600">Platform Commission</div>
                        <div className="text-sm text-muted-foreground">Held in MMM Stripe account</div>
                      </div>
                      <div className="font-bold text-orange-600">$7.50</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-red-600">Stripe Processing Fee</div>
                        <div className="text-sm text-muted-foreground">Deducted by Stripe (2.9% + $0.30)</div>
                      </div>
                      <div className="font-bold text-red-600">$3.20</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-primary">Your Stripe Account</div>
                        <div className="text-sm text-muted-foreground">Available immediately</div>
                      </div>
                      <div className="text-xl font-bold text-primary">$89.30</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <p>
                      <strong>Important:</strong> Customers pay MMM, but your portion is instantly transferred to your Stripe Connected Account. 
                      No manual transfers needed - Stripe handles everything automatically!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Why Business Owners Love MMM</h2>
              <p className="text-muted-foreground">
                More than just payments - a complete customer experience platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Your Questions Answered</h2>
              <p className="text-muted-foreground">
                Everything you need to know about accepting payments with MMM
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <BusinessFAQ />
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of businesses already using MMM to accept payments faster, 
                build customer loyalty, and grow their revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/business/signup')} className="text-lg">
                  Sign Up as Business
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                  Contact Sales
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No setup fees • No monthly charges • Start accepting payments today
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage;
