import SEOLandingPage from "@/components/seo/SEOLandingPage";

export default function BlackOwnedVacationRentalsPage() {
  return (
    <SEOLandingPage
      title="Black-Owned Vacation Rentals, Cabins & Airbnb Alternatives"
      metaDescription="Book verified Black-owned vacation rentals, cabins, and short-term stays. The Black-owned alternative to Airbnb and Vrbo. List or book on 1325.AI."
      h1="Black-Owned Vacation Rentals"
      keyword="Black-owned vacation rentals"
      path="/stays/black-owned-vacation-rentals"
      intro={
        <>
          Searching for a <strong>Black-owned Airbnb</strong> alternative? Mansa Stays, powered by
          1325.AI, is the largest directory of verified <strong>Black-owned vacation rentals</strong>,
          cabins, condos, and short-term stays. Hosts list their properties commission-free and
          guests support Black entrepreneurs every time they book.
        </>
      }
      ctaPrimary={{ label: "Browse vacation rentals", to: "/stays" }}
      ctaSecondary={{ label: "List your property", to: "/stays/list-property" }}
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Stays", to: "/stays" },
        { label: "Black-Owned Vacation Rentals", to: "/stays/black-owned-vacation-rentals" },
      ]}
      cityLinkPattern={(slug, label) => ({
        to: `/black-owned/city/${slug}`,
        label: `Stays in ${label}`,
      })}
      faqs={[
        {
          question: "Is there a Black-owned alternative to Airbnb?",
          answer:
            "Yes. Mansa Stays (part of 1325.AI) is a Black-owned vacation rental marketplace where Black hosts list properties and travelers can book directly. Unlike Airbnb, Mansa Stays charges hosts lower fees and centers Black-owned hospitality.",
        },
        {
          question: "How do I find Black-owned vacation rentals?",
          answer:
            "Browse Mansa Stays at 1325.ai/stays. Every property is verified Black-owned. You can filter by city, dates, and property type — including cabins, beach houses, and urban condos.",
        },
        {
          question: "Are there Black-owned cabins for rent?",
          answer:
            "Yes — 1325.AI lists Black-owned cabins in the Smoky Mountains, Catskills, Pacific Northwest, and other popular destinations. Browse the cabins category on Mansa Stays.",
        },
        {
          question: "How do I list my property as a Black-owned host?",
          answer:
            "Sign up free at 1325.ai/stays/list-property. After ownership verification, your property goes live on Mansa Stays and appears in this directory.",
        },
      ]}
    />
  );
}
