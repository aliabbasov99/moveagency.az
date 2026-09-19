import { motion, type Variants } from "motion/react"
import BlurText from "./BlurText"
import moveImg from "../assets/img/static/move.webp"
import agencyImg from "../assets/img/static/agency.webp"
import { useLocale } from "../locales/useLocale"

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const moveVariants: Variants = {
    hidden: { x: "-110vw", opacity: 0 },
    visible: { x: 0, opacity: 1 },
}

const agencyVariants: Variants = {
    hidden: { x: "110vw", opacity: 0 },
    visible: { x: 0, opacity: 1 },
}

const Title = () => {
    const { dict } = useLocale()
    return (
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#fdfbf1] px-4 py-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
                className="mb-6 flex items-center md:mb-8"
            >
                <motion.img
                    src={moveImg}
                    alt="move"
                    variants={moveVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
                />
                <motion.img
                    src={agencyImg}
                    alt="agency"
                    variants={agencyVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
                />
            </motion.div>
            <BlurText
                text={dict.hero.title}
                delay={20}
                animateBy="letters"
                direction="top"
                threshold={0.5}
                className="justify-center text-center font-playfair text-4xl text-[#0B132B] md:text-6xl"
            />
        </section>
    )
}

export default Title