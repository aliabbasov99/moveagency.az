const marketingHorizontal = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789738059/marketing_horizontonal_online-video-cutter.com.mp4"
const marketingVertical = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789738053/marketing_vertical_online-video-cutter.com.mp4"

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