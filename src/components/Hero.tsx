import marketingHorizontal from "../assets/video/marketing_horizontonal.mp4"
import marketingVertical from "../assets/video/marketing_vertical.mp4"

const Hero = () => {
  return (
    <section id="home" className="relative h-[100svh] md:h-screen w-full overflow-hidden">
      {/* PC: horizontal video */}
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        src={marketingHorizontal}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Mobil: vertical video */}
      <video
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        src={marketingVertical}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </section>
  )
}

export default Hero