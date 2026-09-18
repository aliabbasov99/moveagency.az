const socialMediaVideo = "https://res.cloudinary.com/ta8jgr46/video/upload/v1789738052/social_media_strategy_online-video-cutter.com.mp4"

const SocialMediaStrategy = () => {
  return (
    <section id="social-media-strategy" className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover object-[80%_center]"
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