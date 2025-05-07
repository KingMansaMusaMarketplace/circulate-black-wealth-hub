
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Linkedin, Twitter, Globe } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Aisha Johnson",
      role: "Chief Operations Officer",
      bio: "15+ years in supply chain management and logistics optimization for marketplace platforms.",
      image: "AJ",
      socials: { linkedin: "#", twitter: "#", website: "#" }
    },
    {
      name: "Marcus Williams",
      role: "Head of Merchant Relations",
      bio: "Former small business owner with expertise in scaling Black-owned businesses across multiple sectors.",
      image: "MW",
      socials: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Zara Thompson",
      role: "Technology Director",
      bio: "Tech innovator specializing in marketplace architecture and loyalty systems development.",
      image: "ZT",
      socials: { linkedin: "#", website: "#" }
    },
    {
      name: "Devon Carter",
      role: "Community Engagement Lead",
      bio: "Grassroots organizer with experience building economic empowerment programs in urban communities.",
      image: "DC",
      socials: { twitter: "#", website: "#" }
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">
            Meet Our Team
          </h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The visionaries building the infrastructure for economic sovereignty.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="card-hover border-mansagold/10 overflow-hidden">
              <div className="bg-mansablue p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                  <span className="text-mansablue font-spartan font-bold text-2xl">{member.image}</span>
                </div>
                <h3 className="text-white font-bold text-lg">{member.name}</h3>
                <p className="text-white/70 text-sm">{member.role}</p>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex items-center justify-center space-x-4">
                  {member.socials.linkedin && (
                    <a href={member.socials.linkedin} className="text-gray-400 hover:text-mansablue transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.socials.twitter && (
                    <a href={member.socials.twitter} className="text-gray-400 hover:text-mansablue transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {member.socials.website && (
                    <a href={member.socials.website} className="text-gray-400 hover:text-mansablue transition-colors">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
