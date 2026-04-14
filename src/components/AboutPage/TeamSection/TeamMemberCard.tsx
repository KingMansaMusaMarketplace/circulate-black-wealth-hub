
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Globe, ChevronRight, Bot } from 'lucide-react';
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

  const isAI = member.isAI;

  return (
    <motion.div variants={itemVariants}>
      <Card className={`border-2 ${isAI ? 'border-purple-500/30 hover:border-purple-400/60' : 'border-white/10 hover:border-mansagold/50'} bg-slate-800/60 backdrop-blur-xl overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
        <div className={`${isAI ? 'bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-700' : 'bg-gradient-to-br from-mansablue via-blue-600 to-blue-700'} p-6 text-center relative overflow-hidden`}>
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
          
          {/* AI Badge */}
          {isAI && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-purple-500/30">
              <Bot className="w-3 h-3" />
              AI Agent
            </div>
          )}
          
          <div className={`relative z-10 w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg ${isAI ? 'ring-4 ring-purple-400/50' : 'ring-4 ring-white/50'}`}>
            <Avatar className="w-24 h-24">
              <AvatarImage src={member.avatarImage} alt={member.name} className="object-cover" />
              <AvatarFallback className={`${isAI ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-mansagold to-amber-600'} text-white font-bold text-2xl`}>
                {isAI ? <Bot className="w-10 h-10" /> : member.image}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-white font-bold text-xl relative z-10 drop-shadow-md">{member.name}</h3>
          <p className="text-white/90 text-sm font-medium relative z-10">{member.role}</p>
        </div>
        <CardContent className="p-6 flex flex-col h-full">
          <p className="text-blue-100/90 text-sm mb-4 flex-1 leading-relaxed">{member.bio}</p>
          
          {/* AI Capabilities chips */}
          {isAI && member.capabilities && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.capabilities.map((cap, i) => (
                <span key={i} className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  {cap}
                </span>
              ))}
            </div>
          )}
          
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
              {isAI && (
                <span className="text-purple-400/70 text-xs font-medium">Powered by Kayla</span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className={`${isAI ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10' : 'text-mansagold hover:text-amber-400 hover:bg-mansagold/10'}`}
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
