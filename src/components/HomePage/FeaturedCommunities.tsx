import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';

/**
 * SEO internal-linking hub.
 *
 * Renders REAL <a> anchors (via React Router <Link>) to city and category
 * landing pages so Googlebot can discover and crawl them from the homepage.
 * This is the single highest-leverage on-site change for indexing the
 * 46,000+ business pages stuck in "Discovered – not indexed".
 *
 * The destination pages already exist (registered in landing-sitemap.xml).
 * The homepage just didn't link to them before.
 */

const TOP_CITIES: { slug: string; label: string }[] = [
  { slug: 'atlanta-ga',       label: 'Atlanta, GA' },
  { slug: 'chicago-il',       label: 'Chicago, IL' },
  { slug: 'houston-tx',       label: 'Houston, TX' },
  { slug: 'detroit-mi',       label: 'Detroit, MI' },
  { slug: 'new-york-ny',      label: 'New York, NY' },
  { slug: 'los-angeles-ca',   label: 'Los Angeles, CA' },
  { slug: 'washington-dc',    label: 'Washington, DC' },
  { slug: 'philadelphia-pa',  label: 'Philadelphia, PA' },
  { slug: 'dallas-tx',        label: 'Dallas, TX' },
  { slug: 'memphis-tn',       label: 'Memphis, TN' },
  { slug: 'baltimore-md',     label: 'Baltimore, MD' },
  { slug: 'charlotte-nc',     label: 'Charlotte, NC' },
];

const TOP_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'restaurants',      label: 'Restaurants' },
  { slug: 'hair-salons',      label: 'Hair Salons' },
  { slug: 'barbershops',      label: 'Barbershops' },
  { slug: 'nail-salons',      label: 'Nail Salons' },
  { slug: 'coffee-shops',     label: 'Coffee Shops' },
  { slug: 'spas',             label: 'Spas & Wellness' },
  { slug: 'boutiques',        label: 'Boutiques' },
  { slug: 'creative-studios', label: 'Creative Studios' },
  { slug: 'contractors',      label: 'Contractors' },
  { slug: 'auto-services',    label: 'Auto Services' },
  { slug: 'real-estate',      label: 'Real Estate' },
  { slug: 'florists',         label: 'Florists' },
];

const FeaturedCommunities = () => {
  return (
    <section
      aria-label="Browse Black-owned businesses by city and category"
      className="relative z-10 py-16 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Explore the Directory
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            43,000+ verified Black-owned businesses across the United States.
            Browse by city or category.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cities */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-mansagold mb-4">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              Top Cities
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {TOP_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/black-owned/city/${c.slug}`}
                    className="text-white/85 hover:text-mansagold transition-colors text-sm md:text-base"
                  >
                    Black-Owned Businesses in {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-mansagold mb-4">
              <Tag className="h-5 w-5" aria-hidden="true" />
              Popular Categories
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {TOP_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/black-owned/category/${c.slug}`}
                    className="text-white/85 hover:text-mansagold transition-colors text-sm md:text-base"
                  >
                    Black-Owned {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/black-owned-business-directory"
            className="inline-block text-mansagold hover:text-amber-300 underline underline-offset-4 font-medium"
          >
            View the full directory →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCommunities;
