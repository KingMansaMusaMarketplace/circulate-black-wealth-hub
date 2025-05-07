
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Linkedin, Twitter, Globe, ChevronRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  extendedBio?: string;
  experience?: string[];
  education?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
}

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      name: "Aisha Johnson",
      role: "Chief Operations Officer",
      bio: "15+ years in supply chain management and logistics optimization for marketplace platforms.",
      extendedBio: "Aisha has led operations for several major e-commerce platforms before joining Mansa Musa Marketplace. She specializes in developing efficient logistics networks that prioritize Black-owned businesses and community economic development.",
      experience: [
        "Former VP of Operations at Global Commerce Partners",
        "Supply Chain Director at Urban Marketplace Initiative",
        "Consultant for Black Business Alliance"
      ],
      education: "MBA from Howard University, BS in Business Management from Spelman College",
      image: "AJ",
      socials: { 
        linkedin: "#", 
        twitter: "#", 
        website: "#",
        email: "aisha@mansamusamarketplace.com" 
      }
    },
    {
      name: "Marcus Williams",
      role: "Head of Merchant Relations",
      bio: "Former small business owner with expertise in scaling Black-owned businesses across multiple sectors.",
      extendedBio: "Marcus brings firsthand experience as a successful entrepreneur who built and sold three businesses in the food service and retail sectors. His passion is helping other Black entrepreneurs navigate growth challenges.",
      experience: [
        "Founder of Williams Retail Group",
        "Small Business Development Advisor",
        "Board Member at National Black Chamber of Commerce"
      ],
      education: "BA in Economics from Morehouse College",
      image: "MW",
      socials: { 
        linkedin: "#", 
        twitter: "#",
        email: "marcus@mansamusamarketplace.com"
      }
    },
    {
      name: "Zara Thompson",
      role: "Technology Director",
      bio: "Tech innovator specializing in marketplace architecture and loyalty systems development.",
      extendedBio: "Zara has pioneered several technological innovations in the e-commerce space, with specific focus on systems that help underrepresented founders leverage technology with lower barriers to entry.",
      experience: [
        "Lead Engineer at TechEquity Solutions",
        "Systems Architect at Platform Plus",
        "Founder of CodeBlack Initiative"
      ],
      education: "MS in Computer Science from Georgia Tech, BS in Software Engineering from North Carolina A&T",
      image: "ZT",
      socials: { 
        linkedin: "#", 
        website: "#",
        email: "zara@mansamusamarketplace.com"
      }
    },
    {
      name: "Devon Carter",
      role: "Community Engagement Lead",
      bio: "Grassroots organizer with experience building economic empowerment programs in urban communities.",
      extendedBio: "Devon has dedicated his career to creating bridges between corporate resources and community needs. His work has resulted in the development of several successful community-owned businesses in underserved neighborhoods.",
      experience: [
        "Director at Urban Development Coalition",
        "Program Manager at Community Wealth Partners",
        "Economic Justice Organizer"
      ],
      education: "MA in Urban Planning from Columbia University, BA in Sociology from Temple University",
      image: "DC",
      socials: { 
        twitter: "#", 
        website: "#",
        email: "devon@mansamusamarketplace.com"
      }
    }
  ];

  const openMemberDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

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
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-hover border-mansagold/10 overflow-hidden h-full">
                <div className="bg-mansablue p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                    <span className="text-mansablue font-spartan font-bold text-2xl">{member.image}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-white/70 text-sm">{member.role}</p>
                </div>
                <CardContent className="p-6 flex flex-col h-full">
                  <p className="text-gray-600 text-sm mb-4 flex-1">{member.bio}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-mansablue hover:text-mansablue hover:bg-mansablue/10"
                      onClick={() => openMemberDialog(member)}
                    >
                      View Profile <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedMember && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12 bg-mansablue text-white">
                  <AvatarFallback>{selectedMember.image}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-xl font-bold">{selectedMember.name}</span>
                  <p className="text-sm text-gray-500 mt-1">{selectedMember.role}</p>
                </div>
              </DialogTitle>
              <DialogDescription>
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700">{selectedMember.extendedBio}</p>
                  
                  {selectedMember.experience && (
                    <div>
                      <h4 className="text-lg font-semibold text-mansablue mt-4 mb-2">Experience</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedMember.experience.map((exp, idx) => (
                          <li key={idx} className="text-gray-600">{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedMember.education && (
                    <div>
                      <h4 className="text-lg font-semibold text-mansablue mt-4 mb-2">Education</h4>
                      <p className="text-gray-600">{selectedMember.education}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 flex justify-between items-center border-t border-gray-200 mt-4">
                    <div className="flex items-center space-x-4">
                      {selectedMember.socials.linkedin && (
                        <a href={selectedMember.socials.linkedin} className="text-gray-500 hover:text-mansablue transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {selectedMember.socials.twitter && (
                        <a href={selectedMember.socials.twitter} className="text-gray-500 hover:text-mansablue transition-colors">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {selectedMember.socials.website && (
                        <a href={selectedMember.socials.website} className="text-gray-500 hover:text-mansablue transition-colors">
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    {selectedMember.socials.email && (
                      <Button className="bg-mansablue hover:bg-mansablue-dark">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default TeamSection;

