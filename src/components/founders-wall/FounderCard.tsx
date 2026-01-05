import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FoundingMember } from './useFoundingMembers';

interface FounderCardProps {
  member: FoundingMember;
  index: number;
}

const FounderCard = ({ member, index }: FounderCardProps) => {
  const getBadgeColor = (order: number) => {
    if (order <= 10) return 'from-amber-400 via-yellow-300 to-amber-500';
    if (order <= 25) return 'from-slate-300 via-slate-200 to-slate-400';
    if (order <= 50) return 'from-amber-600 via-amber-500 to-amber-700';
    return 'from-blue-400 via-blue-300 to-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="group"
    >
      <Link to={`/business/${member.id}`}>
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-mansagold/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-mansagold/10 overflow-hidden h-full">
          {/* Founding order badge */}
          <div className={`absolute -top-1 -right-1 w-12 h-12 rounded-bl-2xl bg-gradient-to-br ${getBadgeColor(member.founding_order)} flex items-center justify-center shadow-lg`}>
            <span className="text-sm font-bold text-slate-900">#{member.founding_order}</span>
          </div>

          {/* Logo/Avatar */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-mansablue to-mansablue-dark flex items-center justify-center mb-3 overflow-hidden">
            {member.logo_url ? (
              <img 
                src={member.logo_url} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-8 h-8 text-mansagold" />
            )}
          </div>

          {/* Info */}
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1 group-hover:text-mansagold transition-colors">
            {member.name}
          </h3>
          
          <p className="text-blue-200/70 text-xs mb-2 line-clamp-1">
            {member.category}
          </p>

          {(member.city || member.state) && (
            <div className="flex items-center gap-1 text-blue-200/50 text-xs">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">
                {[member.city, member.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default FounderCard;
