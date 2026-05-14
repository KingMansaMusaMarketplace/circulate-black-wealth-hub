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

  return (
    <>
      <Helmet>
        <title>Black-Owned Businesses Directory by City & Category | 1325.AI</title>
        <meta name="description" content="Browse thousands of Black-owned businesses by city and category. Find Black-owned restaurants, salons, contractors and more across the United States." />
        <link rel="canonical" href="https://1325.ai/black-owned" />
      </Helmet>

      <main className="dark container mx-auto px-4 py-12 bg-background text-foreground min-h-screen">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Black-Owned Businesses</h1>
          <p className="text-muted-foreground text-lg">
            Discover {cities.reduce((s, c) => s + Number(c.business_count || 0), 0).toLocaleString()}+ Black-owned businesses across the country.
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
