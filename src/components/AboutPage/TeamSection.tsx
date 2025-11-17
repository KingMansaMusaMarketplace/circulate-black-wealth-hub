
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { teamMembers } from './TeamSection/teamData';
import { TeamMember } from './TeamSection/types';
import TeamMemberCard from './TeamSection/TeamMemberCard';
import TeamMemberDialog from './TeamSection/TeamMemberDialog';
import { handleSocialClick, handleSendEmail } from './TeamSection/utils';

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-mansablue-light/10 to-amber-50 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-mansablue/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-mansagold/15 to-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            <span className="bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 bg-clip-text text-transparent">Meet Our </span>
            <span className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent">Team</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto font-medium">
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
            <TeamMemberCard
              key={index}
              member={member}
              onViewProfile={openMemberDialog}
              onSocialClick={handleSocialClick}
            />
          ))}
        </motion.div>
      </div>

      <TeamMemberDialog
        member={selectedMember}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSocialClick={handleSocialClick}
        onSendEmail={handleSendEmail}
      />
    </section>
  );
};

export default TeamSection;
