import { MapPin, Phone, Mail } from 'lucide-react';
import type { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import logo from '../assets/img/static/ma_logo.webp'; // Açıq fon üçün tünd logo variantı
import BlurText from './BlurText';

const Footer = ({ onNavigate }: { onNavigate?: (target: number) => void }) => {
    const navLinks = [
        { href: '#home', label: 'Ana Səhifə' },
        { href: '#about', label: 'Haqqımızda' },
        { href: '#services', label: 'Xidmətlərimiz' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#contact', label: 'Əlaqə' },
    ];

    const contacts = [
        {
            icon: MapPin,
            label: 'Şahdağ dağ kurortu, Azərbaycan',
            href: 'https://maps.google.com/?q=Shahdag+Mountain+Resort',
            external: true,
        },
        { icon: Phone, label: '*8400', href: 'tel:*8400' },
        { icon: Mail, label: 'info@skybreeze.az', href: 'mailto:info@skybreeze.az' },
    ];

    const socials = [
        { icon: faFacebookF, href: 'https://facebook.com/moveagency.az', label: 'Facebook' },
        { icon: faInstagram, href: 'https://instagram.com/moveagency.az', label: 'Instagram' },
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
                    <a href="#home" aria-label="Sky Breeze Shahdag">
                        <img
                            src={logo}
                            alt="Sky Breeze Shahdag"
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
                        {contacts.map(({ icon: Icon, label, href, external }) => (
                            <a
                                key={label}
                                href={href}
                                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
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
                <div className="pt-6 flex flex-col items-center gap-4 lg:flex-row lg:justify-between font-montserrat">
                    <div className="flex items-center gap-6 text-xs sm:text-sm text-[#0B132B]/70">
                        <a href="/mexfilik-siyaseti" className="hover:text-[#0B132B] transition-colors">
                            <BlurText 
                                text="Məxfilik siyasəti" 
                                animateBy="words" 
                                direction="bottom" 
                                threshold={0.0} 
                                stepDuration={0.25}
                                delay={100}
                            />
                        </a>
                        <a href="/istifade-sertleri" className="hover:text-[#0B132B] transition-colors">
                            <BlurText 
                                text="İstifadə şərtləri" 
                                animateBy="words" 
                                direction="bottom" 
                                threshold={0.0} 
                                stepDuration={0.25}
                                delay={100}
                            />
                        </a>
                    </div>

                    <a
                        href="https://promar.az"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 text-xs sm:text-sm"
                    >
                        <span className="text-[10px] sm:text-xs text-[#0B132B]/45">Saytın hazırlanması</span>
                        <span className="font-semibold text-[#0B132B] group-hover:underline underline-offset-4">
                            Promar
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;