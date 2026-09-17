import BlurText from "./BlurText"

const Title = () => {
    return (
        <section id="about" className="flex h-[550px] w-full items-center justify-center bg-[#fdfbf1] px-4">
            <BlurText
                text="We move brands forward"
                delay={20}
                animateBy="letters"
                direction="top"
                threshold={0.5}
                className="text-center font-playfair text-4xl md:text-6xl text-[#0B132B] justify-center"
            />
        </section>
    )
}

export default Title