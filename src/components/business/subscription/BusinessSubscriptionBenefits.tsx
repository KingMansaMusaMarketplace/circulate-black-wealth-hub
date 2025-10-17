import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  QrCode, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Trophy,
  TrendingUp,
  Sparkles,
  Shield,
  Calendar,
  FileText,
  Zap
} from 'lucide-react';
import { Check } from 'lucide-react';

export const BusinessSubscriptionBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Premium Business Profile",
      description: "Stand out in our marketplace directory with a verified badge and priority placement",
      color: "text-blue-600"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Unlimited QR Codes",
      description: "Generate and manage unlimited QR codes for locations, promotions, and customer engagement",
      color: "text-purple-600"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics Dashboard",
      description: "Track customer visits, engagement metrics, revenue trends, and growth insights in real-time",
      color: "text-green-600"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Financial Management Tools",
      description: "Cash flow tracking, profit & loss statements, expense categorization, and invoice management",
      color: "text-emerald-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Loyalty Program Management",
      description: "Create and manage customer rewards, track points, and drive repeat business",
      color: "text-orange-600"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Customer Review System",
      description: "Collect and showcase customer reviews to build trust and credibility",
      color: "text-pink-600"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Booking & Appointment System",
      description: "Accept bookings, manage appointments, and process payments seamlessly",
      color: "text-indigo-600"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Business Coach",
      description: "Get personalized insights, recommendations, and growth strategies powered by AI",
      color: "text-amber-600"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Featured Placement",
      description: "Increased visibility in search results and featured business sections",
      color: "text-yellow-600"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Invoice & Expense Tracking",
      description: "Professional invoice generation, payment tracking, and expense management",
      color: "text-slate-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Premium Support",
      description: "Priority customer support with dedicated assistance for your business needs",
      color: "text-red-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Community Impact Tracking",
      description: "Showcase your contribution to Black wealth circulation and community growth",
      color: "text-cyan-600"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Business Subscription Benefits</CardTitle>
        <CardDescription>
          Everything included in your $100/month business membership
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className={`flex-shrink-0 ${benefit.color}`}>
                {benefit.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-mansablue/10 to-mansagold/10 rounded-lg border">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-6 w-6 text-mansagold" />
            <h4 className="font-semibold text-lg">Monthly Investment: $100</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Your subscription supports the growth of Black businesses and strengthens economic empowerment 
            in our community. Every dollar invested helps build a more prosperous future for Black entrepreneurs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
