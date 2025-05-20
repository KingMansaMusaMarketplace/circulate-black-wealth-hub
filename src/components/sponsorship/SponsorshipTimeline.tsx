
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, MessageCircle, FileText, Users, Award, ArrowRight } from 'lucide-react';

const SponsorshipTimeline = () => {
  const steps = [
    {
      icon: <MessageCircle className="h-8 w-8 text-white" />,
      title: "Initial Contact",
      description: "Reach out through our sponsorship form or direct email to express your interest.",
      color: "bg-mansablue",
      duration: "Day 1"
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Discovery Call",
      description: "We'll schedule a call to understand your goals and explore how we can create mutual value.",
      color: "bg-mansablue",
      duration: "Day 3-5"
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-white" />,
      title: "Proposal & Agreement",
      description: "Based on our discussion, we'll provide a tailored sponsorship proposal for your review.",
      color: "bg-mansablue",
      duration: "Week 1-2"
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: "Onboarding",
      description: "Once the agreement is signed, we'll collect your assets and begin the onboarding process.",
      color: "bg-mansablue",
      duration: "Week 2-3"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Active Partnership",
      description: "Your brand is integrated into our platform with regular updates on impact and engagement.",
      color: "bg-mansagold",
      duration: "Ongoing"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sponsorship Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From initial conversation to active partnership, here's what to expect when you become a sponsor.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>
            
            {/* Timeline steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col md:flex-row items-center">
                  <div className={`order-1 md:order-${index % 2 === 0 ? '1' : '2'} w-full md:w-1/2 px-4 mb-8 md:mb-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <Card className="border-0 shadow-lg h-full">
                      <CardContent className="pt-6">
                        <span className="text-sm font-bold text-mansablue">{step.duration}</span>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className={`absolute z-10 -left-3 md:left-1/2 transform md:-translate-x-1/2 mt-3 md:mt-0 ${step.color} rounded-full w-14 h-14 flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  
                  <div className={`order-2 md:order-${index % 2 === 0 ? '2' : '1'} w-full md:w-1/2 px-4 ${index % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                    {index < steps.length - 1 && (
                      <div className="hidden md:flex items-center justify-center h-full">
                        <ArrowRight className={`h-8 w-8 text-gray-400 transform ${index % 2 === 0 ? 'rotate-0' : 'rotate-180'}`} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipTimeline;
