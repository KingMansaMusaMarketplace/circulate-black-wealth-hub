import { assetUrl } from '@/utils/assetUrl';
import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface Props {
  src: string;
  poster: string;
  label: string;
  className?: string;
}

/** Vertical video that shows a cover + gold play button and only loads when tapped. */
const TapToPlayVideo: React.FC<Props> = ({ src, poster, label, className = '' }) => {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const start = () => {
    setPlaying(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  return (
    <div className={`relative mx-auto w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border border-mansagold/30 bg-black ${className}`}>
      <video
        ref={ref}
        src={assetUrl(src)}
        poster={assetUrl(poster)}
        preload="none"
        playsInline
        controls={playing}
        className="w-full h-full object-cover"
      />
      {!playing && (
        <button
          onClick={start}
          aria-label={label}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group"
        >
          <span className="w-20 h-20 rounded-full bg-mansagold flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
};

export default TapToPlayVideo;
