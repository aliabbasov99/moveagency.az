import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/img/static/ma_logo.webp';
import moveM from '../assets/img/static/move_m.svg';
import moveO from '../assets/img/static/move_o.svg';
import moveV from '../assets/img/static/move_v.svg';
import moveE from '../assets/img/static/move_e.svg';
import agency from '../assets/img/static/agency.webp';
import { useLocale } from '../locales/useLocale';
import { getLocalizedPath } from '../locales/index';
import type { Locale } from '../locales/index';

const getInitialLogoWidth = () => {
    if (typeof window === 'undefined') return 288;
    const w = window.innerWidth;
    if (w < 640) return 160;
    if (w < 1024) return 208;
    return 288;
};

const LETTERS: Record<string, { src: string; alt: string }> = {
    M: { src: moveM, alt: 'M' },
    O: { src: moveO, alt: 'O' },
    V: { src: moveV, alt: 'V' },
    E: { src: moveE, alt: 'E' },
};

// Hərflər əvvəlcə plitənin SOLUNDA sıralanır: əvvəl M (ən sağda, plitəyə yaxın),
// sonra O, V, E onun soluna — nəticədə soldan-sağa "EVOM" görünür. Hamısı gələndən
// sonra isə plitə üzərinə bir-bir keçir: M əvvəlcə slide-in olur, o öz yerinə
// çatdıqdan sonra O, sonra V, sonra E — hamısı eyni anda yox, ard-arda.
const STAGING_ORDER = ['E', 'V', 'O', 'M'];
const FINAL_ORDER = ['M', 'O', 'V', 'E'];
const ENTRY_PHASE: Record<string, number> = { M: 2, O: 3, V: 4, E: 5 };

// Hərf ölçüləri və mövqeləri plitə genişliyinin faizi kimi hesablanır ki,
// animasiya istənilən ekran ölçüsündə eyni görünsün.
const LETTER_RATIO: Record<string, number> = {
    M: 79 / 54,
    O: 72 / 56,
    V: 68 / 54,
    E: 57 / 54,
};
// Hərf hündürlüyü əvvəlki kimi plitə hündürlüyünün 36.5%-idir — şrift ölçüsü dəyişmir.
const LETTER_HEIGHT_PCT = 36.5;

// Ofset hesabları üçün hərf enləri plitə ENİNİN faizi kimi ayrıca tapılır
// (CSS-də height % plitə hündürlüyünə işlədiyindən görünüşü dəyişmir).
const letterHeightVsPlateWidth = ((LETTER_HEIGHT_PCT / 100) * (75 / 470) * 100) / (44.26 / 100); // ≈13.16%

const LETTER_WIDTH: Record<string, number> = {
    M: LETTER_RATIO.M * letterHeightVsPlateWidth,
    O: LETTER_RATIO.O * letterHeightVsPlateWidth,
    V: LETTER_RATIO.V * letterHeightVsPlateWidth,
    E: LETTER_RATIO.E * letterHeightVsPlateWidth,
};

function computeLineOffsets(order: string[], gapPct: number): Record<string, number> {
    const total = order.reduce((s, l) => s + LETTER_WIDTH[l], 0) + gapPct * (order.length - 1);
    let cur = (100 - total) / 2;
    const out: Record<string, number> = {};
    order.forEach((l) => {
        out[l] = cur;
        cur += LETTER_WIDTH[l] + gapPct;
    });
    return out;
}

// Final yığılma: hər hərf özündən əvvəlki yerinə çatdıqdan SONRA başlayır,
// ona görə hərflər arası fasilə (FINAL_DEFER) slide müddətindən (FINAL_SLIDE) böyükdür.
const FINAL_DEFER = 360; // ms
const FINAL_SLIDE = 320; // ms

