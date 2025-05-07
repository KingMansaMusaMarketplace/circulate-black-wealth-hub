
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Twitter, Globe } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  socialLinks?: {
    email?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="h-full border-mansagold/20 overflow-hidden group card-hover">
        <CardContent className="p-0">
          <div className="overflow-hidden aspect-[4/5]">
            <img 
              src={member.imageSrc} 
              alt={member.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-mansablue">{member.name}</h3>
            <p className="text-mansagold font-medium mb-3">{member.role}</p>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {member.bio}
            </p>
            
            {member.socialLinks && (
              <div className="flex space-x-2 mt-auto">
                {member.socialLinks.email && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <a 
                        href={`mailto:${member.socialLinks.email}`}
                        className="text-sm text-mansablue hover:text-mansagold transition-colors"
                      >
                        {member.socialLinks.email}
                      </a>
                    </PopoverContent>
                  </Popover>
                )}
                
                {member.socialLinks.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                {member.socialLinks.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                {member.socialLinks.website && (
                  <a 
                    href={member.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="default" className="bg-mansablue text-white ml-auto">
                      Read More
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <h4 className="font-bold mb-2">{member.name}</h4>
                    <p className="text-gray-600 text-sm">
                      {member.bio}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard;
