import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { FAQStructuredData } from "@/components/SEO/FAQStructuredData";

interface BizRow {
  id: string; slug: string | null; business_name: string | null; name: string | null;
  description: string | null; category: string | null; address: string | null;
  city: string | null; state: string | null; phone: string | null; website: string | null;
  logo_url: string | null; banner_url: string | null; is_verified: boolean | null;
  average_rating: number | null; review_count: number | null; total_count: number;
}

interface Props { mode: "city" | "category" }

export default function LandingListPage({ mode }: Props) {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [rows, setRows] = useState<BizRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const rpc = mode === "city" ? "get_businesses_by_city_slug" : "get_businesses_by_category_slug";
    supabase.rpc(rpc, { p_slug: slug, p_limit: 60, p_offset: 0 }).then(({ data }) => {
      const list = (data || []) as BizRow[];
      setRows(list);
      setTotal(list[0]?.total_count ? Number(list[0].total_count) : 0);
      setLoading(false);
    });
  }, [mode, slug]);

  const sample = rows[0];
  const label =
    mode === "city" && sample
      ? `${sample.city}, ${sample.state}`
      : mode === "category" && sample
      ? sample.category!
      : slug.replace(/-/g, " ");

  const heading =
    mode === "city" ? `Black-Owned Businesses in ${label}` : `Black-Owned ${label}`;
  const description =
    mode === "city"
      ? `Discover ${total.toLocaleString()} Black-owned businesses in ${label}. Restaurants, salons, services and more — verified and reviewed.`
      : `Browse ${total.toLocaleString()} Black-owned ${label.toLowerCase()} businesses across the United States. Verified listings with photos, reviews and contact info.`;

  const path = mode === "city" ? `/black-owned/city/${slug}` : `/black-owned/category/${slug}`;

  const faqs = mode === "city"
    ? [
        {
          question: `How many Black-owned businesses are in ${label}?`,
          answer: `1325.AI lists ${total.toLocaleString()} verified Black-owned businesses in ${label}, spanning restaurants, beauty, professional services, retail and more.`,
        },
        {
          question: `Where can I find Black-owned restaurants in ${label}?`,
          answer: `Browse the full list of Black-owned restaurants and food businesses in ${label} on this page, or search by category at 1325.ai/directory. Every listing is verified and includes hours, photos and reviews.`,
        },
        {
          question: `How do I support Black-owned businesses in ${label}?`,
          answer: `Visit, shop, or book services from any of the ${total.toLocaleString()} Black-owned businesses listed on this page. You can also leave reviews, share listings on social media, and earn loyalty rewards through 1325.AI for every visit.`,
        },
        {
          question: `Are these Black-owned businesses in ${label} verified?`,
          answer: `Yes. Every business on 1325.AI goes through an ownership and location verification process. Verified businesses display a verification badge on their listing.`,
        },
      ]
    : [
        {
          question: `How many Black-owned ${label.toLowerCase()} businesses are listed?`,
          answer: `1325.AI lists ${total.toLocaleString()} verified Black-owned ${label.toLowerCase()} businesses across the United States, with photos, reviews, and contact information.`,
        },
        {
          question: `How do I find a Black-owned ${label.toLowerCase()} business near me?`,
          answer: `Browse the listings on this page, or visit 1325.ai/directory to filter Black-owned ${label.toLowerCase()} businesses by city, rating, and verification status.`,
        },
        {
          question: `How are Black-owned ${label.toLowerCase()} businesses verified?`,
          answer: `Each listing goes through an ownership and location verification process. Verified businesses display a verification badge so you can shop and book with confidence.`,
        },
        {
          question: `Can I add my Black-owned ${label.toLowerCase()} business to 1325.AI?`,
          answer: `Yes — register your business for free at 1325.ai/register. Once verified, your business appears in this list and across the 1325.AI directory.`,
        },
      ];

  return (
    <>
      <Helmet>
        <title>{heading} ({total.toLocaleString()}) | 1325.AI</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://1325.ai${path}`} />
        <meta property="og:title" content={heading} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://1325.ai${path}`} />
      </Helmet>

      {total > 0 && <FAQStructuredData faqs={faqs} />}

      <main className="container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/black-owned" className="hover:underline">Black-Owned Directory</Link>
          <span className="mx-2">/</span>
          <span>{label}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{heading}</h1>
          <p className="text-muted-foreground">{description}</p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No businesses found. <Link to="/black-owned" className="underline">Browse all</Link>.</p>
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
                      <img src={b.logo_url} alt={`${b.business_name || b.name} logo`} className="w-12 h-12 rounded object-cover" loading="lazy" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{b.business_name || b.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{b.category}</p>
                      <p className="text-sm text-muted-foreground truncate">{b.city}, {b.state}</p>
                      {b.average_rating ? (
                        <p className="text-xs mt-1">★ {Number(b.average_rating).toFixed(1)} ({b.review_count || 0})</p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {total > rows.length && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Showing top {rows.length} of {total.toLocaleString()}. <Link to="/directory" className="underline">View all in directory</Link>.
          </p>
        )}

        {total > 0 && (
          <section className="mt-16 max-w-3xl mx-auto" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
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
      </main>
    </>
  );
}
