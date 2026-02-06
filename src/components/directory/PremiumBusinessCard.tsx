import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/ui/optimized-image';
import { generatePlaceholder } from '@/utils/imageOptimizer';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';
import HBCUBadge, { isHBCUCategory } from '@/components/ui/HBCUBadge';
import { motion } from 'framer-motion';

interface PremiumBusinessCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  distance?: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
  isSample?: boolean;
  isVerified?: boolean;
  index?: number;
}

const PremiumBusinessCard = ({ 
  id, 
  name, 
  category, 
  rating, 
  reviewCount, 
  discount, 
  distance, 
  address,
  phone,
  imageUrl,
  imageAlt,
  isFeatured = false,
  isSample = false,
  isVerified = false,
  index = 0
}: PremiumBusinessCardProps) => {
  const description = `Discover amazing ${category.toLowerCase()} services and earn loyalty points`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  };

  // Calculate 3D transform based on mouse position
  const rotateX = isHovered ? (mousePosition.y - 0.5) * -10 : 0;
  const rotateY = isHovered ? (mousePosition.x - 0.5) * 10 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className="h-full perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-full transform-gpu transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect behind card */}
        <div 
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-mansagold/40 via-amber-500/30 to-mansagold/40 blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: 'translateZ(-10px)',
          }}
        />
        
        <Card className={`
          group h-full flex flex-col overflow-hidden relative
          bg-slate-900/90 backdrop-blur-xl border-white/10
          hover:border-mansagold/50 
          transition-all duration-500
          ${isFeatured ? 'ring-2 ring-mansagold/50 shadow-[0_0_50px_rgba(251,191,36,0.2)]' : ''}
        `}>
          {/* Shine effect overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: isHovered 
                ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(251,191,36,0.15) 0%, transparent 50%)`
                : 'none',
            }}
          />
          
          {isFeatured && (
            <div className="relative overflow-hidden bg-gradient-to-r from-mansagold via-amber-400 to-mansagold text-slate-900 text-xs font-bold px-3 py-2 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured Business
                <Sparkles className="h-3 w-3" />
              </span>
            </div>
          )}
          {isSample && (
            <div className="bg-gradient-to-r from-mansablue to-blue-600 text-white text-xs font-semibold px-3 py-1.5 text-center">
              📋 Sample Business - For demonstration purposes
            </div>
          )}
          
          <CardHeader className="pb-3">
            <div className="aspect-video bg-slate-800 rounded-lg mb-4 overflow-hidden ring-1 ring-white/10 relative group/image">
              <OptimizedImage 
                src={imageUrl || generatePlaceholder(400, 250, name)} 
                alt={imageAlt || name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover/image:brightness-110"
                fallbackSrc={generatePlaceholder(400, 250, name)}
                quality="medium"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* HBCU Badge */}
              {isHBCUCategory(category) && <HBCUBadge variant="overlay" />}
            </div>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl leading-tight truncate text-mansagold group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] transition-all duration-300">
                  {name}
                </CardTitle>
                <Badge variant="secondary" className="mt-1 bg-white/10 text-gray-300 border-white/20 group-hover:bg-mansagold/20 group-hover:text-mansagold group-hover:border-mansagold/30 transition-colors duration-300">
                  {category}
                </Badge>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 group-hover:bg-emerald-500/30 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all duration-300">
                {discount}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <CardDescription className="mb-3 line-clamp-2 text-base text-gray-300 group-hover:text-gray-200 transition-colors">
              {description}
            </CardDescription>
            
            {address && (
              <div className="flex items-center text-base text-gray-300 mb-2 group-hover:text-gray-200 transition-colors">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-mansagold/70" />
                <span className="truncate">{address}</span>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center text-base text-gray-300 mb-3 group-hover:text-gray-200 transition-colors">
                <Phone className="h-4 w-4 mr-1.5 flex-shrink-0 text-mansagold/70" />
                <a href={`tel:${phone}`} className="hover:text-mansagold transition-colors">{phone}</a>
              </div>
            )}
            
            <div className="flex items-center justify-between text-base text-gray-300 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-mansagold mr-1 fill-mansagold drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
                <span className="text-white font-medium">{rating}</span>
                <span className="ml-1 text-gray-400">({reviewCount} reviews)</span>
              </div>
              {distance && (
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{distance}</span>
                </div>
              )}
            </div>
            
            {isVerified && (
              <div className="mb-4">
                <VerifiedBlackOwnedBadge tier="certified" variant="compact" showTooltip={true} />
              </div>
            )}
            
            <div className="mt-auto">
              <Link to={`/business/${id}`}>
                <Button className="w-full relative overflow-hidden bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansagold hover:to-amber-500 hover:text-slate-900 transition-all duration-500 font-semibold group/btn">
                  <span className="relative z-10 flex items-center justify-center">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default PremiumBusinessCard;
