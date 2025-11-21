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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />
        </div>

        <div className="container mx-auto px-4 py-12 space-y-16 relative z-10">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-mansagold/20 to-amber-500/20 backdrop-blur-xl border border-mansagold/30 mb-4 animate-float">
              <QrCode className="w-10 h-10 text-mansagold" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
              How MMM Payments Work
            </h1>
            <p className="text-xl text-blue-100/90">
              A complete guide for business owners on accepting fast, secure QR code payments
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">45s</div>
                <div className="text-sm text-blue-200/70">Average Transaction</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">~89%</div>
                <div className="text-sm text-blue-200/70">You Keep</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">7.5%</div>
                <div className="text-sm text-blue-200/70">All-in Fee</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">2-3s</div>
                <div className="text-sm text-blue-200/70">Money Available</div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Experience Flow */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">What Your Customers Experience</h2>
              <p className="text-blue-100/90">
                See the payment process from your customer's perspective
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {customerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="relative bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300">
                    <CardHeader>
                      <div className="absolute -top-4 left-4 bg-gradient-to-r from-mansagold to-amber-500 text-mansablue rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="bg-mansagold/20 w-12 h-12 rounded-full flex items-center justify-center mb-2 border border-mansagold/30">
                        <Icon className="h-6 w-6 text-mansagold" />
                      </div>
                      <CardTitle className="text-lg text-white">{step.title}</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-blue-200/70">
                        <Clock className="h-3 w-3" />
                        <span>{step.time}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-100/80">{step.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/30 text-green-300 rounded-full font-semibold shadow-lg">
                <CheckCircle2 className="h-5 w-5" />
                Total Time: ~45 Seconds ⚡
              </div>
            </div>
          </div>

          {/* Video Tutorial Section */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <PlayCircle className="h-8 w-8 text-mansagold" />
                <h2 className="text-3xl font-bold text-white">Watch It In Action</h2>
              </div>
              <p className="text-blue-100/90">
                See a real customer scanning and completing a payment in under 60 seconds
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden bg-slate-800/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-0">
                  <VideoPlayer
                    src="https://youtu.be/XSMfwiZBOvs?si=bzMfnJomZSKrJsZe"
                    title="Customer QR Payment Flow Tutorial - Step by Step"
                    isYouTube={true}
                    description="Watch a real-time demonstration of a customer using the MMM QR code payment system at a restaurant. This tutorial shows every step from scanning the QR code to receiving the payment confirmation and loyalty points."
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-4 bg-blue-500/10 backdrop-blur-xl border-blue-400/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <PlayCircle className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-blue-100">
                        Replace with Your Screen Recording
                      </p>
                      <p className="text-blue-200/80">
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
              <h2 className="text-3xl font-bold text-white">Calculate Your Earnings</h2>
              <p className="text-blue-100/90">
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
              <h2 className="text-3xl font-bold text-white">Where Customer Payments Go</h2>
              <p className="text-blue-100/90">
                Complete transparency on payment flow and money distribution
              </p>
            </div>

            <Card className="max-w-3xl mx-auto bg-slate-800/60 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Payment Flow Breakdown</CardTitle>
                <CardDescription className="text-blue-200/70">Customer pays MMM, money is instantly split</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500/20 backdrop-blur-xl border border-green-400/30 p-3 rounded-full flex-shrink-0">
                      <Users className="h-6 w-6 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">Customer Pays MMM</div>
                      <div className="text-sm text-blue-200/70">
                        Customer sees "Pay Mansa Musa Marketplace" - builds trust
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-300">$100</div>
                  </div>

                  <div className="pl-8 border-l-2 border-dashed border-white/20 space-y-4 ml-6">
                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-blue-200/70 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-orange-300">Platform Commission</div>
                        <div className="text-sm text-blue-200/70">Held in MMM Stripe account</div>
                      </div>
                      <div className="font-bold text-orange-300">$7.50</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-blue-200/70 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-red-300">Stripe Processing Fee</div>
                        <div className="text-sm text-blue-200/70">Deducted by Stripe (2.9% + $0.30)</div>
                      </div>
                      <div className="font-bold text-red-300">$3.20</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-blue-200/70 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-mansagold">Your Business Receives</div>
                        <div className="text-sm text-blue-200/70">Transferred to your Stripe Connected Account (2-3 days)</div>
                      </div>
                      <div className="text-xl font-bold text-mansagold">$89.30</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-start gap-2 text-sm text-blue-200/80">
                    <Shield className="h-4 w-4 mt-0.5 text-mansagold" />
                    <p>
                      <strong className="text-white">Important:</strong> Customers pay MMM, but your portion is instantly transferred to your Stripe Connected Account. 
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
              <h2 className="text-3xl font-bold text-white">Why Business Owners Love MMM</h2>
              <p className="text-blue-100/90">
                More than just payments - a complete customer experience platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300">
                    <CardHeader>
                      <div className="bg-mansagold/20 w-12 h-12 rounded-full flex items-center justify-center mb-2 border border-mansagold/30">
                        <Icon className="h-6 w-6 text-mansagold" />
                      </div>
                      <CardTitle className="text-lg text-white">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-100/80">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Your Questions Answered</h2>
              <p className="text-blue-100/90">
                Everything you need to know about accepting payments with MMM
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <BusinessFAQ />
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-mansablue/40 to-blue-700/40 backdrop-blur-xl border-mansagold/30 shadow-2xl shadow-mansagold/20">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
              <p className="text-lg text-blue-100/90 max-w-2xl mx-auto">
                Join hundreds of businesses already using MMM to accept payments faster, 
                build customer loyalty, and grow their revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/business/signup')} 
                  className="text-lg bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-mansablue font-semibold shadow-lg shadow-mansagold/20"
                >
                  Sign Up as Business
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')}
                  className="border-white/20 text-white hover:bg-white/10 hover:border-mansagold/50"
                >
                  Contact Sales
                </Button>
              </div>
              <p className="text-sm text-blue-200/70">
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
