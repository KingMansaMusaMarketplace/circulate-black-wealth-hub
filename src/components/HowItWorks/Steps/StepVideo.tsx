
import React from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';

interface StepVideoProps {
  isVisible: boolean;
}

const StepVideo: React.FC<StepVideoProps> = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-16 max-w-3xl mx-auto space-y-8"
    >
      <h3 className="heading-sm text-center mb-6 bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 bg-clip-text text-transparent font-extrabold animate-fade-in">
        See How It Works
      </h3>
      
      {/* First Video - Mansa Musa Benefits Explained */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <VideoPlayer
          src="https://www.youtube.com/embed/71FmkfENYDI"
          title="Mansa Musa Benefits Explained"
          isYouTube={true}
          className="w-full"
        />
      </div>

      {/* Second Video - Additional Video */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <VideoPlayer
          src="https://www.youtube.com/embed/1tJRcDCuowU"
          title="Learn More About Our Platform"
          isYouTube={true}
          className="w-full"
        />
      </div>
    </motion.div>
  );
};

export default StepVideo;
