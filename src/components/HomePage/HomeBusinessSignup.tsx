import React from 'react';
import { Link } from 'react-router-dom';
import QuickBusinessSignup from '@/components/auth/forms/QuickBusinessSignup';
import { isNativeApp } from '@/utils/platform-utils';

/** Homepage short business sign-up (same form as /business-signup). Hidden in the iOS app, where business sign-up is web-only. */
const HomeBusinessSignup: React.FC = () => {
  if (isNativeApp()) return null;
  return (
    <section id="list-your-business" className="py-8 md:py-12 px-4 scroll-mt-24">
      <QuickBusinessSignup asSection />
      <p className="text-center mt-4 text-white">
        Shopping, not selling?{' '}
        <Link to="/signup" className="font-semibold text-mansagold underline">Join free →</Link>
      </p>
    </section>
  );
};

export default HomeBusinessSignup;
