
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Benefit {
  title: string;
  description: string;
  details: string;
}

interface BenefitCardProps {
  benefit: Benefit;
  isExpanded: boolean;
  onToggle: () => void;
  isCustomer: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ 
  benefit, 
  isExpanded, 
  onToggle,
  isCustomer
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md border-l-4",
        isCustomer ? "border-l-mansablue" : "border-l-mansagold",
        isExpanded ? "shadow-md" : ""
      )}
    >
      <CardContent className="p-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 
              className={cn(
                "h-5 w-5 mt-1",
                isCustomer ? "text-mansablue" : "text-mansagold"
              )} 
            />
            <div>
              <h3 className="font-bold text-lg">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.2 }} 
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </motion.div>
        </div>
        
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t text-gray-600"
          >
            {benefit.details}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
