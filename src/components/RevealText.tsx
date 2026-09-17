import { useEffect, useRef, useState } from "react"
import type { ElementType, JSX } from "react"

type AnimateBy = "letters" | "words" | "lines"
type Direction = "top" | "bottom"

interface RevealTextProps {
  text: string
  /** stagger between units, in ms */
  delay?: number
  /** duration of each unit's reveal, in ms */
  duration?: number
  animateBy?: AnimateBy
  direction?: Direction
  /** 0–1, how much of the element must be visible before it triggers */
  threshold?: number
  /**
   * Shrinks the effective viewport used to detect visibility, so the
   * element must be properly scrolled into view — not just brushing the
   * edge of the screen on initial page load — before it animates.
   * Defaults to ignoring the bottom 15% of the viewport.
   */
  rootMargin?: string
  /** play the light-sweep highlight once the reveal finishes */
  sweep?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
}

let stylesInjected = false
function injectKeyframesOnce() {
  if (stylesInjected || typeof document === "undefined") return
  stylesInjected = true
  const style = document.createElement("style")
  style.textContent = `
    @keyframes reveal-mask-top {
      0% { transform: translateY(0); }
      100% { transform: translateY(-101%); }
    }
    @keyframes reveal-mask-bottom {
      0% { transform: translateY(0); }
      100% { transform: translateY(101%); }
    }
    @keyframes reveal-unit-top {
      0% { transform: translateY(115%); }
      100% { transform: translateY(0); }
    }
    @keyframes reveal-unit-bottom {
      0% { transform: translateY(-115%); }
      100% { transform: translateY(0); }
    }
    @keyframes reveal-sweep {
      0% { transform: translateX(-140%) skewX(-12deg); opacity: 0; }
      15% { opacity: 0.55; }
      100% { transform: translateX(240%) skewX(-12deg); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

/**
 * RevealText — splits text into staggered units, each hidden behind its own
 * mask that slides away (like a slab or shutter lifting), rather than
 * fading/blurring in. Once the last unit lands, a single soft light-sweep
 * crosses the whole line — evoking light catching a facade — then settles.
 */
export default function RevealText({
  text,
  delay = 40,
  duration = 700,
  animateBy = "words",
  direction = "top",
  threshold = 0.2,
  rootMargin = "0px 0px -15% 0px",
  sweep = true,
  className = "",
  as = "span",
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [sweepDone, setSweepDone] = useState(false)

  useEffect(() => {
    injectKeyframesOnce()
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const units =
    animateBy === "letters"
      ? text.split("")
      : animateBy === "lines"
      ? text.split("\n")
      : text.split(/(\s+)/) // keep spaces as their own units so wrapping stays natural

  const unitDelay = (i: number) => `${(i * delay) / 1000}s`
  const maskAnim = direction === "top" ? "reveal-mask-top" : "reveal-mask-bottom"
  const unitAnim = direction === "top" ? "reveal-unit-top" : "reveal-unit-bottom"

  const totalTime = units.length * delay + duration

  useEffect(() => {
    if (!visible || !sweep) return
    const t = setTimeout(() => setSweepDone(true), totalTime + 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const Wrapper = (as ?? "span") as ElementType

  return (
    <Wrapper
      ref={containerRef}
      className={`relative inline-block overflow-hidden align-top ${className}`}
      aria-label={text}
    >
      {units.map((unit, i) => {
        if (animateBy !== "letters" && unit.trim() === "") {
          return <span key={i}>{unit}</span>
        }
        return (
          <span
            key={i}
            className="relative inline-block overflow-hidden align-top"
          >
            {/* opaque mask that lifts away, unit-by-unit */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[#fdfbf1]"
              style={{
                animation: visible
                  ? `${maskAnim} ${duration}ms cubic-bezier(0.65,0,0.15,1) ${unitDelay(i)} forwards`
                  : undefined,
                transform: visible ? undefined : "translateY(0)",
              }}
            />
            {/* the actual glyph/word, rising into place under its mask */}
            <span
              className="inline-block"
              style={{
                transform: visible ? undefined : `translateY(${direction === "top" ? "115%" : "-115%"})`,
                animation: visible
                  ? `${unitAnim} ${duration}ms cubic-bezier(0.65,0,0.15,1) ${unitDelay(i)} forwards`
                  : undefined,
              }}
            >
              {unit === " " ? "\u00A0" : unit}
            </span>
          </span>
        )
      })}

      {sweep && visible && !sweepDone && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-overlay"
          style={{
            animation: `reveal-sweep 900ms ease-out ${totalTime}ms forwards`,
          }}
        />
      )}
    </Wrapper>
  )
}