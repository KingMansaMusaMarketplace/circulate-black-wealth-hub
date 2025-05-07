
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
              <h3 className="heading-md mb-6">About the Author</h3>
              <div className="w-32 h-32 rounded-full bg-white mb-6 mx-auto md:mx-0 flex items-center justify-center border-4 border-mansagold">
                <span className="text-mansablue font-spartan font-bold text-4xl">TB</span>
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
                He believes wealth circulation is not an accident — it is a system that must be intentionally built,
                protected, and expanded.
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
