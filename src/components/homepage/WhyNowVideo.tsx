import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import video from '@/assets/why-1325-why-now.mp4.asset.json';
import poster from '@/assets/why-1325-why-now-poster.jpg.asset.json';

const YT_ID = 'JYFefyXl9WI';

const WhyNowVideo: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="px-4 py-16 md:py-24 border-t border-white/10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[minmax(0,360px)_1fr] gap-10 items-center">
        <div className="relative mx-auto w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border border-mansagold/30 bg-black">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="Why 1325.AI. Why now."
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play the Why 1325.AI video"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <img src={poster.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute inset-0 bg-black/30" />
              <span className="relative w-20 h-20 rounded-full bg-mansagold flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
              </span>
            </button>
          )}
        </div>
        <div className="text-center md:text-left">
          <span className="text-mansagold text-xs font-mono tracking-widest uppercase">Watch · 66 seconds</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-5">Why 1325.AI. Why now.</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Our culture made it everywhere — but our dollars still leave in hours. See how 1325.AI brings
            Black businesses, chambers and communities together on one platform.
          </p>
          <Link
            to="/business-signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-mansagold text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:scale-105 transition-transform"
          >
            Get listed <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyNowVideo;
