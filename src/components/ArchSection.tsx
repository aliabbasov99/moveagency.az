import { useEffect, useRef, useState } from "react";
import BlurText from "./BlurText";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useLocale } from '../locales/useLocale';

interface ReelItem {
  id: string;
  videoSrc: string;
}

const reelsData: ReelItem[] = [
  {
    id: "sakura-sushi",
    videoSrc: "https://res.cloudinary.com/ta8jgr46/video/upload/f_auto/v1789733744/sakura_sushi.mp4",
  },
  {
    id: "coffelier",
    videoSrc: "https://res.cloudinary.com/ta8jgr46/video/upload/f_auto/v1789733742/coffelier.mp4",
  },
  {
    id: "momentum",
    videoSrc: "https://res.cloudinary.com/ta8jgr46/video/upload/f_auto/v1789733753/IMG_7114.mp4",
  },
];

interface ReelCardProps {
  reel: ReelItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

interface MuteButtonProps {
  isMuted: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

function MuteButton({ isMuted, onToggle }: MuteButtonProps) {
  const { dict } = useLocale();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? dict.video.unmuteLabel : dict.video.muteLabel}
      className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}

function ReelCard({ reel, isPlaying, onTogglePlay }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isPlaying) {
      video.pause();
    }
  }, [isPlaying]);

  const handleCardClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      onTogglePlay();
    } else {
      video.volume = 1.0;
      video.muted = isMuted;

      video
        .play()
        .then(() => {
          onTogglePlay();
        })
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => onTogglePlay());
        });
    }
  };

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    video.volume = nextMuted ? 0 : 1.0;
    setIsMuted(nextMuted);
  };

  return (
    <div
      className="relative w-full aspect-9/16 max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
      onClick={handleCardClick}
    >
      <video
        ref={videoRef}
        src={reel.videoSrc}
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
          )}
        </span>
      </div>

      {isPlaying && (
        <MuteButton isMuted={isMuted} onToggle={handleSoundToggle} />
      )}
    </div>
  );
}

export default function PortfolioSection() {
  const { dict } = useLocale();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="relative w-full bg-[#f7f4ef] text-[#2c221e] py-16 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-10 md:mb-14">
          <BlurText
            text={dict.portfolio.title}
            animateBy="words"
            direction="top"
            className="font-serif text-3xl md:text-5xl text-[#2c221e] justify-center"
            delay={40}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reelsData.map((reel, index) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              isPlaying={playingIndex === index}
              onTogglePlay={() =>
                setPlayingIndex(playingIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}