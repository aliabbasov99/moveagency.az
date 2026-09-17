import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/img/static/ma_logo.webp'; // Logonun yolu

// Navbar-dakı logonun tailwind breakpoint-lərinə uyğun ilkin en (max-w-40 / sm:max-w-52 / lg:max-w-72)
const getInitialLogoWidth = () => {
    if (typeof window === 'undefined') return 288;
    const w = window.innerWidth;
    if (w < 640) return 160;
    if (w < 1024) return 208;
    return 288;
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('AZ');

    // PRELOADER STATE
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [logoMoving, setLogoMoving] = useState(false);
    const [animationTarget, setAnimationTarget] = useState({ x: 0, y: 0, width: getInitialLogoWidth() });
    const [initialLogoWidth, setInitialLogoWidth] = useState(getInitialLogoWidth());

    const logoRef = useRef(null);
    const langDropdownRef = useRef(null);

    useEffect(() => {
        setInitialLogoWidth(getInitialLogoWidth());
    }, []);

    const languages = [
        { code: 'AZ' },
        { code: 'EN' },
        { code: 'RU' },
    ];

    // -----------------------------------------
    // LOADING & ANIMATION LOGIC
    // -----------------------------------------
    useEffect(() => {
        let timeout1;
        let timeout2;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.floor(Math.random() * 6) + 3;

                if (next >= 100) {
                    clearInterval(interval);

                    // Loading bitdikdə Navbar-dakı logonun dəqiq koordinatlarını götürürük
                    if (logoRef.current) {
                        const rect = logoRef.current.getBoundingClientRect();
                        const logoCenterX = rect.left + rect.width / 2;
                        const logoCenterY = rect.top + rect.height / 2;
                        const screenCenterX = window.innerWidth / 2;
                        const screenCenterY = window.innerHeight / 2;

                        setAnimationTarget({
                            x: logoCenterX - screenCenterX,
                            y: logoCenterY - screenCenterY,
                            width: rect.width,
                        });
                    }

                    timeout1 = setTimeout(() => {
                        setLogoMoving(true);

                        timeout2 = setTimeout(() => {
                            setLoading(false);
                        }, 900);
                    }, 200);

                    return 100;
                }
                return next;
            });
        }, 30);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, []);

    // Dropdown xaricinə klikləndikdə menyuları bağlamaq üçün
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll-un qarşısını almaq (Mobil menyu açıq olanda)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinkClass = "relative inline-block text-[#eee] font-medium font-playfair uppercase tracking-wider group cursor-pointer";
    
    const renderNavLink = (href, text) => (
        <a href={href} className={navLinkClass}>
            <span>{text}</span>
            <span className="absolute top-0 left-0 overflow-hidden text-white max-w-0 opacity-0 group-hover:max-w-full group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap">
                {text}
            </span>
        </a>
    );

    return (
        <>
            {/* =========================================
                PRELOADER
            ========================================= */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* CENTER LOGO */}
                        <motion.img
                            src={logo}
                            alt="moveagency logo"
                            className="fixed left-1/2 top-1/2 object-contain pointer-events-none"
                            initial={{
                                x: "-50%",
                                y: "-50%",
                                width: `${initialLogoWidth}px`,
                            }}
                            animate={
                                logoMoving
                                    ? {
                                          x: `calc(-50% + ${animationTarget.x}px)`,
                                          y: `calc(-50% + ${animationTarget.y}px)`,
                                          width: `${animationTarget.width}px`,
                                          transition: {
                                              duration: 0.9,
                                              ease: [0.76, 0, 0.24, 1],
                                          },
                                      }
                                    : {
                                          x: "-50%",
                                          y: "-50%",
                                          width: `${initialLogoWidth}px`,
                                      }
                            }
                        />

                        {/* BOTTOM LOADING BAR */}
                        <div className="absolute bottom-8 left-6 right-6">
                            <div className="flex items-end justify-between mb-3 text-white">
                                <span className="text-sm self-end font-mono"></span>
                                <span className="text-sm self-end font-mono">{progress}%</span>
                            </div>

                            <div className="w-full h-[1px] bg-white/20 overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =========================================
                NAVBAR
            ========================================= */}
            <header className="text-white bg-gradient-to-b from-black/70 via-black/35 to-transparent fixed top-0 left-0 w-full z-50">            
                <nav className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-10 flex flex-row items-center justify-between">
                    
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="#home" className="block">
                            <img 
                                ref={logoRef} 
                                src={logo} 
                                alt="moveagency logo" 
                                className="object-contain max-w-40 sm:max-w-52 lg:max-w-72" 
                            />
                        </a>
                    </div>

                    {/* Masaüstü Linkləri */}
                    <div className="hidden lg:flex flex-row items-center justify-center flex-1 space-x-10 text-lg">
                        {renderNavLink('#home', 'Ana Sayfa')}
                        {renderNavLink('#services', 'Hizmetler')}
                        {renderNavLink('#about', 'Hakkımızda')}
                        {renderNavLink('#contact', 'İletişim')}
                    </div>

                    {/* Masaüstü Sağ Tərəf: Buton + Dil Seçimi */}
                    <div className="hidden lg:flex items-center space-x-5 font-montserrat">
                        <a 
                            href="#contact" 
                            className="relative inline-flex items-center justify-center bg-white text-black font-medium px-6 py-3.5 rounded-[10px] shadow-lg overflow-hidden group cursor-pointer"
                        >
                            <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-in-out z-0"></span>
                            <div className="flex items-center gap-2 z-10">
                                <Phone className="w-5 h-5 text-black" />
                                <span>Əlaqə saxla</span>
                            </div>
                            <div className="absolute top-0 left-0 bottom-0 overflow-hidden max-w-0 opacity-0 group-hover:max-w-full group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap z-20 flex items-center px-6">
                                <div className="flex items-center gap-2 text-white">
                                    <Phone className="w-5 h-5 shrink-0" />
                                    <span className="font-medium">Əlaqə saxla</span>
                                </div>
                            </div>
                        </a>

                        {/* Dil Seçimi (Dropdown) */}
                        <div className="relative font-montserrat" ref={langDropdownRef}>
                            <button 
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center space-x-1.5 text-white/90 hover:text-white px-2 py-2 transition-colors text-base font-normal cursor-pointer"
                            >
                                <span>{currentLang}</span>
                                <ChevronDown size={18} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 mt-2 w-24 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setCurrentLang(lang.code);
                                                setLangOpen(false);
                                            }}
                                            className={`w-full text-center px-3 py-2.5 text-base transition-colors hover:bg-white/20 font-montserrat ${
                                                currentLang === lang.code ? 'bg-white/10 text-white' : 'text-gray-300'
                                            }`}
                                        >
                                            {lang.code}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Planşet və Mobil üçün Hamburger Butonu */}
                    <div className="lg:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(true)} 
                            className="text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label="Toggle Menu"
                        >
                            <Menu size={30} />
                        </button>
                    </div>
                </nav>

                {/* Mobil Menyu (İstədiyiniz orijinal dizayn və keçidlərlə) */}
                <div 
                    className={`fixed inset-0 z-50 bg-[#FAF7F2] text-black flex flex-col justify-between py-8 transition-all duration-700 ease-in-out ${
                        isOpen 
                            ? 'opacity-100 pointer-events-auto [clip-path:circle(150%_at_100%_0%)]' 
                            : 'opacity-0 pointer-events-none [clip-path:circle(0%_at_100%_0%)]'
                    }`}
                >
                    {/* Yuxarı Hissə: Logo və X Butonu */}
                    <div className="w-full px-6 pb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={logo} alt="moveagency logo" className="object-contain max-w-44" />
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="bg-black text-white p-2.5 rounded-lg hover:bg-black/80 transition-colors cursor-pointer"
                            aria-label="Close Menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 1. Xətt: Soldan sağa açılır */}
                    <div 
                        className={`w-full h-[1px] bg-black/20 origin-left transition-transform duration-500 ease-out ${
                            isOpen ? 'scale-x-100' : 'scale-x-0'
                        }`}
                        style={{ transitionDelay: isOpen ? '400ms' : '0ms' }}
                    ></div>

                    {/* 2. Səhifə Adları */}
                    <div 
                        className={`flex flex-col items-center justify-center space-y-6 text-center font-playfair my-auto transform transition-all duration-700 ease-out ${
                            isOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm'
                        }`}
                        style={{ transitionDelay: isOpen ? '600ms' : '0ms' }}
                    >
                        {['#home', '#services', '#about', '#contact'].map((href, index) => {
                            const labels = ['Ana Sayfa', 'Hizmetler', 'Hakkımızda', 'İletişim'];
                            return (
                                <a 
                                    key={href}
                                    href={href} 
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl sm:text-3xl font-normal text-black/80 hover:text-black tracking-wide transition-colors"
                                >
                                    {labels[index]}
                                </a>
                            );
                        })}
                    </div>

                    {/* Alt Hissə: Əlaqə məlumatları, Xəttlər və Sosial Şəbəkələr */}
                    <div className="w-full max-w-md mx-auto px-6 space-y-6 font-montserrat">
                        
                        {/* 3. Xətt (Mailin üstü) */}
                        <div 
                            className={`w-full h-[1px] bg-black/25 origin-right transition-transform duration-500 ease-out ${
                                isOpen ? 'scale-x-100' : 'scale-x-0'
                            }`}
                            style={{ transitionDelay: isOpen ? '800ms' : '0ms' }}
                        ></div>

                        {/* 4. Mail və Ünvan */}
                        <div 
                            className={`text-center space-y-1 w-full transform transition-all duration-700 ease-out ${
                                isOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm'
                            }`}
                            style={{ transitionDelay: isOpen ? '950ms' : '0ms' }}
                        >
                            <a href="mailto:info@moveagency.az" className="block text-sm sm:text-base font-normal text-black/90 hover:underline">
                                info@moveagency.az
                            </a>
                            <p className="text-xs sm:text-sm font-montserrat text-black/60">
                                Bakı şəhəri, Azərbaycan
                            </p>
                        </div>

                        {/* 5. Xətt (Mailin altı) */}
                        <div 
                            className={`w-full h-[1px] bg-black/25 origin-left transition-transform duration-500 ease-out ${
                                isOpen ? 'scale-x-100' : 'scale-x-0'
                            }`}
                            style={{ transitionDelay: isOpen ? '1150ms' : '0ms' }}
                        ></div>

                        {/* 6. Əlaqə saxla + Sosial Media */}
                        <div 
                            className={`flex items-center justify-between pt-2 transform transition-all duration-700 ease-out ${
                                isOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm'
                            }`}
                            style={{ transitionDelay: isOpen ? '1300ms' : '0ms' }}
                        >
                            <a 
                                href="tel:*8400" 
                                className="flex items-center justify-center gap-2 bg-[#0B132B] text-white px-5 py-3 rounded-xl shadow-md text-md font-semibold hover:bg-black transition-colors"
                            >
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>Əlaqə saxla</span>
                            </a>

                            <div className="flex items-center space-x-3">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border border-black/20 rounded-xl hover:bg-black hover:text-white transition-colors">
                                    <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border border-black/20 rounded-xl hover:bg-black hover:text-white transition-colors">
                                    <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* 7. Dil Seçimi */}
                        <div 
                            className={`flex items-center justify-center space-x-3 text-md font-normal pt-2 text-black/70 font-montserrat transform transition-all duration-700 ease-out ${
                                isOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm'
                            }`}
                            style={{ transitionDelay: isOpen ? '1450ms' : '0ms' }}
                        >
                            {languages
                                .filter((lang) => lang.code !== currentLang)
                                .map((lang, idx, arr) => (
                                    <React.Fragment key={lang.code}>
                                        <button
                                            onClick={() => setCurrentLang(lang.code)}
                                            className="cursor-pointer transition-colors hover:text-black font-medium"
                                        >
                                            {lang.code}
                                        </button>
                                        {idx < arr.length - 1 && <span className="text-black/30">•</span>}
                                    </React.Fragment>
                                ))}
                        </div>

                    </div>

                </div>
            </header>
        </>
    );
};

export default Navbar;