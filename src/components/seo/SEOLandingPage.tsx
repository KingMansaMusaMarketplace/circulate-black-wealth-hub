import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FAQStructuredData } from "@/components/SEO/FAQStructuredData";
import { TOP_CITY_SLUGS, cityLabelFromSlug } from "@/lib/seo/category-groups";

export interface SEOLandingFAQ {
  question: string;
  answer: string;
}

export interface SEOLandingPageProps {
  title: string;          // <60 chars — used in <title>
  metaDescription: string; // <160 chars
  h1: string;
  intro: ReactNode;
  path: string;            // e.g. "/stays/black-owned-hotels"
  keyword: string;         // exact-match keyword for copy
  ctaPrimary: { label: string; to: string };
  ctaSecondary?: { label: string; to: string };
  faqs: SEOLandingFAQ[];
  cityLinkPattern?: (citySlug: string, cityLabel: string) => { to: string; label: string };
  breadcrumb: { label: string; to: string }[];
  bodyExtra?: ReactNode;
}

export default function SEOLandingPage({
  title,
  metaDescription,
  h1,
  intro,
  path,
  keyword,
  ctaPrimary,
  ctaSecondary,
  faqs,
  cityLinkPattern,
  breadcrumb,
  bodyExtra,
}: SEOLandingPageProps) {
  const url = `https://1325.ai${path}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `https://1325.ai${b.to}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>{`${title} | 1325.AI`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <FAQStructuredData faqs={faqs} />

      <main className="dark container mx-auto px-4 py-10 bg-background text-foreground min-h-screen">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          {breadcrumb.map((b, i) => (
            <span key={b.to}>
              {i > 0 && <span className="mx-2">/</span>}
              {i < breadcrumb.length - 1 ? (
                <Link to={b.to} className="hover:underline">{b.label}</Link>
              ) : (
                <span>{b.label}</span>
              )}
            </span>
          ))}
        </nav>

        <header className="mb-8 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{h1}</h1>
          <div className="text-muted-foreground leading-relaxed text-base md:text-lg">{intro}</div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to={ctaPrimary.to}
              className="inline-block px-6 py-3 rounded-md bg-mansagold text-black font-semibold hover:opacity-90 transition"
            >
              {ctaPrimary.label}
            </Link>
            {ctaSecondary && (
              <Link
                to={ctaSecondary.to}
                className="inline-block px-6 py-3 rounded-md border border-border bg-card font-medium hover:bg-accent transition"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </header>

        {bodyExtra}

        {cityLinkPattern && (
          <section className="mt-14" aria-labelledby="cities-heading">
            <h2 id="cities-heading" className="text-2xl font-bold mb-4">
              {keyword} by city
            </h2>
            <ul className="flex flex-wrap gap-2">
              {TOP_CITY_SLUGS.map((slug) => {
                const label = cityLabelFromSlug(slug);
                const link = cityLinkPattern(slug, label);
                return (
                  <li key={slug}>
                    <Link
                      to={link.to}
                      className="inline-block px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-accent transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold mb-6">
            Frequently asked questions about {keyword}
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

        <section className="mt-16 rounded-lg bg-card border border-border p-6 text-center max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Own a Black-owned business?</h2>
          <p className="text-muted-foreground mb-4">
            List for free on 1325.AI and reach customers actively searching for Black-owned options every day.
          </p>
          <Link
            to="/business-signup"
            className="inline-block px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Add your business
          </Link>
        </section>
      </main>
    </>
  );
}
