import { useState, useEffect, useRef } from "react";

interface StatItem {
  id: number;
  endValue: number;
  suffix: string;
  title: string;
  description: string;
  alignment: "left" | "center" | "right";
}

const statsData: StatItem[] = [
  {
    id: 1,
    endValue: 300,
    suffix: "K+",
    title: "illik ziyarətçi",
    description: "Stabil turist axını və kurorta marağın artması",
    alignment: "left"
  },
  {
    id: 2,
    endValue: 45,
    suffix: " KM",
    title: "dağ xizək trassı",
    description: "Regionun ən böyük və ən müasir dağ xizək zonalarından biri",
    alignment: "center"
  },
  {
    id: 3,
    endValue: 4,
    suffix: "",
    title: "fəsil - ilboyu fəaliyyət",
    description: "İlin istənilən vaxtında dağ xizəyi, piyada marşrutları, velosiped zolaqları və digər fəaliyyətlər",
    alignment: "right"
  }
];

// Sayğac animasiyası üçün köməkçi komponent
function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuad = progress * (2 - progress);
      setCount(Math.floor(easeOutQuad * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsSection() {
  return (
    <section className="relative w-full bg-[#f7f4ef] text-[#2c221e] py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-[1300px] mx-auto flex flex-col">
        
        {statsData.map((stat, index) => {
          // Rəqəm və başlığın yerləşmə mövqeyi (Start, Center, End)
          const positionClass = 
            stat.alignment === "left" ? "mr-auto" :
            stat.alignment === "center" ? "mx-auto" : 
            "ml-auto";

          return (
            <div key={stat.id} className="w-full">
              {/* Sətirarası xətt */}
              {index > 0 && <div className="w-full h-[1px] bg-[#e6ded5] my-10" />}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 w-full max-w-[1100px] mx-auto">
                
                {/* Sol tərəfdə pilləli hərəkət edən rəqəm və başlıq */}
                <div className={`flex flex-col md:flex-row md:items-baseline gap-4 w-full md:w-auto ${positionClass}`}>
                  <div className="font-serif text-6xl md:text-8xl tracking-tight text-[#2c221e] font-light min-w-[180px]">
                    <Counter end={stat.endValue} />
                    <span>{stat.suffix}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-[#2c221e] font-normal">
                    {stat.title}
                  </h3>
                </div>

                {/* Sağ tərəfdəki açıqlama mətni (həmişə sabit və sola dayanıqlı) */}
                <div className="w-full md:max-w-xs text-sm md:text-base text-[#6b5c53] font-light leading-relaxed text-left shrink-0">
                  {stat.description}
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}