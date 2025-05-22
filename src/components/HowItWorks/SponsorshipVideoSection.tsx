
import React from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';

const SponsorshipVideoSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See The Impact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how our marketplace is transforming communities and businesses through economic circulation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="shadow-lg rounded-xl overflow-hidden"
          >
            <VideoPlayer
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How Circulation Works"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
            />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg">How Circulation Works</h3>
              <p className="text-gray-600">Learn about the circulation of wealth within communities.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="shadow-lg rounded-xl overflow-hidden"
          >
            <VideoPlayer
              src="https://www.youtube.com/embed/71FmkfENYDI"
              title="Mansa Musa Benefits"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
            />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg">Marketplace Benefits</h3>
              <p className="text-gray-600">Discover the benefits of our marketplace for businesses and customers.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="shadow-lg rounded-xl overflow-hidden lg:col-span-1 md:col-span-2 lg:col-span-1"
          >
            <VideoPlayer
              src="https://www.youtube.com/embed/8jLOx1hD3_o"
              title="Community Impact"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
            />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg">Community Impact</h3>
              <p className="text-gray-600">Discover the positive changes in communities using our platform.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipVideoSection;
