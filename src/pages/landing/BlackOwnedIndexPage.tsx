import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

interface CityRow { city: string; state: string; slug: string; business_count: number }
interface CategoryRow { category: string; slug: string; business_count: number }

export default function BlackOwnedIndexPage() {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    (async () => {
      const [c, k] = await Promise.all([
        supabase.rpc("list_landing_cities", { p_min_count: 5 }),
        supabase.rpc("list_landing_categories", { p_min_count: 5 }),
      ]);
      if (c.data) setCities(c.data as CityRow[]);
      if (k.data) setCategories(k.data as CategoryRow[]);
    })();
  }, []);

  const totalCount = cities.reduce((s, c) => s + Number(c.business_count || 0), 0);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Black-Owned Global Business Directory",
    description:
      "The largest verified Black-owned global business directory in the United States. Find Black-owned restaurants, salons, barbershops, contractors and more by city and category.",
    url: "https://1325.ai/black-owned",
    isPartOf: { "@type": "WebSite", name: "1325.AI", url: "https://1325.ai/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount || 43000,
      itemListElement: cities.slice(0, 20).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Black-Owned Businesses in ${c.city}, ${c.state}`,
        url: `https://1325.ai/black-owned/city/${c.slug}`,
      })),
    },
  };

  return (
    <>
      <Helmet>
        <title>Black-Owned Global Business Directory | 43,000+ Verified Listings | 1325.AI</title>
        <meta name="description" content="The largest verified Black-owned global business directory. Find 43,000+ Black-owned restaurants, salons, barbershops, contractors & services near you. Free on 1325.AI." />
        <meta name="keywords" content="Black-owned global business directory, Black-owned businesses near me, find Black-owned businesses, Black business directory, minority business marketplace, African American business directory, support Black-owned businesses" />
        <link rel="canonical" href="https://1325.ai/black-owned" />
        <meta property="og:title" content="Black-Owned Global Business Directory | 43,000+ Verified Listings" />
        <meta property="og:description" content="Find 43,000+ verified Black-owned businesses by city and category on 1325.AI." />
        <meta property="og:url" content="https://1325.ai/black-owned" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Helmet>

      <main className="dark container mx-auto px-4 py-12 bg-background text-foreground min-h-screen">
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Black-Owned Global Business Directory</h1>
          <p className="text-muted-foreground text-lg mb-2">
            Find <strong>{(totalCount || 43000).toLocaleString()}+</strong> verified Black-owned businesses near you — restaurants, salons, barbershops, contractors and services across the United States.
          </p>
          <p className="text-sm text-muted-foreground">
            The largest Black-owned global business directory and minority business marketplace, powered by 1325.AI.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Browse by City</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/black-owned/city/${c.slug}`}
                  className="block rounded-md border border-border bg-card hover:bg-accent px-3 py-2 text-sm"
                >
                  Black-Owned in {c.city}, {c.state}
                  <span className="text-muted-foreground ml-1">({c.business_count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/black-owned/category/${c.slug}`}
                  className="block rounded-md border border-border bg-card hover:bg-accent px-3 py-2 text-sm"
                >
                  Black-Owned {c.category}
                  <span className="text-muted-foreground ml-1">({c.business_count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
