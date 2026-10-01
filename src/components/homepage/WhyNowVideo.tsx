import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import video from '@/assets/why-1325-why-now.mp4.asset.json';
import poster from '@/assets/why-1325-why-now-poster.jpg.asset.json';

const WhyNowVideo: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const start = () => {
    setPlaying(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  return (
    <section className="px-4 py-16 md:py-24 border-t border-white/10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[minmax(0,360px)_1fr] gap-10 items-center">
        <div className="relative mx-auto w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border border-mansagold/30 bg-black">
          <video
            ref={ref}
            src={video.url}
            poster={poster.url}
            preload="none"
            playsInline
            controls={playing}
            className="w-full h-full object-cover"
          />
          {!playing && (
            <button
              onClick={start}
              aria-label="Play the Why 1325.AI video"
              className="absolute inset-0 flex items-center justify-center bg-black/30 group"
            >
              <span className="w-20 h-20 rounded-full bg-mansagold flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
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
