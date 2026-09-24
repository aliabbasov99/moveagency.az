import { Phone, Mail } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import logo from '../assets/img/static/ma_logo.webp';
import BlurText from './BlurText';
import { useLocale } from '../locales/useLocale';
import { getLocalizedPath } from '../locales/index';

const Footer = ({ onNavigate }: { onNavigate?: (target: number) => void }) => {
    const { locale, dict } = useLocale();

    const navLinks = [
        { href: '#home', label: dict.navbar.home },
        { href: '#about', label: dict.navbar.about },
        { href: '#services', label: dict.navbar.services },
        { href: '#portfolio', label: dict.navbar.portfolio },
        { href: '#contact', label: dict.navbar.contact },
    ];

    const contacts = [
        { icon: Phone, label: '+994 55 924 25 62', href: 'tel:+994559242562' },
        { icon: Mail, label: 'moveagencyy@gmail.com', href: 'mailto:moveagencyy@gmail.com' },
    ];

    const socials = [
        { icon: faYoutube, href: 'https://www.youtube.com/@MoveAgencyy', label: 'YouTube' },
        { icon: faInstagram, href: 'https://www.instagram.com/moveagency.az', label: 'Instagram' },
    ];

    // Navbar-dakı hover effektinin açıq fon üçün uyğunlaşdırılmış variantı
    const navLinkClass =
        'relative inline-block text-[#0B132B]/70 font-normal font-playfair uppercase tracking-wider group cursor-pointer';

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const el = document.getElementById(href.replace('#', ''));
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const y = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
        const clamped = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
        onNavigate?.(clamped);
    };

    const renderNavLink = ({ href, label }: { href: string; label: string }) => (
        <a key={href} href={href} onClick={(e) => handleNavClick(e, href)} className={navLinkClass}>
            <span>{label}</span>
            <span className="absolute top-0 left-0 overflow-hidden text-[#0B132B] max-w-0 opacity-0 group-hover:max-w-full group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap">
                {label}
            </span>
        </a>
    );

    return (
        <footer className="w-full bg-[#FAF7F2] text-[#0B132B]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 lg:py-16">

                {/* Logo */}
                <div className="flex items-center justify-center">
                    <a href="#home" aria-label={dict.navbar.logoAlt}>
                        <img
                            src={logo}
                            alt={dict.navbar.logoAlt}
                            className="object-contain max-w-44 sm:max-w-52 lg:max-w-60"
                        />
                    </a>
                </div>

                {/* Səhifə linkləri */}
                <nav className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:gap-x-12 text-sm sm:text-base">
                    {navLinks.map(renderNavLink)}
                </nav>

                {/* 1. Xətt */}
                <div className="mt-8 lg:mt-12 w-full h-[1px] bg-[#0B132B]/15" />

                {/* Əlaqə məlumatları + Sosial şəbəkələr */}
                <div className="py-8 lg:py-6 flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:gap-10 font-montserrat">

                    <div className="flex flex-col items-center gap-4 sm:gap-5 lg:flex-row lg:gap-10 xl:gap-16">
                        {contacts.map(({ icon: Icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="group flex items-center gap-3 text-sm sm:text-base text-[#0B132B]/85 hover:text-[#0B132B] transition-colors"
                            >
                                <Icon
                                    className="w-5 h-5 shrink-0 text-[#0B132B]/55 group-hover:text-[#0B132B] transition-colors"
                                    strokeWidth={1.6}
                                />
                                <span>{label}</span>
                            </a>
                        ))}
                    </div>

                    {/* Sosial şəbəkələr - Aşağıdan yuxarıya ağaran fon və rəng keçidi */}
                    <div className="flex items-center gap-3">
                        {socials.map(({ icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                className="relative w-10 h-10 flex items-center justify-center rounded-md bg-[#0B132B] text-white overflow-hidden group cursor-pointer"
                            >
                                {/* Arxa fon aşağıdan yuxarıya doğru ağarır */}
                                <span className="absolute inset-0 bg-white scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out z-0"></span>
                                
                                {/* İkon z-index ilə üstdə qalır və transition-colors ilə rəngi ağdan qaraya hamar dəyişir */}
                                <FontAwesomeIcon 
                                    icon={icon} 
                                    className="w-4 h-4 z-10 text-white group-hover:text-black transition-colors duration-500 ease-in-out" 
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* 2. Xətt */}
                <div className="w-full h-[1px] bg-[#0B132B]/15" />

                {/* Alt hissə */}
                <div className="pt-6 flex flex-col items-center gap-4 lg:flex-row lg:justify-end font-montserrat">
                    <div className="flex items-center gap-6 text-xs sm:text-sm text-[#0B132B]/70">
                        <Link to={getLocalizedPath(locale, '/mexfilik-siyaseti')} className="hover:text-[#0B132B] transition-colors">
                            <BlurText 
                                text={dict.footer.privacyPolicy} 
                                animateBy="words" 
                                direction="bottom" 
                                threshold={0.0} 
                                stepDuration={0.25}
                                delay={100}
                            />
                        </Link>
                        <Link to={getLocalizedPath(locale, '/istifade-sertleri')} className="hover:text-[#0B132B] transition-colors">
                            <BlurText 
                                text={dict.footer.termsOfUse} 
                                animateBy="words" 
                                direction="bottom" 
                                threshold={0.0} 
                                stepDuration={0.25}
                                delay={100}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;