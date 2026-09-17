import { useState } from "react";
import BlurText from "./BlurText";
import { Snowflake, Flower, Sun, Leaf, ChevronLeft, ChevronRight } from "lucide-react";

// Yerli video fayllarını import edirik
import heroVideo from "../assets/video/marketing_horizontonal.mp4";
import socialVideo from "../assets/video/social_media_strategy.mp4";

interface SeasonItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  videoSrc: string;
}

const seasonsData: SeasonItem[] = [
  {
    id: "winter",
    title: "Qış",
    icon: <Snowflake className="w-5 h-5" />,
    description: "Xizək traslarına birbaşa çıxış, qış əyləncələri və qarla örtülmüş zirvələrə açılan mənzərə ilə rahat axşamlar.",
    videoSrc: heroVideo
  },
  {
    id: "spring",
    title: "Yaz",
    icon: <Flower className="w-5 h-5" />,
    description: "Təbiətin oyanışı, təmiz dağ havası və yaşıllığa qərq olan ətraf mühitdə gəzintilər.",
    videoSrc: socialVideo
  },
  {
    id: "summer",
    title: "Yay",
    icon: <Sun className="w-5 h-5" />,
    description: "Dinamik yay istirahəti, açıq hava fəaliyyətləri və dağ günəşinin həzzini yaşayın.",
    videoSrc: heroVideo
  },
  {
    id: "autumn",
    title: "Payız",
    icon: <Leaf className="w-5 h-5" />,
    description: "Qızılı və bürünc rənglərə bürünən meşələr, sakitlik və ev rahatlığı.",
    videoSrc: socialVideo
  }
];

export default function SeasonsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? seasonsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev === seasonsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full h-screen  text-black overflow-hidden flex flex-col justify-between py-6">
      
      {/* Yuxarı Başlıq Hissəsi */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-4 shrink-0">
        <BlurText
          text="Hər fəslin ritmində yaşanan həyat"
          animateBy="words"
          direction="top"
          className="font-serif text-2xl md:text-3xl lg:text-4xl text-black justify-center mb-1 tracking-wide"
          delay={40}
        />
        <div>
          <BlurText
            text="Sky Breeze - rahat qış günlərindən dinamik yay istirahətinə qədər hər dörd fəslin ritmində yaşamaq üçün yaradılmış məkandır."
            animateBy="words"
            direction="bottom"
            delay={10}
            stepDuration={0.2}
            className="text-xs md:text-sm text-black justify-center text-center font-light"
          />
        </div>
      </div>

      {/* ================= DESKTOP: 100vh Daxilində 4 Sütun (Hər fəslin özünün video sahəsi) ================= */}
      <div className="relative z-10 hidden md:grid grid-cols-4 w-full h-[calc(100vh-140px)] border-t border-b border-white/20">
        {seasonsData.map((season, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={season.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative h-full overflow-hidden border-r last:border-r-0 border-white/20 flex flex-col justify-between p-6 lg:p-8 group cursor-pointer"
            >
              {/* Hər fəslin öz arxa fon video sahəsi */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <video
                  src={season.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover brightness-[0.45]"
                />
                {/* Qaranlıq qradient qat */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              </div>

              {/* Üst hissə */}
              <div />

              {/* Aşağı hissə: İkon, Başlıq və Aşağıdan yuxarı çıxan mətn */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                    {season.icon}
                  </span>
                  <h3 className="font-serif text-xl lg:text-2xl tracking-wider text-white">{season.title}</h3>
                </div>

                {/* Aşağıdan yuxarıya doğru sürüşərək çıxan mətn */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isHovered ? "opacity-100 max-h-40 translate-y-0" : "opacity-0 max-h-0 translate-y-6"
                  }`}
                >
                  <p className="text-xs lg:text-sm text-gray-200 font-light leading-relaxed pt-1">
                    {season.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MOBİL: SLAYDER GÖRÜNÜŞÜ ================= */}
      <div className="relative z-10 md:hidden px-4 flex flex-col justify-center my-auto">
        <div className="relative h-[360px] rounded-2xl overflow-hidden border border-white/20 p-5 flex flex-col justify-between mb-3 shadow-2xl">
          {/* Mobil video arxa fon */}
          <div className="absolute inset-0 -z-10">
            <video
              src={seasonsData[mobileIndex].videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover brightness-[0.5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          <div />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-white/10 text-white border border-white/20">
                {seasonsData[mobileIndex].icon}
              </span>
              <h3 className="font-serif text-xl text-white">{seasonsData[mobileIndex].title}</h3>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed font-light">
              {seasonsData[mobileIndex].description}
            </p>
          </div>
        </div>

        {/* Mobil ox düymələri */}
        <div className="flex items-center justify-end gap-3 px-2">
          <button
            onClick={handlePrev}
            aria-label="Əvvəlki"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/40 backdrop-blur-md active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Növbəti"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/40 backdrop-blur-md active:scale-95 transition-transform"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </section>
  );
}