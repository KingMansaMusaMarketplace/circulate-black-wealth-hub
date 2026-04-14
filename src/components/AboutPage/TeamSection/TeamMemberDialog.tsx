
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Globe, Mail, Bot } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMemberDialogProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSocialClick: (url: string | undefined, platform: string) => void;
  onSendEmail: (email: string | undefined) => void;
}

const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({
  member,
  isOpen,
  onClose,
  onSocialClick,
  onSendEmail
}) => {
  if (!member) return null;

  const isAI = member.isAI;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className={`h-12 w-12 ${isAI ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-mansagold to-amber-600'}`}>
              <AvatarImage src={member.avatarImage} alt={member.name} className="object-cover" />
              <AvatarFallback className="text-white font-bold">
                {isAI ? <Bot className="w-6 h-6" /> : member.image}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{member.name}</span>
                {isAI && (
                  <span className="flex items-center gap-1 bg-purple-500/30 text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full">
                    <Bot className="w-3 h-3" /> AI Agent
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-200/80 mt-1">{member.role}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="mt-6 space-y-4">
              {isAI && (
                <div className="flex items-center gap-2 text-purple-300 text-sm font-medium bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20">
                  <Bot className="w-4 h-4" />
                  Powered by Kayla Agentic AI Infrastructure
                </div>
              )}
              
              <p className="text-blue-100/90 leading-relaxed">{member.extendedBio}</p>
              
              {member.experience && (
                <div>
                  <h4 className="text-lg font-semibold text-mansagold mt-4 mb-2">
                    {isAI ? 'Core Functions' : 'Experience'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {member.experience.map((exp, idx) => (
                      <li key={idx} className="text-blue-200/80">{exp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isAI && member.capabilities && (
                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mt-4 mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.capabilities.map((cap, idx) => (
                      <span key={idx} className="text-xs font-semibold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {!isAI && member.education && (
                <div>
                  <h4 className="text-lg font-semibold text-mansagold mt-4 mb-2">Education</h4>
                  <p className="text-blue-200/80">{member.education}</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-between items-center border-t border-white/10 mt-4">
                <div className="flex items-center space-x-4">
                  {member.socials.linkedin && (
                    <button 
                      onClick={() => onSocialClick(member.socials.linkedin, 'LinkedIn')}
                      className="text-blue-300/70 hover:text-mansagold transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </button>
                  )}
                  {member.socials.twitter && (
                    <button
                      onClick={() => onSocialClick(member.socials.twitter, 'Twitter')}
                      className="text-blue-300/70 hover:text-mansagold transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </button>
                  )}
                  {member.socials.website && (
                    <button
                      onClick={() => onSocialClick(member.socials.website, 'Website')}
                      className="text-blue-300/70 hover:text-mansagold transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {member.socials.email && (
                  <Button 
                    className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-mansablue"
                    onClick={() => onSendEmail(member.socials.email)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDialog;
