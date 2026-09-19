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
  isActive: boolean;
  isTouch: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

function ReelCard({ reel, isActive, isTouch, soundOn, onToggleSound, cardRef, onHoverStart, onHoverEnd }: ReelCardProps) {
  const { dict } = useLocale();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeIdRef = useRef(0);
  const prevActiveRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    cancelAnimationFrame(fadeIdRef.current);
    const prevActive = prevActiveRef.current;

    if (!isActive) {
      if (isTouch && prevActive) {
        // Aktivlik bitən mobil kart: səs açıqdırsa yumşalıb pauz olur
        if (soundOn) {
          const t0 = performance.now();
          const DURATION = 300;
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / DURATION);
            video.muted = false;
            video.volume = Math.max(0, 1 - p);
            if (p < 1) {
              fadeIdRef.current = requestAnimationFrame(step);
            } else {
              video.volume = 0;
              video.currentTime = 0;
              video.muted = true;
              video.pause();
            }
          };
          fadeIdRef.current = requestAnimationFrame(step);
        } else {
          video.muted = true;
          video.currentTime = 0;
          video.pause();
        }
      } else {
        video.muted = true;
        video.currentTime = 0;
        video.pause();
      }
      prevActiveRef.current = false;
      return;
    }

    // Aktiv kart: vahid soundOn state-i ilə oynayır
    video.muted = !soundOn;
    video.volume = soundOn ? 1 : 0;
    const p = video.play();
    if (p) p.catch(() => {});
    prevActiveRef.current = true;
  }, [isTouch, isActive, soundOn]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative w-full aspect-9/16 max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
    >
      <video
        ref={videoRef}
        src={reel.videoSrc}
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />

      {!isTouch && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            {isActive ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            )}
          </span>
        </div>
      )}

      {/* Hər video üçün öz səs butonu (vahid state ilə) */}
      <button
        type="button"
        onClick={onToggleSound}
        aria-label={soundOn ? dict.video.muteLabel : dict.video.unmuteLabel}
        className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 ${
          isTouch ? "" : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        }`}
      >
        {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function PortfolioSection() {
  const { dict } = useLocale();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(true);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Section tam görünmədikdə bütün videolar pauz olur
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setSectionVisible(entry.isIntersecting);
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Yalnız mobil (touch) qurğuları aşkarlama
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mobil: ekranın 50%-dən çoxunu örtən kart aktiv olur, əvvəlki dayanır
  useEffect(() => {
    if (!isTouch) return;
    let rafId = 0;

    const computeActive = () => {
      const vh = window.innerHeight;
      const el = sectionRef.current;

      // Section tam çöldədirsə (çox sürətli keçmə daxil) hamısını dayandır
      if (!el) return;
      const sr = el.getBoundingClientRect();
      if (sr.bottom <= 0 || sr.top >= vh) {
        setActiveIndex(null);
        return;
      }

      let best = -1;
      let bestCover = 0;
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const rect = cardEl.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, vh);
        const cover = Math.max(0, visibleBottom - visibleTop) / vh;
        if (cover > bestCover) {
          bestCover = cover;
          best = idx;
        }
      });

      // Heç biri 50%-dən çox örtmürsə aktiv yoxdur -> hamısı pauz
      setActiveIndex(best >= 0 && bestCover > 0.5 ? best : null);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isTouch]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full bg-[#f7f4ef] text-[#2c221e] py-16 px-6 md:px-16"
    >
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
              isTouch={isTouch}
              isActive={sectionVisible && (isTouch ? activeIndex === index : hoveredIndex === index)}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn((s) => !s)}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
              onHoverStart={isTouch ? undefined : () => setHoveredIndex(index)}
              onHoverEnd={isTouch ? undefined : () => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}