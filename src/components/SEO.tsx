import { useEffect, useState, useRef } from "react";
import BlurText from "./BlurText";
import { useLocale } from "../locales/useLocale";
import logo from "../assets/img/static/ma_logo.webp";
import SEOBgVideo from  "../assets/img/static/footer_bg_video.mp4"
export default function ProjectStickyHero() {
  const { dict } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;

      const scrolled = -rect.top;
      let p = scrolled / sectionHeight;
      p = Math.max(0, Math.min(1, p));

      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- ANİMASİYA HESABLAMALARI ---
  // 1. Mərhələ (0 - 0.7): Dairə mərkəzdən böyüyərək şəkli tam açır
  const REVEAL_END = 0.7;
  const revealProgress = Math.min(1, progress / REVEAL_END);
  // Riyazi olaraq bir düzbucaqlının küncünə tam çatmaq üçün ~70.71% kifayətdir,
  // biz təhlükəsizlik üçün 78%-ə qədər aparırıq ki, künclərdə boşluq qalmasın
  const circleRadius = revealProgress * 78;
  const clipPathValue = `circle(${circleRadius}% at 50% 50%)`;

  // 2. Mərhələ (0.7 - 1.0): Dairə açılışı bitdikdən sonra loqo görünür
  const logoProgress = progress > REVEAL_END ? (progress - REVEAL_END) / (1 - REVEAL_END) : 0;
  const logoOpacity = logoProgress;
  const logoTranslateY = 30 * (1 - logoProgress);

  return (
<section
  ref={sectionRef}
  className="relative w-full h-[200vh] bg-[#f7f4ef]"
>
  <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center gap-6 md:gap-10 overflow-hidden">

    <div className="z-20 text-center px-4 max-w-3xl">
      <BlurText
        text={dict.seo.text}
        animateBy="words"
        direction="bottom"
        delay={10}
        stepDuration={0.15}
        className="text-sm md:text-base text-[#5a4d45] font-light leading-relaxed justify-center text-center"
      />
    </div>

    <div className="relative w-full h-[280px] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue }}
      >
        <video
          src={SEOBgVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoTranslateY}px)`,
          }}
        >
          <img
            src={logo}
            alt={dict.seo.logoAlt}
            className="w-45 md:w-80 object-contain drop-shadow-2xl invert"
          />
        </div>
      </div>
    </div>

  </div>
</section>
  );
}