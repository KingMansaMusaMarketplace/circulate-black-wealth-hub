import { Helmet } from 'react-helmet';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export const FAQStructuredData = ({ faqs }: FAQStructuredDataProps) => {
  if (!faqs || faqs.length === 0) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

// Common FAQs for the marketplace
export const marketplaceFAQs: FAQItem[] = [
  {
    question: 'What is 1325.AI?',
    answer: '1325.AI is a digital platform dedicated to connecting consumers with verified community businesses. We make it easy to discover, support, and engage with local entrepreneurs while earning rewards for your loyalty.',
  },
  {
    question: 'How do I find verified businesses near me?',
    answer: 'Use our Business Directory to search by category, location, or business name. Each listing includes details like address, hours, reviews, and direct contact information.',
  },
  {
    question: 'How does the loyalty points system work?',
    answer: 'Earn points by visiting businesses, making purchases, leaving reviews, and referring friends. Points can be redeemed for discounts, rewards, and exclusive offers from participating businesses.',
  },
  {
    question: 'How can I register my business?',
    answer: 'Click "Register Your Business" and complete the verification process. Once approved, you\'ll have access to a dashboard to manage your listing, respond to reviews, and track customer engagement.',
  },
  {
    question: 'What is the Ambassador Program?',
    answer: 'Our Ambassador Program allows community members to earn commissions by referring new businesses to the platform. Ambassadors receive training, marketing materials, and ongoing support.',
  },
  {
    question: 'How do corporate sponsors support community businesses?',
    answer: 'Corporate sponsors fund rewards, provide matching grants, and offer promotional opportunities for businesses on our platform. This creates a sustainable ecosystem that benefits everyone.',
  },
  {
    question: 'Is the platform free to use for consumers?',
    answer: 'Yes! Consumers can browse, search, and discover verified businesses completely free. You can also earn and redeem loyalty points at no cost.',
  },
  {
    question: 'How are businesses verified?',
    answer: 'We have a thorough verification process that confirms business ownership, location, and legitimacy. Verified businesses display a verification badge on their listing.',
  },
];

export default FAQStructuredData;