const Navbar = ({ onNavigate }: { onNavigate?: (target: number) => void }) => {
    const { locale, dict } = useLocale();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    // PRELOADER STATE
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [logoMoving, setLogoMoving] = useState(false);
    const [animationTarget, setAnimationTarget] = useState({ x: 0, y: 0, width: getInitialLogoWidth(), height: getInitialLogoWidth() * (75 / 470) });
    const [initialLogoWidth] = useState(getInitialLogoWidth);
    // Hərflər arası məsafə dəqiq 2px olsun deyə boşluq plitə eninin faizinə çevrilir.
    const gapPct = (2 / (initialLogoWidth * (44.26 / 100))) * 100;
    const { stagedLeft, finalLeft } = useMemo(() => {
        const staged = computeLineOffsets(STAGING_ORDER, gapPct);
        STAGING_ORDER.forEach((l) => {
            staged[l] -= 100; // "EVOM" sətri plitədən bir tam en sola
        });
        return { stagedLeft: staged, finalLeft: computeLineOffsets(FINAL_ORDER, gapPct) };
    }, [gapPct]);
    const [phase, setPhase] = useState(0);
    const [assembled, setAssembled] = useState(false);

    const logoRef = useRef<HTMLImageElement | null>(null);
    const langDropdownRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);

    const languages: { code: Locale; label: string }[] = [
        { code: 'az', label: 'AZ' },
        { code: 'en', label: 'EN' },
        { code: 'ru', label: 'RU' },
    ];

    // -----------------------------------------
    // LOADING & ANIMATION LOGIC
    // -----------------------------------------
    // Progress counter (rAF ilə — interval throttling-i səbəbindən ilişib qalmır)
    useEffect(() => {
        const start = performance.now();
        const duration = 2600;
        let rafId = 0;

        const tick = (now: number) => {
            const next = Math.min(100, ((now - start) / duration) * 100);
            setProgress(next);
            if (next < 100) rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Təhlükəsizlik: hər hansı səbəbdən animasiya tamamlanmasa da preloader mütləq bağlanır
    useEffect(() => {
        const failSafe = setTimeout(() => setLoading(false), 4500);
        return () => clearTimeout(failSafe);
    }, []);

    // Logo assembly: move_bg -> (fasilə) -> hərflər EVOM istiqamətində sola -> 
    // M slide-in, o gələndən sonra O, V, E bir-bir -> agency
    useEffect(() => {
        const BG_START = 35;        // bg-nin başlama vaxtı
        const BG_DURATION = 245;    // bg animasiyasının müddəti (transition ilə eyni)
        const PAUSE = 160;          // bg gəldikdən sonra gözləmə  <-- bunu artırıb/azalda bilərsən
        const LETTER_STEP = 300;    // staging-də hərflər arası interval
        const ASSEMBLY_PAUSE = 220; // E staging-ə gəldikdən sonra fasilə

        const firstLetter = BG_START + BG_DURATION + PAUSE; // 440ms
        const assemblyStart = firstLetter + LETTER_STEP * 3 + ASSEMBLY_PAUSE; // 1560ms
        const times = [
            BG_START,                    // phase 1: bg
            firstLetter,                 // phase 2: M  (EVOM-un ən sağında, plitəyə yaxın)
            firstLetter + LETTER_STEP,   // phase 3: O  (M-in soluna)
            firstLetter + LETTER_STEP * 2, // phase 4: V  (O-nun soluna)
            firstLetter + LETTER_STEP * 3, // phase 5: E  -> "EVOM" plitənin solunda yığılır
            assemblyStart,               // phase 6: M slide-in, o gəldikdən sonra O, sonra V, sonra E
            assemblyStart + FINAL_DEFER * 3 + FINAL_SLIDE + 60, // phase 7: agency
        ];
        const assembledAt = times[6] + 420; // agency animasiyası bitəndən sonra

        const timers = times.map((t, i) => setTimeout(() => setPhase(i + 1), t));
        const done = setTimeout(() => setAssembled(true), assembledAt);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(done);
        };
    }, []);

    // Yığılma bitdikdə logo Navbar-dakı yerinə uçur
    useEffect(() => {
        if (progress < 100 || !assembled) return;

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
                height: rect.height,
            });
        }

        const t1 = setTimeout(() => setLogoMoving(true), 140);
        const t2 = setTimeout(() => setLoading(false), 770);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [progress, assembled]);

    // Dropdown xaricinə klikləndikdə menyuları bağlamaq üçün
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && event.target instanceof Node && !langDropdownRef.current.contains(event.target)) {
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

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const el = document.getElementById(href.replace('#', ''));
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const y = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
        const clamped = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
        onNavigate?.(clamped);
        setIsOpen(false);
    };

    const navLinkClass = "relative inline-block text-[#eee] font-medium font-playfair uppercase tracking-wider group cursor-pointer";

    const renderNavLink = (href: string, text: string) => (
        <a href={href} onClick={(e) => handleNavClick(e, href)} className={navLinkClass}>
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
                        transition={{ duration: 0.175 }}
                    >
                        {/* CENTER LOGO — yığılma animasiyası */}
                        <motion.div
                            aria-hidden="true"
                            className="relative fixed left-1/2 top-1/2 flex items-center justify-center pointer-events-none"
                            style={{ aspectRatio: '470 / 75' }}
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
                                              duration: 0.63,
                                              ease: [0.76, 0, 0.24, 1],
                                          },
                                      }
                                    : {
                                          x: "-50%",
                                          y: "-50%",
                                          width: `${initialLogoWidth}px`,
                                      }
                            }
                        >
                            {/* move_bg — solid color plitə */}
                            <motion.div
                                className="relative bg-[#1C2222]"
                                style={{ width: '44.26%', height: '100%' }}
                                initial={{ x: '-70vw', opacity: 0 }}
                                animate={phase >= 1 ? { x: '0%', opacity: 1 } : { x: '-70vw', opacity: 0 }}
                                transition={{ duration: 0.245, ease: [0.76, 0, 0.24, 1] }}
                            >
                                {/* Hərflər əvvəlcə plitənin solunda "EVOM" kimi sıralanır;
                                    Finalda isə M əvvəlcə slide-in olur, o öz yerinə çatdıqdan
                                    sonra O, sonra V, sonra E bir-bir keçir (hamısı eyni anda yox). */}
                                {FINAL_ORDER.map((letter, fi) => {
                                    const { src, alt } = LETTERS[letter];
                                    const entered = phase >= ENTRY_PHASE[letter] || phase >= 6;
                                    const isFinal = phase >= 6;
                                    return (
                                        <motion.img
                                            key={alt}
                                            src={src}
                                            alt={alt}
                                            style={{
                                                position: 'absolute',
                                                top: `${(100 - LETTER_HEIGHT_PCT) / 2}%`,
                                                height: `${LETTER_HEIGHT_PCT}%`,
                                                width: 'auto',
                                            }}
                                            initial={false}
                                            animate={
                                                isFinal
                                                    ? {
                                                          x: '0%',
                                                          left: `${finalLeft[letter]}%`,
                                                          opacity: 1,
                                                          transition: {
                                                              left: {
                                                                  duration: FINAL_SLIDE / 1000,
                                                                  delay: (fi * FINAL_DEFER) / 1000,
                                                                  ease: [0.16, 1, 0.3, 1],
                                                              },
                                                              opacity: { duration: 0.15 },
                                                          },
                                                      }
                                                    : {
                                                          left: `${stagedLeft[letter]}%`,
                                                          x: entered ? '0%' : '-200%',
                                                          opacity: entered ? 1 : 0,
                                                          transition: {
                                                              x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                                                              opacity: { duration: 0.35 },
                                                          },
                                                      }
                                            }
                                        />
                                    );
                                })}
                            </motion.div>

                            {/* agency — sağdan-sola gəlib yapışır */}
                            <motion.img
                                src={agency}
                                alt="agency"
                                className="h-full w-auto object-contain"
                                style={{ width: '55.74%' }}
                                initial={{ x: '70vw', opacity: 0 }}
                                animate={phase >= 7 ? { x: '0%', opacity: 1 } : { x: '70vw', opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                            />
                        </motion.div>

                        {/* BOTTOM LOADING BAR */}
                        <div className="absolute bottom-8 left-6 right-6">
                            <div className="flex items-end justify-between mb-3 text-white">
                                <span className="text-sm self-end font-mono"></span>
                                <span className="text-sm self-end font-mono">{Math.round(progress)}%</span>
                            </div>

                            <div className="w-full h-[1px] bg-white/20 overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.07 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =========================================
                NAVBAR
            ========================================= */}
            <header ref={headerRef} className="text-white bg-gradient-to-b from-black/70 via-black/35 to-transparent fixed top-0 left-0 w-full z-50">
                <nav className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-6 xl:px-10 flex flex-row items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="block">
                            <img
                                ref={logoRef}
                                src={logo}
                                alt={dict.navbar.logoAlt}
                                className="object-contain max-w-40 sm:max-w-52 lg:max-w-44 xl:max-w-60 2xl:max-w-72"
                            />
                        </a>
                    </div>

                    {/* Masaüstü Linkləri */}
                    <div className="hidden lg:flex flex-row items-center justify-center flex-1 space-x-4 text-sm xl:space-x-8 xl:text-base">
                        {renderNavLink('#home', dict.navbar.home)}
                        {renderNavLink('#about', dict.navbar.about)}
                        {renderNavLink('#services', dict.navbar.services)}
                        {renderNavLink('#portfolio', dict.navbar.portfolio)}
                        {renderNavLink('#contact', dict.navbar.contact)}
                    </div>

                    {/* Masaüstü Sağ Tərəf: Buton + Dil Seçimi */}
                    <div className="hidden lg:flex items-center space-x-3 font-montserrat xl:space-x-5">
                        <a
                            href="https://wa.me/994559242562"
                            target="_blank"
                            rel="noreferrer"
                            className="relative inline-flex items-center justify-center gap-2 bg-white text-black font-medium px-4 py-2.5 text-sm rounded-[10px] shadow-lg overflow-hidden outline outline-1 outline-transparent hover:outline-black/20 transition-colors duration-500 ease-in-out group cursor-pointer xl:px-5 xl:py-3 xl:text-base"
                        >
                            <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out z-0"></span>
                            <Phone className="w-4 h-4 z-10 text-black group-hover:text-white transition-colors duration-500 ease-in-out xl:w-5 xl:h-5" />
                            <span className="relative z-10 whitespace-nowrap">
                                <span className="text-black transition-opacity duration-500 ease-in-out group-hover:opacity-0">{dict.navbar.contactBtn}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center justify-end overflow-hidden max-w-0 group-hover:max-w-full transition-all duration-500 ease-in-out">
                                    <span className="text-white">{dict.navbar.contactBtn}</span>
                                </span>
                            </span>
                        </a>

                        {/* Dil Seçimi (Dropdown) */}
                        <div className="relative font-montserrat" ref={langDropdownRef}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center space-x-1.5 text-white/90 hover:text-white px-1.5 py-2 transition-colors text-sm font-normal cursor-pointer xl:px-2 xl:text-base"
                                aria-label="Change language"
                            >
                                <span>{locale.toUpperCase()}</span>
                                <ChevronDown size={18} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 mt-2 w-24 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
                                    {languages.map((lang) => {
                                        const localizedPath = getLocalizedPath(lang.code, location.pathname);
                                        const href = localizedPath + location.search + location.hash;
                                        return (
                                            <Link
                                                key={lang.code}
                                                to={href}
                                                onClick={() => setLangOpen(false)}
                                                className={`block w-full text-center px-3 py-2.5 text-base transition-colors hover:bg-white/20 font-montserrat ${
                                                    locale === lang.code ? 'bg-white/10 text-white' : 'text-gray-300'
                                                }`}
                                            >
                                                {lang.label}
                                            </Link>
                                        );
                                    })}
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
                            <img src={logo} alt={dict.navbar.logoAlt} className="object-contain max-w-44" />
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
                        {[
                            { href: '#home', label: dict.navbar.home },
                            { href: '#about', label: dict.navbar.about },
                            { href: '#services', label: dict.navbar.services },
                            { href: '#portfolio', label: dict.navbar.portfolio },
                            { href: '#contact', label: dict.navbar.contact },
                        ].map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={(e) => handleNavClick(e, href)}
                                className="text-2xl sm:text-3xl font-normal text-black/80 hover:text-black tracking-wide transition-colors"
                            >
                                {label}
                            </a>
                        ))}
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

                        {/* 4. Mail */}
                        <div
                            className={`text-center space-y-1 w-full transform transition-all duration-700 ease-out ${
                                isOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm'
                            }`}
                            style={{ transitionDelay: isOpen ? '950ms' : '0ms' }}
                        >
                            <a href="mailto:moveagencyy@gmail.com" className="block text-sm sm:text-base font-normal text-black/90 hover:underline">
                                moveagencyy@gmail.com
                            </a>
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
                                href="https://wa.me/994559242562"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 bg-[#0B132B] text-white px-5 py-3 rounded-xl shadow-md text-md font-semibold hover:bg-black transition-colors"
                            >
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>{dict.navbar.contactBtn}</span>
                            </a>

                            <div className="flex items-center space-x-3">
                                <a href="https://www.youtube.com/@MoveAgencyy" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border border-black/20 rounded-xl hover:bg-black hover:text-white transition-colors">
                                    <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
                                </a>
                                <a href="https://www.instagram.com/moveagency.az" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border border-black/20 rounded-xl hover:bg-black hover:text-white transition-colors">
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
                                .filter((lang) => lang.code !== locale)
                                .map((lang, idx, arr) => {
                                    const localizedPath = getLocalizedPath(lang.code, location.pathname);
                                    const href = localizedPath + location.search + location.hash;
                                    return (
                                        <React.Fragment key={lang.code}>
                                            <Link
                                                to={href}
                                                onClick={() => setIsOpen(false)}
                                                className="cursor-pointer transition-colors hover:text-black font-medium"
                                            >
                                                {lang.label}
                                            </Link>
                                            {idx < arr.length - 1 && <span className="text-black/30">•</span>}
                                        </React.Fragment>
                                    );
                                })}
                        </div>

                    </div>

                </div>
            </header>
        </>
    );
};

export default Navbar;