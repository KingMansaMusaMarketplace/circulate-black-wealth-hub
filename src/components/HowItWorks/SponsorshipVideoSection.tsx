
import React from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';

const SponsorshipVideoSection = () => {
  return (
    <section className="py-16 relative overflow-hidden backdrop-blur-xl bg-white/5">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold mb-4 text-white">See The Impact</h2>
          <p className="text-lg font-semibold text-white/90 max-w-2xl mx-auto">
            Watch how if we stick together in our communities and businesses we can transform economic circulation of black empowerment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="shadow-xl rounded-2xl overflow-hidden border-2 border-white/20 hover:border-blue-400/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-white/10"
          >
            <VideoPlayer
              src="https://www.youtube.com/watch?v=-TjgPI4kid4"
              title="How Circulation Works"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
              onError={() => console.log("Error loading How Circulation Works video")}
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2 text-blue-300">How Circulation Works</h3>
              <p className="text-white/90 font-medium">Learn about the circulation of wealth within communities.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="shadow-xl rounded-2xl overflow-hidden border-2 border-white/20 hover:border-blue-400/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-white/10"
          >
            <VideoPlayer
              src="https://www.youtube.com/watch?v=-8M3YSYjKM0"
              title="Marketplace Benefits"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
              onError={() => console.log("Error loading Marketplace Benefits video")}
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2 text-blue-300">Marketplace Benefits</h3>
              <p className="text-white/90 font-medium">Discover the benefits of two brothers creating a empowerment zone for black businesses.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="shadow-xl rounded-2xl overflow-hidden lg:col-span-1 md:col-span-2 lg:col-span-1 border-2 border-white/20 hover:border-yellow-400/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-white/10"
          >
            <VideoPlayer
              src="https://www.youtube.com/watch?v=sn19xvfoXvk"
              title="Join Our Team"
              isYouTube={true}
              posterImage="/placeholder.svg"
              className="w-full"
              onError={() => console.log("Error loading Join Our Team video")}
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2 text-yellow-400">Join Our Team</h3>
              <p className="text-white/90 font-medium">Let's help one another get out of economic enslavement.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipVideoSection;
