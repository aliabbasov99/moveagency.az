import { useEffect, useRef } from "react";

export default function useSmoothScroll(ease = 0.08) {
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const isAnimating = useRef(false);
  const rafId = useRef<number | null>(null);
  const loopRef = useRef<() => void>(() => {});

  const scrollTo = (target: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll.current = Math.max(0, Math.min(target, maxScroll));
    currentScroll.current = window.pageYOffset;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    isAnimating.current = true;
    loopRef.current();
  };

  useEffect(() => {
    currentScroll.current = window.pageYOffset;
    targetScroll.current = window.pageYOffset;

    const smoothScrollLoop = () => {
      currentScroll.current +=
        (targetScroll.current - currentScroll.current) * ease;

      if (Math.abs(targetScroll.current - currentScroll.current) < 0.5) {
        currentScroll.current = targetScroll.current;
        isAnimating.current = false;
        window.scrollTo(0, currentScroll.current);
        return;
      }

      window.scrollTo(0, currentScroll.current);
      rafId.current = requestAnimationFrame(smoothScrollLoop);
    };

    loopRef.current = smoothScrollLoop;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      targetScroll.current += e.deltaY;
      targetScroll.current = Math.max(
        0,
        Math.min(targetScroll.current, maxScroll)
      );

      if (!isAnimating.current) {
        isAnimating.current = true;
        smoothScrollLoop();
      }
    };

    const handleResize = () => {
      // Resize zamanı max scroll dəyişə bilər, target-i məhdudlaşdır
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScroll.current = Math.min(targetScroll.current, maxScroll);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [ease]);

  return { scrollTo };
}