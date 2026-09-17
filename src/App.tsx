import "./assets/style/main.css"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Title from "./components/Title"
import SocialMediaStrategy from "./components/SocialMediaStrategy"
import HeroSection from "./components/HeroSection"
import Services from "./components/Services"
import ArchSection from "./components/ArchSection"
import StatsSection from "./components/StatsSection"
import SEO from "./components/SEO"
import Form from "./components/Form"
import Footer from "./components/Footer"
import useSmoothScroll from "./hooks/useSmoothScroll";

const App = () => {
  const { scrollTo } = useSmoothScroll(0.08); // ease dəyərini istəyinə görə dəyi (0.05–0.15 arası)

  return (
    <>
      <Navbar onNavigate={scrollTo} />
      <Hero />
      <Title />
      <SocialMediaStrategy />
      <HeroSection />
      <Services />
      <ArchSection />
      <StatsSection />
      <SEO />
      <Form />
      <Footer />
    </>
  )
}

export default App