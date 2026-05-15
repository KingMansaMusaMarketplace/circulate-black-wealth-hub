import SEOLandingPage from "@/components/seo/SEOLandingPage";

export default function BlackOwnedResortsPage() {
  return (
    <SEOLandingPage
      title="Black-Owned Resorts — Verified Directory"
      metaDescription="Discover verified Black-owned resorts and luxury retreats across the U.S. and Caribbean. Beach, mountain, and wellness resorts on 1325.AI."
      h1="Black-Owned Resorts"
      keyword="Black-owned resorts"
      path="/stays/black-owned-resorts"
      intro={
        <>
          Plan your next vacation at a verified <strong>Black-owned resort</strong>. 1325.AI lists
          beach, mountain, and wellness resorts owned and operated by Black entrepreneurs across
          the United States and the Caribbean. From luxury all-inclusive properties to family-run
          retreats, every resort is verified for ownership.
        </>
      }
      ctaPrimary={{ label: "Browse resorts on Mansa Stays", to: "/stays" }}
      ctaSecondary={{ label: "List your resort", to: "/stays/list-property" }}
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Stays", to: "/stays" },
        { label: "Black-Owned Resorts", to: "/stays/black-owned-resorts" },
      ]}
      cityLinkPattern={(slug, label) => ({
        to: `/black-owned/city/${slug}`,
        label: `Black-owned in ${label}`,
      })}
      faqs={[
        {
          question: "Are there Black-owned resorts in the U.S.?",
          answer:
            "Yes. Notable Black-owned resorts include Salamander Resort & Spa in Virginia, Couples Resorts in Jamaica, and Sandals (in partnership). 1325.AI maintains a verified directory of Black-owned resorts and luxury retreats.",
        },
        {
          question: "Are there Black-owned all-inclusive resorts in the Caribbean?",
          answer:
            "Yes — several Black-owned and Caribbean-owned resorts operate in Jamaica, the Bahamas, and Barbados. Browse Mansa Stays for verified Black-owned Caribbean properties.",
        },
        {
          question: "How do I book a Black-owned resort?",
          answer:
            "Browse the listings on Mansa Stays and book directly with the resort, or contact them through 1325.AI. Booking direct supports Black-owned businesses without third-party fees.",
        },
        {
          question: "How can I list my Black-owned resort?",
          answer:
            "Resort owners can list for free at 1325.ai/stays/list-property. Once verified, your property appears in this directory.",
        },
      ]}
    />
  );
}
