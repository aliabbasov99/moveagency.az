import { motion, type Transition, type Easing } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocale } from '../locales/useLocale';
import SmmImg from '../assets/img/static/smm.jpg'
// ==========================================
// 1. BLUR TEXT KOMPONENTİ (Hər dəfə qayıdanda işləyən)
// ==========================================
type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

export const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Element ekrandan çıxanda inView-u false edirik ki, yenidən gələndə animasiya təkrarlansın
        setInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing
        };

        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity'
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};


// ==========================================
// 2. HERO SECTION KOMPONENTİ
// ==========================================
interface HeroSectionProps {
  eyebrowItalic?: string
  headlineRest?: string
  body?: string
  imageSrc?: string
  imageAlt?: string
}

export default function HeroSection({
  eyebrowItalic,
  headlineRest,
  body,
  imageSrc = SmmImg,
  imageAlt,
}: HeroSectionProps) {
  const { dict } = useLocale()
  
  const finalEyebrow = eyebrowItalic ?? dict.heroSection.eyebrow
  const finalHeadline = headlineRest ?? dict.heroSection.headline
  const finalBody = body ?? dict.heroSection.body
  const finalImageAlt = imageAlt ?? dict.heroSection.imageAlt
  // Şəkil üçün ekrana gəlib-gəlmədiyini izləyənref və state
  const imageRef = useRef<HTMLDivElement | null>(null)
  const [imageInView, setImageInView] = useState(false)

  useEffect(() => {
    const imgElement = imageRef.current
    if (!imgElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setImageInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(imgElement)
    return () => {
      if (imgElement) observer.unobserve(imgElement)
    }
  }, [])

  return (
    <section id="about" className="grid min-h-[620px] w-full grid-cols-1 items-stretch bg-[#fdfbf1] lg:grid-cols-2 overflow-hidden">
      {/* Text column */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-20">
        <h1 className="max-w-xl font-serif text-4xl leading-tight text-[#2a1a14] md:text-5xl">
          <BlurText
            text={finalEyebrow}
            animateBy="words"
            direction="top"
            className="italic"
            delay={100}
          />{" "}
          <BlurText text={finalHeadline} animateBy="words" direction="top" delay={30} />
        </h1>

        <div className="mt-6 max-w-md">
          <BlurText
            text={finalBody}
            animateBy="words"
            direction="bottom"
            delay={10}
            stepDuration={0.2}
            className="text-base leading-relaxed text-[#8c8579]"
          />
        </div>
      </div>

      {/* Image column with Re-triggerable Animation */}
      <div ref={imageRef} className="relative min-h-[320px] overflow-hidden lg:min-h-0">
        <img
          src={imageSrc}
          alt={finalImageAlt}
          className={`h-full w-full object-cover transition-all duration-1000 ease-out ${
            imageInView ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      </div>
    </section>
  )
}