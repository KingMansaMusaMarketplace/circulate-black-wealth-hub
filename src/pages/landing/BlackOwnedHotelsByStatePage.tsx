import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FAQStructuredData } from "@/components/SEO/FAQStructuredData";
import { getStateBySlug, US_STATES } from "@/lib/seo/us-states";

// Per-state SEO landing page for "Black-owned hotels in {State}".
// URL: /stays/black-owned-hotels/:stateSlug  (e.g. /stays/black-owned-hotels/georgia)
export default function BlackOwnedHotelsByStatePage() {
  const { stateSlug = "" } = useParams<{ stateSlug: string }>();
  const state = getStateBySlug(stateSlug);

  if (!state) {
    return <Navigate to="/stays/black-owned-hotels" replace />;
  }

  const path = `/stays/black-owned-hotels/${state.slug}`;
  const url = `https://1325.ai${path}`;
  const title = `Black-Owned Hotels in ${state.name}`;
  const metaDescription = `Verified directory of Black-owned hotels, B&Bs, and inns in ${state.name}. Book direct, support Black entrepreneurs. Updated daily on 1325.AI.`;

  const faqs = [
    {
      question: `How many Black-owned hotels are in ${state.name}?`,
      answer: `1325.AI maintains a live directory of verified Black-owned hotels, bed & breakfasts, and inns across ${state.name}. The list grows as new properties are verified and added.`,
    },
    {
      question: `How do I book a Black-owned hotel in ${state.name}?`,
      answer: `Browse the listings above, then book directly with the property or through Mansa Stays. Booking direct keeps more revenue with the Black-owned business.`,
    },
    {
      question: `How can I add my ${state.name} hotel to this directory?`,
      answer: `Visit 1325.ai/stays/list-property to add your property for free. Once verified, it appears in this directory and on Mansa Stays.`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://1325.ai/" },
      { "@type": "ListItem", position: 2, name: "Stays", item: "https://1325.ai/stays" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Black-Owned Hotels",
        item: "https://1325.ai/stays/black-owned-hotels",
      },
      { "@type": "ListItem", position: 4, name: state.name, item: url },
    ],
  };

  // Show every other US state as an internal link to maximize crawl depth.
  const otherStates = US_STATES.filter((s) => s.slug !== state.slug);

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
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/stays" className="hover:underline">Stays</Link>
          <span className="mx-2">/</span>
          <Link to="/stays/black-owned-hotels" className="hover:underline">Black-Owned Hotels</Link>
          <span className="mx-2">/</span>
          <span>{state.name}</span>
        </nav>

        <header className="mb-8 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Black-Owned Hotels in {state.name}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Discover verified <strong>Black-owned hotels in {state.name}</strong> — boutique
            inns, bed & breakfasts, and full-service properties owned and operated by Black
            entrepreneurs. Every listing is verified for ownership so you can book with
            confidence and keep your dollars circulating in the community.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to={`/stays?state=${state.code}`}
              className="inline-block px-6 py-3 rounded-md bg-mansagold text-black font-semibold hover:opacity-90 transition"
            >
              Browse {state.name} hotels on Mansa Stays
            </Link>
            <Link
              to="/stays/list-property"
              className="inline-block px-6 py-3 rounded-md border border-border bg-card font-medium hover:bg-accent transition"
            >
              List your {state.name} hotel
            </Link>
          </div>
        </header>

        <section className="mt-12 rounded-lg border border-border bg-card p-6 max-w-4xl">
          <h2 className="text-xl font-bold mb-3">
            Why book a Black-owned hotel in {state.name}?
          </h2>
          <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed list-disc pl-6">
            <li>
              <strong>Support local ownership.</strong> Black-owned hotels reinvest in their
              {` `}{state.name} communities — your stay funds local jobs and entrepreneurship.
            </li>
            <li>
              <strong>Authentic hospitality.</strong> Most Black-owned properties are boutique,
              giving you a more personal experience than a chain.
            </li>
            <li>
              <strong>Verified ownership.</strong> 1325.AI confirms ownership before a property
              appears in this directory.
            </li>
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="other-states-heading">
          <h2 id="other-states-heading" className="text-2xl font-bold mb-4">
            Black-owned hotels in other states
          </h2>
          <ul className="flex flex-wrap gap-2">
            {otherStates.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/stays/black-owned-hotels/${s.slug}`}
                  className="inline-block px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-accent transition"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold mb-6">
            Frequently asked questions
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
          <h2 className="text-xl font-bold mb-2">Own a hotel in {state.name}?</h2>
          <p className="text-muted-foreground mb-4">
            List for free on 1325.AI and reach travelers actively searching for Black-owned
            accommodations every day.
          </p>
          <Link
            to="/business-signup"
            className="inline-block px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Add your hotel
          </Link>
        </section>
      </main>
    </>
  );
}
