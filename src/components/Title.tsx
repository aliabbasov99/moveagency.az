import BlurText from "./BlurText"
import heartAnimation from "../assets/img/static/heart_animation.gif"
import { useLocale } from '../locales/useLocale'

const Title = () => {
    const { dict } = useLocale()
    return (
        <section className="flex h-[550px] w-full items-center justify-center bg-[#fdfbf1] px-4">
            <div className="flex flex-col items-center">
                <img
                    src={heartAnimation}
                    alt={dict.hero.heartAlt}
                    className="w-28 sm:w-36 md:w-44 lg:w-52 h-auto object-contain mb-6 md:mb-8"
                />
                <BlurText
                    text={dict.hero.title}
                    delay={20}
                    animateBy="letters"
                    direction="top"
                    threshold={0.5}
                    className="text-center font-playfair text-4xl md:text-6xl text-[#0B132B] justify-center"
                />
            </div>
        </section>
    )
}

export default Title