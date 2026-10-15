import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import video from '@/assets/why-1325-ep1-v7.mp4.asset.json';
import poster from '@/assets/why-1325-ep1-v7-poster.jpg.asset.json';
import TapToPlayVideo from './TapToPlayVideo';

/** Home page founder video: Building in Public, Episode 1 ("Day Zero"). */
const WhyNowVideo: React.FC = () => (
  <section className="px-4 py-16 md:py-24 border-t border-white/10">
    <div className="max-w-5xl mx-auto text-center">
      <span className="text-mansagold text-xs font-mono tracking-widest uppercase">
        Watch · Episode 1 · 4 min 33 sec
      </span>
      <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-5">WHY 1325.AI?</h2>
      <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
        Founder Thomas D. Bowling tells the story behind 1325.AI: growing up in Bronzeville, watching
        the businesses leave, and building a system for Black-owned businesses that can't be torn down.
      </p>
      <TapToPlayVideo
        src={video.url}
        poster={poster.url}
        label="Play the WHY 1325.AI? video"
        className="!max-w-4xl !aspect-video"
      />
      <Link
        to="/business-signup"
        className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-mansagold text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:scale-105 transition-transform"
      >
        Get listed <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

export default WhyNowVideo;
