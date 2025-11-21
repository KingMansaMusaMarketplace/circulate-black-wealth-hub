
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Globe, Mail } from 'lucide-react';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-gradient-to-br from-mansagold to-amber-600">
              <AvatarImage src={member.avatarImage} alt={member.name} className="object-cover" />
              <AvatarFallback className="text-white font-bold">{member.image}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xl font-bold text-white">{member.name}</span>
              <p className="text-sm text-blue-200/80 mt-1">{member.role}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="mt-6 space-y-4">
              <p className="text-blue-100/90 leading-relaxed">{member.extendedBio}</p>
              
              {member.experience && (
                <div>
                  <h4 className="text-lg font-semibold text-mansagold mt-4 mb-2">Experience</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {member.experience.map((exp, idx) => (
                      <li key={idx} className="text-blue-200/80">{exp}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {member.education && (
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
