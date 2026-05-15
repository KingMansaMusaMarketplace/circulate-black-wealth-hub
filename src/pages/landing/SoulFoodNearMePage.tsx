import SEOLandingPage from "@/components/seo/SEOLandingPage";

export default function SoulFoodNearMePage() {
  return (
    <SEOLandingPage
      title="Soul Food Restaurants Near Me — Black-Owned Directory"
      metaDescription="Find soul food restaurants near you. The largest directory of verified Black-owned soul food restaurants, BBQ joints, and Southern kitchens in the U.S."
      h1="Soul Food Restaurants Near Me"
      keyword="soul food restaurants"
      path="/directory/soul-food-restaurants-near-me"
      intro={
        <>
          Craving real <strong>soul food</strong>? 1325.AI is the largest directory of verified
          Black-owned <strong>soul food restaurants</strong>, BBQ joints, fish fries, and Southern
          kitchens across the United States. Find authentic fried chicken, collards, mac & cheese,
          smothered pork chops, peach cobbler — and the family-owned spots serving them — in your city.
        </>
      }
      ctaPrimary={{ label: "Browse soul food restaurants", to: "/directory?category=Soul%20Food%20Restaurant" }}
      ctaSecondary={{ label: "List your restaurant", to: "/business-signup" }}
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Directory", to: "/directory" },
        { label: "Soul Food Restaurants", to: "/directory/soul-food-restaurants-near-me" },
      ]}
      cityLinkPattern={(slug, label) => ({
        to: `/black-owned/in/${slug}/restaurants`,
        label: `Soul food in ${label}`,
      })}
      faqs={[
        {
          question: "What is soul food?",
          answer:
            "Soul food is the traditional cuisine of African Americans in the Southern United States — fried chicken, collard greens, cornbread, mac & cheese, candied yams, smothered pork chops, black-eyed peas, and desserts like sweet potato pie and peach cobbler. It traces its roots to West African foodways combined with ingredients available to enslaved people in the American South.",
        },
        {
          question: "Where can I find the best soul food restaurants near me?",
          answer:
            "Use the city links above or visit 1325.ai/directory and filter by 'Soul Food Restaurant'. 1325.AI lists thousands of verified Black-owned soul food restaurants with reviews, hours, and contact info.",
        },
        {
          question: "What cities have the best soul food?",
          answer:
            "Atlanta, Memphis, New Orleans, Chicago, Detroit, Houston, and Harlem (NYC) are widely considered the top U.S. cities for soul food. 1325.AI lists hundreds of verified Black-owned soul food spots in each.",
        },
        {
          question: "Is soul food the same as Southern food?",
          answer:
            "There's overlap, but soul food specifically refers to the African American tradition rooted in the South. Many ingredients and dishes are shared with broader Southern cuisine, but soul food carries distinct cultural meaning and history.",
        },
        {
          question: "How can I list my soul food restaurant?",
          answer:
            "Restaurant owners can register free at 1325.ai/business-signup. Once verified, your restaurant appears in this directory and across 1325.AI.",
        },
      ]}
    />
  );
}
