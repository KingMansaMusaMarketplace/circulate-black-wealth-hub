import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const BetaChallengeSection = () => {
  const navigate = useNavigate();
  const targetDate = new Date('2026-03-31T23:59:59');
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-mansablue">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-mansagold rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8"
          >
            <Calendar className="w-5 h-5 text-mansagold" />
            <span className="text-white font-semibold">Beta Testing Challenge</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Help Us Reach <span className="text-mansagold">1,000,000 Strong</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto"
          >
            Be a founding member of the Black economic empowerment movement
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-white/80 mb-12 max-w-2xl mx-auto"
          >
            Our first milestone: <strong>1,000,000 founding members</strong> by March 2026
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-3xl mx-auto"
          >
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="text-4xl md:text-5xl font-bold text-mansagold mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-wrap justify-center gap-8 mb-12 text-white/90"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-mansagold" />
              <span className="text-lg font-semibold">Goal: 1,000,000 Founding Members</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-mansagold" />
              <span className="text-lg font-semibold">Deadline: March 2026</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-mansagold hover:bg-mansagold-dark text-primary font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Join the Movement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-8 text-white/70 text-sm max-w-2xl mx-auto"
          >
            Together, we're building economic power and creating opportunities for Black businesses and communities nationwide.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default BetaChallengeSection;
