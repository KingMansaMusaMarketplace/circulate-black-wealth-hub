
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AuthorSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <Card className="overflow-hidden border-mansagold/20">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1 bg-mansablue p-8 text-white">
              <h3 className="heading-md mb-6">About the Author</h3>
              <div className="relative mx-auto md:mx-0 mb-6">
                <Avatar className="w-40 h-40 border-4 border-mansagold">
                  <AvatarImage 
                    src="/lovable-uploads/1dd9f7bc-bb83-4c92-b250-e11f63790f8c.png" 
                    alt="Thomas D. Bowling" 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-mansablue font-spartan font-bold text-4xl bg-white">
                    TB
                  </AvatarFallback>
                </Avatar>
              </div>
              <h4 className="text-xl font-bold mb-2">Thomas D. Bowling</h4>
              <p className="text-white/80 mb-4 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Founder & Chief Architect
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
              <p className="text-gray-700 font-bold italic text-lg">
                "My life's work is to leave blueprints, not breadcrumbs, for the next generation of Black builders."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AuthorSection;
