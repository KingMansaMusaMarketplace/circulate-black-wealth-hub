import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';
import video from '@/assets/holiday-special.mp4.asset.json';
import poster from '@/assets/holiday-special-poster.jpg.asset.json';
import TapToPlayVideo from './TapToPlayVideo';

const HolidayVideoCard: React.FC = () => (
  <section className="px-4 pb-16 md:pb-24">
    <div className="max-w-5xl mx-auto rounded-3xl border border-mansagold/40 bg-mansagold/5 p-6 md:p-10 grid md:grid-cols-[1fr_minmax(0,300px)] gap-8 items-center">
      <div className="text-center md:text-left order-2 md:order-1">
        <span className="inline-flex items-center gap-2 text-mansagold text-xs font-mono tracking-widest uppercase">
          <Gift className="w-4 h-4" /> Holiday Special · Oct 1 – Dec 31
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
          Pro for <span className="text-mansagold">$149/mo</span>, locked in forever
        </h2>
        <p className="text-white/70 mb-8">
          Regular price <span className="line-through">$299/mo</span>. Watch the video, then claim your spot.
        </p>
        <Link
          to="/holiday-special"
          className="inline-flex items-center gap-2 px-8 py-4 bg-mansagold text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:scale-105 transition-transform"
        >
          Claim the Holiday Special <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <TapToPlayVideo
        src={video.url}
        poster={poster.url}
        label="Play the Holiday Special video"
        className="order-1 md:order-2 max-w-[300px]"
      />
    </div>
  </section>
);

export default HolidayVideoCard;
