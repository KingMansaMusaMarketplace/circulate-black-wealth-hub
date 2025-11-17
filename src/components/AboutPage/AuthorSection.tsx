
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users } from 'lucide-react';

const AuthorSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue via-blue-800 to-blue-900"></div>
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-mansagold/20 to-amber-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container-custom relative z-10">
        <Card className="overflow-hidden border-2 border-white/30 bg-white/10 backdrop-blur-xl shadow-2xl">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1 bg-gradient-to-br from-mansablue via-blue-700 to-blue-800 p-8 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-mansagold/30 to-amber-400/30 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-500/20 blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="heading-md mb-6 bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent font-extrabold">
                  About the Inventor
                </h3>
                <div className="relative mx-auto md:mx-0 mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                  <img 
                    src="/lovable-uploads/1dd9f7bc-bb83-4c92-b250-e11f63790f8c.png" 
                    alt="Thomas D. Bowling"
                    className="relative w-full max-w-[280px] border-4 border-white/50 rounded-lg shadow-2xl"
                  />
                </div>
                <h4 className="text-2xl font-bold mb-2 text-white">Thomas D. Bowling</h4>
                <p className="text-white/90 mb-4 flex items-center text-lg font-medium">
                  <Users className="mr-2 h-5 w-5 text-mansagold" />
                  Founder & Chief Architect of Economic Infrastructure
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2 p-8 bg-white/95 backdrop-blur-sm">
              <p className="text-gray-800 mb-4 text-lg leading-relaxed">
                Thomas D. Bowling is a <span className="font-bold bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent">visionary entrepreneur</span>, strategic founder, and inventor behind
                Mansa Musa Marketplace. With a mission to engineer economic empowerment through
                infrastructure, Thomas brings decades of experience in strategic development,
                community-centered innovation, and business leadership.
              </p>
              <p className="text-gray-800 mb-4 text-lg leading-relaxed">
                Recognized for his distinctive style and thoughtful approach, Thomas has pioneered systems that
                create <span className="font-bold bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">sustainable wealth circulation</span> within communities. His work focuses on building
                economic infrastructure that empowers businesses and individuals alike.
              </p>
              <Separator className="my-6 bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 h-1" />
              <p className="text-gray-900 font-bold italic text-xl mb-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-4 rounded-lg border-l-4 border-mansagold">
                "My life's work is to leave <span className="bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">blueprints</span>, not breadcrumbs, for the next generation of Black builders."
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-amber-50 p-6 rounded-xl border-l-4 border-mansablue shadow-lg">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-mansablue via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
                  A 40-Year Journey of Resilience
                </h4>
                
                <p className="text-gray-800 mb-4 leading-relaxed">
                  For four decades, I've walked the challenging path of Black entrepreneurship, witnessing firsthand the systemic barriers that have kept too many brilliant minds and determined spirits from reaching their full potential. Each venture, each partnership, and yes—each failure—has been a lesson that shaped my understanding of what our community truly needs to thrive.
                </p>
                
                <p className="text-gray-800 mb-4 leading-relaxed">
                  When I began my entrepreneurial journey in the <span className="font-bold text-mansablue">1980s</span>, I quickly discovered that access to capital, networks, and infrastructure were not equally distributed. While others received second and third chances, Black business owners often had just one shot at success—with the weight of entire communities riding on their shoulders.
                </p>
                
                <p className="text-gray-800 mb-4 leading-relaxed">
                  This reality didn't discourage me; it <span className="font-bold bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">fueled me</span>. I became obsessed with creating systems that could withstand external pressures and economic volatility. I focused on building community-centered models where money, resources, and knowledge could circulate internally before extending outward.
                </p>
                
                <p className="text-gray-800 leading-relaxed">
                  <span className="font-bold text-mansablue">Mansa Musa Marketplace</span> isn't just another business venture—it's the culmination of decades of hard-won wisdom. It's the blueprint I wish I had when I started my journey. My commitment is to ensure that the next generation of Black builders won't just survive but will <span className="font-bold bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">thrive</span>, creating legacies that transform communities and rewrite economic narratives for generations to come.
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
