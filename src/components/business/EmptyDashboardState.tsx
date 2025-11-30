import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyDashboardStateProps {
  businessId: string;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ businessId }) => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "Generate Your QR Code",
      description: "Create a unique QR code for customers to scan and earn loyalty points",
      action: "Generate QR Code",
      onClick: () => navigate('/business/qr-codes'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Add Your Services",
      description: "List the services you offer so customers can book appointments",
      action: "Add Services",
      onClick: () => navigate('/business/services'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Set Your Availability",
      description: "Let customers know when you're open and ready for business",
      action: "Set Hours",
      onClick: () => navigate('/business/availability'),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Share Your Business",
      description: "Spread the word and start attracting customers from the community",
      action: "Get Marketing Materials",
      onClick: () => navigate('/business/marketing'),
      color: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <Card className="bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-purple-900/90 backdrop-blur-xl border-white/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        
        <CardHeader className="relative z-10 text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-2xl shadow-yellow-500/50">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-white to-blue-400 bg-clip-text text-transparent">
            Welcome to Your Business Dashboard! 🎉
          </CardTitle>
          <CardDescription className="text-xl text-white/90 max-w-2xl mx-auto">
            You're all set up! Let's get your business ready to serve customers and start earning revenue.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 pb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              What You'll See Here Once You're Active:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5"></div>
                <span>Monthly revenue and booking statistics</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5"></div>
                <span>Customer engagement metrics</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5"></div>
                <span>Popular services and peak times</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5"></div>
                <span>Weekly booking trends and insights</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowRight className="h-6 w-6 text-yellow-400" />
          Get Started in 4 Simple Steps
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <CardHeader className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{step.icon}</div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-yellow-400 transition-colors">
                  {index + 1}. {step.title}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {step.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <Button
                  onClick={step.onClick}
                  className={`w-full bg-gradient-to-r ${step.color} hover:opacity-90 text-white shadow-lg`}
                >
                  {step.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Pro Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-white/80">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-400 font-bold text-sm">1</span>
            </div>
            <p>Upload high-quality photos of your business and products to attract more customers</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-400 font-bold text-sm">2</span>
            </div>
            <p>Respond quickly to customer reviews and bookings to build trust and credibility</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-400 font-bold text-sm">3</span>
            </div>
            <p>Promote your QR code on social media and at your physical location</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-400 font-bold text-sm">4</span>
            </div>
            <p>Check your dashboard daily to stay on top of bookings and customer engagement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
