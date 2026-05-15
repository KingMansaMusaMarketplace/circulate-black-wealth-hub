import SEOLandingPage from "@/components/seo/SEOLandingPage";

export default function BlackOwnedHotelsPage() {
  return (
    <SEOLandingPage
      title="Black-Owned Hotels — Verified Directory"
      metaDescription="Find verified Black-owned hotels across the U.S. Browse boutique hotels, B&Bs, and inns owned by Black entrepreneurs. Updated daily on 1325.AI."
      h1="Black-Owned Hotels"
      keyword="Black-owned hotels"
      path="/stays/black-owned-hotels"
      intro={
        <>
          Looking to support Black entrepreneurs on your next trip? 1325.AI lists verified
          <strong> Black-owned hotels</strong>, boutique inns, and bed & breakfasts across the
          United States — from historic properties in the South to modern boutique stays in major
          cities. Every property is verified for ownership so you can book with confidence.
        </>
      }
      ctaPrimary={{ label: "Browse hotels on Mansa Stays", to: "/stays" }}
      ctaSecondary={{ label: "List your hotel", to: "/stays/list-property" }}
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Stays", to: "/stays" },
        { label: "Black-Owned Hotels", to: "/stays/black-owned-hotels" },
      ]}
      cityLinkPattern={(slug, label) => ({
        to: `/black-owned/in/${slug}/restaurants`,
        label: `Black-owned in ${label}`,
      })}
      faqs={[
        {
          question: "What is the best Black-owned hotel in the U.S.?",
          answer:
            "Top-rated Black-owned hotels include The Akwaaba Bed & Breakfast (Brooklyn, NY), Salamander Resort (Middleburg, VA, owned by Sheila Johnson), and the historic A.G. Gaston Motel (Birmingham, AL). 1325.AI keeps a live directory of verified Black-owned hotels with reviews and booking info.",
        },
        {
          question: "How do I find Black-owned hotels near me?",
          answer:
            "Use the city links above or visit 1325.ai/stays to filter accommodations by location. Every hotel listed on 1325.AI is verified Black-owned.",
        },
        {
          question: "Are Black-owned hotels more expensive than chain hotels?",
          answer:
            "No. Black-owned hotels are competitively priced and often offer a more personal, boutique experience than large chain properties. Many list directly on Mansa Stays so you avoid third-party booking fees.",
        },
        {
          question: "How can I list my Black-owned hotel?",
          answer:
            "Visit 1325.ai/stays/list-property to add your property for free. Once verified, it appears in this directory and on Mansa Stays.",
        },
      ]}
    />
  );
}
