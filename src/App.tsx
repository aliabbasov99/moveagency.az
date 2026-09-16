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

const App = () => {

  return (
    <>
      <Navbar />
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