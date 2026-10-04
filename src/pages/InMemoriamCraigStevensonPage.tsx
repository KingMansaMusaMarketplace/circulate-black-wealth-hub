import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import craig from '@/assets/team/navy_bg/Craig_Stevenson.jpg';

const InMemoriamCraigStevensonPage = () => (
  <>
    <Helmet>
      <title>In Memoriam: Craig Lamont Stevenson, Co-Founder | 1325.AI</title>
      <meta
        name="description"
        content="Honoring Craig Lamont Stevenson, Co-Founder of 1325.AI, February 3, 1962 to August 7, 2026."
      />
      <meta property="og:title" content="In Memoriam: Craig Lamont Stevenson, Co-Founder of 1325.AI" />
      <meta property="og:description" content="Honoring the life and legacy of our Co-Founder." />
      <link rel="canonical" href="https://1325.ai/in-memoriam/craig-stevenson" />
    </Helmet>

    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-mansagold/20">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-mansagold/60">
              <img src={craig} alt="Craig Lamont Stevenson" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-mansagold text-xs uppercase tracking-[0.35em] mb-6">In Memoriam</p>
            <h1 className="text-4xl md:text-6xl font-serif font-light leading-tight mb-4">
              Craig Lamont Stevenson
            </h1>
            <p className="text-mansagold uppercase tracking-widest text-sm mb-3">Co-Founder, 1325.AI</p>
            <p className="text-blue-100/70 italic">February 3, 1962 &ndash; August 7, 2026</p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 space-y-6 text-blue-100/85 text-lg leading-relaxed">
        <p>
          Craig stood among the founders of 1325.AI. He gave his name, his work and his belief to an idea
          long before that idea had proof, funding or applause.
        </p>
        <p>
          He understood that a dollar kept within our own community is more than a purchase. It is an act of
          self-determination. He gave himself to building the rails that dollar could travel on, so that
          Black-owned businesses everywhere could be found, trusted and prosperous.
        </p>
        <p>
          He counseled his partners honestly, encouraged the discouraged, and opened doors he did not need to
          open. Every business owner who came to this company was, to Craig, a neighbor rather than a customer.
        </p>
        <p>
          He carried our founding vision with patience in the lean seasons and with grace in the bright ones.
          By resolution of the Board, the title of Co-Founder is permanently attached to his name.
        </p>

        <blockquote className="my-12 pl-6 border-l-2 border-mansagold/60 italic text-blue-100/90">
          &ldquo;Well done, good and faithful servant.&rdquo;
        </blockquote>

        <div className="pt-4">
          <a
            href="/resolution-craig-stevenson.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-mansagold/60 text-mansagold rounded-full px-6 py-3 text-sm uppercase tracking-wider hover:bg-mansagold/10 transition-colors"
          >
            Read the Board&rsquo;s Resolution in Memoriam
          </a>
        </div>
      </section>

      <section className="border-t border-mansagold/20">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-xl md:text-2xl font-serif font-light text-white/90">
            His work continues in every business on this platform.
          </p>
          <Link to="/team" className="inline-block mt-8 text-sm text-mansagold hover:underline">
            Back to the team
          </Link>
        </div>
      </section>
    </main>
  </>
);

export default InMemoriamCraigStevensonPage;
