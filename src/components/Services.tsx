import { useRef, useState } from "react";
import BlurText from "./BlurText";
import { Users, Calendar, Video, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from '../locales/useLocale';
import { getDictForLocale } from "../locales/dict";

const smmVideo = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789732607/Biz_sad%C9%99c%C9%99_payla%C5%9F%C4%B1m_etmirik_brendinizi_do%C4%9Fru_auditoriyaya_tan%C4%B1d%C4%B1r%C4%B1q_Pe%C5%9F%C9%99kar_video_v%C9%99_dizay.mp4";
const contentStrategyVideo = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789732817/Brendin_sosial_mediada_olma%C4%9F%C4%B1_kifay%C9%99t_deyil.Do%C4%9Fru_strategiya_f%C9%99rqi_yarad%C4%B1r._%C6%8Fm%C9%99kda%C5%9Fl%C4%B1q_%C3%BC%C3%A7%C3%BCn_DM.mp4";
const productionVideo = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789732917/moveagency.az_1783973174_3940574624263330929_70128491143.mp4";
const performanceMarketingVideo = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789732983/moveagency.az_1758217127_3724516771882391877_70128491143.mp4";

interface ServiceItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  videoSrc: string;
}

const getServicesData = (dict: ReturnType<typeof getDictForLocale>): ServiceItem[] => [
  {
    id: "smm-management",
    title: dict.services.smm.title,
    icon: <Users className="w-5 h-5" />,
    description: dict.services.smm.desc,
    videoSrc: smmVideo
  },
  {
    id: "content-strategy",
    title: dict.services.contentStrategy.title,
    icon: <Calendar className="w-5 h-5" />,
    description: dict.services.contentStrategy.desc,
    videoSrc: contentStrategyVideo
  },
  {
    id: "production",
    title: dict.services.production.title,
    icon: <Video className="w-5 h-5" />,
    description: dict.services.production.desc,
    videoSrc: productionVideo
  },
  {
    id: "performance-marketing",
    title: dict.services.performanceMarketing.title,
    icon: <Target className="w-5 h-5" />,
    description: dict.services.performanceMarketing.desc,
    videoSrc: performanceMarketingVideo
  }
];

export default function SeasonsSection() {
  const { dict } = useLocale();
  const servicesData = getServicesData(dict);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
    }
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? servicesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev === servicesData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="services" className="relative w-full h-screen  text-black overflow-hidden flex flex-col justify-between py-6">
      
      {/* Yuxarı Başlıq Hissəsi */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-4 shrink-0">
        <BlurText
          text={dict.services.title}
          animateBy="words"
          direction="top"
          className="font-serif text-2xl md:text-3xl lg:text-4xl text-black justify-center mb-1 tracking-wide"
          delay={40}
        />
        <div>
          <BlurText
            text={dict.services.subtitle}
            animateBy="words"
            direction="bottom"
            delay={10}
            stepDuration={0.2}
            className="text-xs md:text-sm text-black justify-center text-center font-light"
          />
        </div>
      </div>

      {/* ================= DESKTOP: 100vh Daxilində 4 Sütun (Hər xidmətin özünün video sahəsi) ================= */}
      <div className="relative z-10 hidden md:grid grid-cols-4 w-full h-[calc(100vh-140px)] border-t border-b border-white/20">
        {servicesData.map((service, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={service.id}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="relative h-full overflow-hidden border-r last:border-r-0 border-white/20 flex flex-col justify-between p-6 lg:p-8 group cursor-pointer"
            >
              {/* Hər xidmətin öz arxa fon video sahəsi */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={service.videoSrc}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover brightness-[0.85]"
                />
                {/* Qaranlıq qradient qat */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              </div>

              {/* Üst hissə */}
              <div />

              {/* Aşağı hissə: İkon, Başlıq və Aşağıdan yuxarı çıxan mətn */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                    {service.icon}
                  </span>
                  <h3 className="font-serif text-xl lg:text-2xl tracking-wider text-white">{service.title}</h3>
                </div>

                {/* Aşağıdan yuxarıya doğru sürüşərək çıxan mətn */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isHovered ? "opacity-100 max-h-40 translate-y-0" : "opacity-0 max-h-0 translate-y-6"
                  }`}
                >
                  <p className="text-xs lg:text-sm text-gray-200 font-light leading-relaxed pt-1">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MOBİL: SLAYDER GÖRÜNÜŞÜ ================= */}
      <div className="relative z-10 md:hidden px-4 flex flex-col justify-center my-auto">
        <div className="relative mx-auto h-[min(60vh,480px)] aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 p-5 flex flex-col justify-between mb-3 shadow-2xl">
          {/* Mobil video arxa fon */}
          <div className="absolute inset-0 -z-10">
            <video
              src={servicesData[mobileIndex].videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
          </div>

          <div />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-white/10 text-white border border-white/20">
                {servicesData[mobileIndex].icon}
              </span>
              <h3 className="font-serif text-xl text-white">{servicesData[mobileIndex].title}</h3>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed font-light">
              {servicesData[mobileIndex].description}
            </p>
          </div>
        </div>

        {/* Mobil ox düymələri */}
        <div className="flex items-center justify-end gap-3 px-2">
          <button
            onClick={handlePrev}
            aria-label={dict.services.prevLabel}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/40 backdrop-blur-md active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label={dict.services.nextLabel}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/40 backdrop-blur-md active:scale-95 transition-transform"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </section>
  );
}