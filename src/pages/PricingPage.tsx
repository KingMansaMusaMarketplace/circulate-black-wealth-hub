import React, { useRef } from 'react';
import PricingSection from '@/components/HomePage/PricingSection';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { Helmet } from 'react-helmet-async';
import { Sparkles, ShieldCheck, CreditCard } from 'lucide-react';

const PricingPage: React.FC = () => {
  const signupRef = useRef<HTMLDivElement>(null);

  const scrollToSignup = () => {
    signupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mansagold/5 via-transparent to-transparent" />
      <div className="relative z-10 pt-20">
        <Helmet>
          <title>Pricing | Kayla AI - Plans for Every Business</title>
          <meta name="description" content="Choose the right Kayla AI plan for your business. From Essentials at $19/mo to Enterprise with multi-location support. Save ~$12,100/mo by replacing ~4 roles with Kayla AI." />
        </Helmet>

        <PricingSection />

        {/* Signup Section */}
        <section ref={signupRef} id="signup" className="py-16 md:py-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-mansagold to-transparent" />
          
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-4">
                <Sparkles className="w-4 h-4 text-mansagold" />
                <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">Get Started Today</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to <span className="text-mansagold">Transform</span> Your Business?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg">
                Sign up now and start your free trial. No credit card required to create your account.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Benefits Column */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4">Why businesses choose Kayla</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: '🤖', title: '28 Agentic AI Employees', desc: 'Working 24/7 across marketing, finance, operations & more' },
                      { icon: '💰', title: 'Save $1,650–$5,750/month', desc: 'Replace expensive labor costs with autonomous AI' },
                      { icon: '📈', title: 'Grow faster, work less', desc: 'Automated reviews, bookkeeping, marketing & community tools' },
                      { icon: '🔒', title: 'Enterprise-grade security', desc: 'Your data is encrypted and protected at every level' },
                    ].map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="text-2xl flex-shrink-0">{item.icon}</span>
                        <div>
                          <p className="text-white font-semibold text-sm">{item.title}</p>
                          <p className="text-white/50 text-xs">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 px-6">
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <CreditCard className="w-4 h-4 text-mansagold" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              {/* Signup Form Column */}
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-white mb-1">Create Your Account</h3>
                <p className="text-white/50 text-sm mb-6">Start your free trial in under 2 minutes</p>
                <BusinessSignupForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
