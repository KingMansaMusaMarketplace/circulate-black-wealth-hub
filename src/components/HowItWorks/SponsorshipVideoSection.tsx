
import React from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';

const SponsorshipVideoSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">See The Impact</h2>
          <p className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto">
            Watch how if we stick together in our communities and businesses we can transform economic circulation of black empowerment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="shadow-xl rounded-2xl overflow-hidden border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <VideoPlayer
              src="https://www.youtube.com/watch?v=-TjgPI4kid4"
              title="How Circulation Works"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
              onError={() => console.log("Error loading How Circulation Works video")}
            />
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white">
              <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">How Circulation Works</h3>
              <p className="text-gray-700 font-medium">Learn about the circulation of wealth within communities.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="shadow-xl rounded-2xl overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <VideoPlayer
              src="https://www.youtube.com/watch?v=-8M3YSYjKM0"
              title="Marketplace Benefits"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
              onError={() => console.log("Error loading Marketplace Benefits video")}
            />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Marketplace Benefits</h3>
              <p className="text-gray-700 font-medium">Discover the benefits of two brothers creating a empowerment zone for black businesses.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="shadow-xl rounded-2xl overflow-hidden lg:col-span-1 md:col-span-2 lg:col-span-1 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <VideoPlayer
              src="https://www.youtube.com/watch?v=sn19xvfoXvk"
              title="Join Our Team"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
              onError={() => console.log("Error loading Join Our Team video")}
            />
            <div className="p-6 bg-gradient-to-br from-pink-50 to-white">
              <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">Join Our Team</h3>
              <p className="text-gray-700 font-medium">Let's help one another get out of economic enslavement.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipVideoSection;
