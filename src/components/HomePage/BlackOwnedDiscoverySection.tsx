import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Store, ArrowRight, Search } from 'lucide-react';

const highlights = [
  { icon: MapPin, label: 'Atlanta', slug: 'atlanta' },
  { icon: MapPin, label: 'Houston', slug: 'houston' },
  { icon: MapPin, label: 'Chicago', slug: 'chicago' },
  { icon: MapPin, label: 'New York', slug: 'new-york' },
  { icon: MapPin, label: 'Los Angeles', slug: 'los-angeles' },
  { icon: MapPin, label: 'Dallas', slug: 'dallas' },
];

const categories = [
  { label: 'Restaurants', slug: 'restaurants' },
  { label: 'Beauty', slug: 'beauty' },
  { label: 'Retail', slug: 'retail' },
  { label: 'Services', slug: 'services' },
];

const BlackOwnedDiscoverySection: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 via-transparent to-mansagold/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-mansagold/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mansagold/10 border border-mansagold/30 text-mansagold text-sm font-semibold mb-4">
            <Store className="w-4 h-4" />
            Explore by Location & Category
          </div>
          <h2 className="heading-lg mb-4">
            Discover{' '}
            <span className="bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Black-Owned Businesses
            </span>{' '}
            Near You
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Browse thousands of verified Black-owned businesses across major cities and categories. 
            Support economic empowerment with every visit.
          </p>
        </motion.div>

        {/* Cities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4 text-center">
            Popular Cities
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {highlights.map((city) => (
              <Link
                key={city.slug}
                to={`/black-owned/city/${city.slug}`}
                className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-mansagold/50 hover:bg-mansagold/10 transition-all duration-300"
              >
                <MapPin className="w-4 h-4 text-mansagold group-hover:scale-110 transition-transform" />
                <span className="text-white/90 font-medium group-hover:text-mansagold transition-colors">
                  {city.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4 text-center">
            Top Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/black-owned/category/${cat.slug}`}
                className="group px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-mansagold/50 hover:bg-mansagold/10 transition-all duration-300"
              >
                <span className="text-white/90 font-medium group-hover:text-mansagold transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            to="/black-owned"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 text-mansablue font-bold text-lg hover:shadow-lg hover:shadow-mansagold/30 hover:scale-105 transition-all duration-300"
          >
            <Search className="w-5 h-5" />
            Browse All Cities & Categories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlackOwnedDiscoverySection;
