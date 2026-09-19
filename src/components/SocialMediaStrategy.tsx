const socialMediaVideo = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789831485/WhatsApp_Video_2026-09-19_at_7.16.53_PM.mp4"

const SocialMediaStrategy = () => {
  return (
    <section id="social-media-strategy" className="relative h-[60svh] md:h-[60vh] w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover object-[80%_25%]"
        src={socialMediaVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />
    </section>
  )
}

export default SocialMediaStrategy