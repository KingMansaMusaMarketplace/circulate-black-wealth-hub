import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import video from '@/assets/autonomous-workforce.mp4.asset.json';
import poster from '@/assets/autonomous-workforce-poster.jpg.asset.json';
import TapToPlayVideo from './TapToPlayVideo';

const AutonomousWorkforceVideo: React.FC = () => (
  <section className="px-4 py-16 md:py-24">
    <div className="max-w-5xl mx-auto rounded-3xl border border-mansagold/40 bg-mansagold/5 p-6 md:p-10 grid md:grid-cols-[minmax(0,300px)_1fr] gap-8 items-center">
      <TapToPlayVideo
        src={video.url}
        poster={poster.url}
        label="Play the Meet your autonomous workforce video"
        className="max-w-[300px] mx-auto md:mx-0"
      />
      <div className="text-center md:text-left">
        <span className="inline-flex items-center gap-2 text-mansagold text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-4 h-4" /> Kayla + 42 Agentic AI Employees
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
          Meet your <span className="text-mansagold">autonomous workforce.</span>
        </h2>
        <p className="text-white/70 mb-8">
          Kayla and 42 Agentic AI Employees run the back office so you can run your business.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 bg-mansagold text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:scale-105 transition-transform"
        >
          Start free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default AutonomousWorkforceVideo;
