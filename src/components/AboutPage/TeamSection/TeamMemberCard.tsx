
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
      <Card className="border-2 border-white/10 bg-slate-800/60 backdrop-blur-xl overflow-hidden h-full hover:border-mansagold/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className="bg-gradient-to-br from-mansablue via-blue-600 to-blue-700 p-6 text-center relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
          
          <div className="relative z-10 w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white/50">
            <Avatar className="w-24 h-24">
              <AvatarImage src={member.avatarImage} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-mansagold to-amber-600 text-white font-bold text-2xl">
                {member.image}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-white font-bold text-xl relative z-10 drop-shadow-md">{member.name}</h3>
          <p className="text-white/90 text-sm font-medium relative z-10">{member.role}</p>
        </div>
        <CardContent className="p-6 flex flex-col h-full">
          <p className="text-blue-100/90 text-sm mb-4 flex-1 leading-relaxed">{member.bio}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {member.socials.linkedin && (
                <button 
                  onClick={() => onSocialClick(member.socials.linkedin, 'LinkedIn')}
                  className="text-blue-300/70 hover:text-mansagold transition-colors"
                  aria-label={`${member.name}'s LinkedIn profile`}
                >
                  <Linkedin className="h-4 w-4" />
                </button>
              )}
              {member.socials.twitter && (
                <button
                  onClick={() => onSocialClick(member.socials.twitter, 'Twitter')}
                  className="text-blue-300/70 hover:text-mansagold transition-colors"
                  aria-label={`${member.name}'s Twitter profile`}
                >
                  <Twitter className="h-4 w-4" />
                </button>
              )}
              {member.socials.website && (
                <button
                  onClick={() => onSocialClick(member.socials.website, 'Website')}
                  className="text-blue-300/70 hover:text-mansagold transition-colors"
                  aria-label={`${member.name}'s website`}
                >
                  <Globe className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-mansagold hover:text-amber-400 hover:bg-mansagold/10"
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
