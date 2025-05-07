
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users } from 'lucide-react';

const AuthorSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <Card className="overflow-hidden border-mansagold/20">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1 bg-mansablue p-8 text-white">
              <h3 className="heading-md mb-6">About the Inventor</h3>
              <div className="relative mx-auto md:mx-0 mb-6">
                <img 
                  src="/lovable-uploads/1dd9f7bc-bb83-4c92-b250-e11f63790f8c.png" 
                  alt="Thomas D. Bowling"
                  className="w-full max-w-[280px] border-4 border-mansagold"
                />
              </div>
              <h4 className="text-xl font-bold mb-2">Thomas D. Bowling</h4>
              <p className="text-white/80 mb-4 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Founder & Chief Architect of Economic Infrastructure
              </p>
            </div>
            
            <div className="md:col-span-2 p-8">
              <p className="text-gray-700 mb-4">
                Thomas D. Bowling is a visionary entrepreneur, strategic founder, and inventor behind
                Mansa Musa Marketplace. With a mission to engineer economic empowerment through
                infrastructure, Thomas brings decades of experience in strategic development,
                community-centered innovation, and business leadership.
              </p>
              <p className="text-gray-700 mb-4">
                Recognized for his distinctive style and thoughtful approach, Thomas has pioneered systems that
                create sustainable wealth circulation within communities. His work focuses on building
                economic infrastructure that empowers businesses and individuals alike.
              </p>
              <Separator className="my-4" />
              <p className="text-gray-700 font-bold italic text-lg mb-6">
                "My life's work is to leave blueprints, not breadcrumbs, for the next generation of Black builders."
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-mansagold">
                <h4 className="text-xl font-bold text-mansablue mb-3">A 40-Year Journey of Resilience</h4>
                
                <p className="text-gray-700 mb-4">
                  For four decades, I've walked the challenging path of Black entrepreneurship, witnessing firsthand the systemic barriers that have kept too many brilliant minds and determined spirits from reaching their full potential. Each venture, each partnership, and yes—each failure—has been a lesson that shaped my understanding of what our community truly needs to thrive.
                </p>
                
                <p className="text-gray-700 mb-4">
                  When I began my entrepreneurial journey in the 1980s, I quickly discovered that access to capital, networks, and infrastructure were not equally distributed. While others received second and third chances, Black business owners often had just one shot at success—with the weight of entire communities riding on their shoulders.
                </p>
                
                <p className="text-gray-700 mb-4">
                  This reality didn't discourage me; it fueled me. I became obsessed with creating systems that could withstand external pressures and economic volatility. I focused on building community-centered models where money, resources, and knowledge could circulate internally before extending outward.
                </p>
                
                <p className="text-gray-700">
                  Mansa Musa Marketplace isn't just another business venture—it's the culmination of decades of hard-won wisdom. It's the blueprint I wish I had when I started my journey. My commitment is to ensure that the next generation of Black builders won't just survive but will thrive, creating legacies that transform communities and rewrite economic narratives for generations to come.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AuthorSection;
