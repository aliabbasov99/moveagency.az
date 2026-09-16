import { useState, useEffect } from "react";
import BlurText from "./BlurText";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArchitectureSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    description: string;
}

const slidesData: ArchitectureSlide[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
        title: "Təbiətdən",
        subtitle: "ilhamlanan memarlıq",
        description: "Sky Breeze-in memarlıq konsepsiyası dağ landşaftı ilə harmoniya əsasında yaradılmışdır. Təbii materiallar, panoramik pəncərələr və müasir memarlıq həlləri daxili məkanla təbiət arasında təbii əlaqə yaradır."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
        title: "Müasir rahatlıq",
        subtitle: "və dağ havası",
        description: "Sky Breeze, onu əhatə edən landşaftın təbii davamı kimi dizayn edilmişdir. Müasir memarlıq həlləri, təbii materiallar, panoramik pəncərələr və detallara verilən diqqət dağ təbiətinin gözəlliyini hiss etməyə imkan verir."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600&auto=format&fit=crop",
        title: "İnteryer və",
        subtitle: "geniş məkanlar",
        description: "Hər bir detal fəsillərin dəyişən gözəlliyini birbaşa evinə daşımaq üçün düşünülüb. İlin istənilən fəslində yeni formada rahatlıq və hüzur yaşayın."
    }
];

export default function ArchitectureSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Avtomatik keçid (istəsəniz silə bilərsiniz)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
    };

    const currentSlide = slidesData[currentIndex];

    return (
        <section className="relative w-full min-h-screen bg-[#f7f4ef] text-[#2c221e] py-16 px-6 md:px-16 flex items-center overflow-hidden">

            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* ================= SOL TƏRƏF: BÖYÜK ANİMASİYALI ŞƏKİL SLAYDERİ ================= */}
                <div className="lg:col-span-7 relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl group">
                    {slidesData.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentIndex
                                    ? "opacity-100 scale-100 translate-x-0"
                                    : "opacity-0 scale-105 translate-x-4 pointer-events-none"
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Şəkil üzərində yüngül kölgə */}
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    ))}

                    {/* Slayder Ox Düymələri (Şəklin üzərində aşağı sağ küncdə) */}
                    <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
                        <button
                            onClick={handlePrev}
                            aria-label="Əvvəlki"
                            className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-[#2c221e] backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Növbəti"
                            className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-[#2c221e] backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ================= SAĞ TƏRƏF: ANİMASİYALI MƏTN BLOKU (BlurText) ================= */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-6">

                    {/* Başlıq hissəsi */}
                    <div className="space-y-1">
                        <BlurText
                            key={`title-${currentIndex}`}
                            text={currentSlide.title}
                            animateBy="words"
                            direction="top"
                            className="font-serif text-3xl md:text-5xl text-[#2c221e] font-normal"
                            delay={30}
                        />
                        <BlurText
                            key={`subtitle-${currentIndex}`}
                            text={currentSlide.subtitle}
                            animateBy="words"
                            direction="bottom"
                            className="font-serif italic text-3xl md:text-5xl text-[#2c221e] font-light"
                            delay={40}
                        />
                    </div>

                    {/* Təsvir mətni */}
                    <div className="pt-2">
                        <BlurText
                            key={`desc-${currentIndex}`}
                            text={currentSlide.description}
                            animateBy="words"
                            direction="bottom"
                            delay={10}
                            stepDuration={0.15}
                            className="text-sm md:text-base text-[#5a4d45] font-light leading-relaxed text-left"
                        />
                    </div>

                    {/* Slayder Göstəriciləri (Nöqtələr) */}
                    <div className="flex items-center gap-2 pt-4">
                        {slidesData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === index ? "w-8 bg-[#2c221e]" : "w-2 bg-[#2c221e]/30"
                                    }`}
                                aria-label={`Slayd ${index + 1}`}
                            />
                        ))}
                    </div>

                </div>

            </div>

        </section>
    );
}