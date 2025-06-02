
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
