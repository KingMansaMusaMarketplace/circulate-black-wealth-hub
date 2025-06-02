
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
  onViewProfile: (member: TeamMember) => void;
  onSocialClick: (url: string | undefined, platform: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  onViewProfile, 
  onSocialClick 
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="card-hover border-mansagold/10 overflow-hidden h-full">
        <div className="bg-mansablue p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-white mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <Avatar className="w-20 h-20">
              <AvatarImage src={member.avatarImage} alt={member.name} className="object-cover" />
              <AvatarFallback className="text-mansablue font-spartan font-bold text-2xl bg-white">
                {member.image}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-white font-bold text-lg">{member.name}</h3>
          <p className="text-white/70 text-sm">{member.role}</p>
        </div>
        <CardContent className="p-6 flex flex-col h-full">
          <p className="text-gray-600 text-sm mb-4 flex-1">{member.bio}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {member.socials.linkedin && (
                <button 
                  onClick={() => onSocialClick(member.socials.linkedin, 'LinkedIn')}
                  className="text-gray-400 hover:text-mansablue transition-colors"
                  aria-label={`${member.name}'s LinkedIn profile`}
                >
                  <Linkedin className="h-4 w-4" />
                </button>
              )}
              {member.socials.twitter && (
                <button
                  onClick={() => onSocialClick(member.socials.twitter, 'Twitter')}
                  className="text-gray-400 hover:text-mansablue transition-colors"
                  aria-label={`${member.name}'s Twitter profile`}
                >
                  <Twitter className="h-4 w-4" />
                </button>
              )}
              {member.socials.website && (
                <button
                  onClick={() => onSocialClick(member.socials.website, 'Website')}
                  className="text-gray-400 hover:text-mansablue transition-colors"
                  aria-label={`${member.name}'s website`}
                >
                  <Globe className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-mansablue hover:text-mansablue hover:bg-mansablue/10"
              onClick={() => onViewProfile(member)}
            >
              View Profile <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard;
