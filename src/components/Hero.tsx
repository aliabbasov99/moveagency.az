import heroVideoBg from "../assets/video/hero_video_bg.mp4"

const Hero = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideoBg}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />
    </section>
  )
}

export default Hero