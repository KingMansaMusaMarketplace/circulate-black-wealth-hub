import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { FAQStructuredData } from "@/components/SEO/FAQStructuredData";
import {
  CATEGORY_GROUPS,
  TOP_CITY_SLUGS,
  cityLabelFromSlug,
  getCategoryGroupBySlug,
} from "@/lib/seo/category-groups";

interface BizRow {
  id: string;
  slug: string | null;
  business_name: string | null;
  name: string | null;
  description: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean | null;
  average_rating: number | null;
  review_count: number | null;
  total_count: number;
}

export default function CityCategoryLandingPage() {
  const { citySlug = "", categoryGroup = "" } = useParams();
  const group = getCategoryGroupBySlug(categoryGroup);
  const [rows, setRows] = useState<BizRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!group || !citySlug) return;
    setLoading(true);
    supabase
      .rpc("get_businesses_by_city_and_categories", {
        p_city_slug: citySlug,
        p_categories: group.categories,
        p_limit: 60,
        p_offset: 0,
      })
      .then(({ data }) => {
        const list = (data || []) as BizRow[];
        setRows(list);
        setTotal(list[0]?.total_count ? Number(list[0].total_count) : 0);
        setLoading(false);
      });
  }, [citySlug, categoryGroup, group]);

  if (!group) return <Navigate to="/black-owned" replace />;

  const cityLabel = rows[0]
    ? `${rows[0].city}, ${rows[0].state}`
    : cityLabelFromSlug(citySlug);
  const cityOnly = cityLabel.split(",")[0];

  const heading = `Black-Owned ${group.label} in ${cityLabel}`;
  const path = `/black-owned/in/${citySlug}/${group.slug}`;
  const url = `https://1325.ai${path}`;

  const description =
    total > 0
      ? `Browse ${total.toLocaleString()} verified Black-owned ${group.label.toLowerCase()} in ${cityLabel}. Real reviews, photos, hours and contact info — updated daily on 1325.AI.`
      : `Discover Black-owned ${group.label.toLowerCase()} in ${cityLabel}. Verified listings, reviews and contact info on 1325.AI.`;

  const intro = `Looking for the best Black-owned ${group.label.toLowerCase()} in ${cityOnly}? You're in the right place. 1325.AI lists ${total.toLocaleString()} verified Black-owned ${group.singular.toLowerCase()} businesses across ${cityLabel}, with real reviews, photos and contact information. Whether you want to support local Black entrepreneurs, find a new neighborhood favorite, or book a service today, every listing on this page has been verified for ownership and location. New ${group.label.toLowerCase()} are added every week — bookmark this page and check back often.`;

  const faqs = [
    {
      question: `How many Black-owned ${group.label.toLowerCase()} are there in ${cityOnly}?`,
      answer: `1325.AI currently lists ${total.toLocaleString()} verified Black-owned ${group.label.toLowerCase()} in ${cityLabel}. The list is updated as new businesses are verified.`,
    },
    {
      question: `How do I find Black-owned ${group.label.toLowerCase()} near me in ${cityOnly}?`,
      answer: `Browse the listings on this page — they're sorted by verification status and rating. You can also visit 1325.ai/directory to filter by neighborhood, distance, and other criteria.`,
    },
    {
      question: `Are these Black-owned ${group.label.toLowerCase()} verified?`,
      answer: `Yes. Every business on 1325.AI goes through an ownership and location verification process. Verified businesses display a verification badge so you can shop and book with confidence.`,
    },
    {
      question: `Can I add my Black-owned ${group.singular.toLowerCase()} business in ${cityOnly} to 1325.AI?`,
      answer: `Yes — register your business for free at 1325.ai/register. Once verified, your business will appear on this page and across the 1325.AI directory.`,
    },
  ];

  // Schema.org ItemList for richer search results
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: heading,
    description,
    numberOfItems: total,
    itemListElement: rows.slice(0, 20).map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: b.business_name || b.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address || undefined,
          addressLocality: b.city || undefined,
          addressRegion: b.state || undefined,
        },
        telephone: b.phone || undefined,
        url: b.website || undefined,
        image: b.logo_url || b.banner_url || undefined,
        aggregateRating:
          b.average_rating && b.review_count
            ? {
                "@type": "AggregateRating",
                ratingValue: Number(b.average_rating).toFixed(1),
                reviewCount: b.review_count,
              }
            : undefined,
      },
    })),
  };

  // Related cities (same category, different cities) for internal linking
  const relatedCities = TOP_CITY_SLUGS.filter((c) => c !== citySlug).slice(0, 8);
  // Related categories in this same city
  const relatedCategories = CATEGORY_GROUPS.filter((g) => g.slug !== group.slug).slice(0, 8);

  return (
    <>
      <Helmet>
        <title>{`${heading} (${total.toLocaleString()}) | 1325.AI`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={heading} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      {total > 0 && <FAQStructuredData faqs={faqs} />}

      <main className="container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link to="/black-owned" className="hover:underline">
            Black-Owned Directory
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/black-owned/city/${citySlug}`} className="hover:underline">
            {cityLabel}
          </Link>
          <span className="mx-2">/</span>
          <span>{group.label}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{heading}</h1>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">{intro}</p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-muted-foreground mb-4">
              We don't have any verified Black-owned {group.label.toLowerCase()} listed in {cityLabel} yet.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/black-owned/category/${group.categories[0] ? group.slug : ""}`}
                className="text-primary hover:underline"
              >
                Browse all {group.label.toLowerCase()} nationwide →
              </Link>
              <Link to={`/black-owned/city/${citySlug}`} className="text-primary hover:underline">
                Browse all Black-owned businesses in {cityOnly} →
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((b) => (
              <li key={b.id}>
                <Link
                  to={`/business/${b.slug || b.id}`}
                  className="block h-full rounded-lg border border-border bg-card hover:shadow-md transition p-4"
                >
                  <div className="flex items-start gap-3">
                    {b.logo_url && (
                      <img
                        src={b.logo_url}
                        alt={`${b.business_name || b.name} logo`}
                        className="w-12 h-12 rounded object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{b.business_name || b.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{b.category}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {b.address ? `${b.address}, ` : ""}
                        {b.city}, {b.state}
                      </p>
                      {b.average_rating ? (
                        <p className="text-xs mt-1">
                          ★ {Number(b.average_rating).toFixed(1)} ({b.review_count || 0})
                        </p>
                      ) : null}
                      {b.is_verified && (
                        <span className="inline-block mt-1 text-xs font-medium text-primary">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {total > rows.length && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Showing top {rows.length} of {total.toLocaleString()}.{" "}
            <Link to="/directory" className="underline">
              View all in directory
            </Link>
            .
          </p>
        )}

        {/* Internal linking: related categories in this city */}
        <section className="mt-16" aria-labelledby="related-cats">
          <h2 id="related-cats" className="text-xl font-bold mb-4">
            More Black-owned categories in {cityOnly}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedCategories.map((g) => (
              <li key={g.slug}>
                <Link
                  to={`/black-owned/in/${citySlug}/${g.slug}`}
                  className="inline-block px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-accent transition"
                >
                  {g.label} in {cityOnly}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Internal linking: same category in other cities */}
        <section className="mt-10" aria-labelledby="related-cities">
          <h2 id="related-cities" className="text-xl font-bold mb-4">
            Black-owned {group.label.toLowerCase()} in other cities
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedCities.map((c) => (
              <li key={c}>
                <Link
                  to={`/black-owned/in/${c}/${group.slug}`}
                  className="inline-block px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-accent transition"
                >
                  {group.label} in {cityLabelFromSlug(c)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {total > 0 && (
          <section className="mt-16 max-w-3xl mx-auto" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {faqs.map((f) => (
                <div key={f.question} className="border-b border-border pb-4">
                  <dt className="font-semibold text-base mb-2">{f.question}</dt>
                  <dd className="text-muted-foreground text-sm leading-relaxed">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-16 rounded-lg bg-card border border-border p-6 text-center">
          <h2 className="text-xl font-bold mb-2">
            Own a Black-owned {group.singular.toLowerCase()} in {cityOnly}?
          </h2>
          <p className="text-muted-foreground mb-4">
            List your business for free and reach customers searching for Black-owned {group.label.toLowerCase()} every day.
          </p>
          <Link
            to="/business/signup"
            className="inline-block px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Add your business
          </Link>
        </section>
      </main>
    </>
  );
}
