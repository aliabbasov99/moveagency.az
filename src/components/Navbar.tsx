import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../assets/img/static/ma_logo.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("AZ");

  // PRELOADER STATE
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logoMoving, setLogoMoving] = useState(false);
  const [animationTarget, setAnimationTarget] = useState({ x: 0, y: 0, width: 280 });

  const logoRef = useRef(null);
  const langDropdownRef = useRef(null);

  const languages = [{ code: "AZ" }, { code: "EN" }, { code: "RU" }];

  // -----------------------------------------
  // LOADING & ANIMATION LOGIC
  // -----------------------------------------
  useEffect(() => {
    let timeout1, timeout2;

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

  // -----------------------------------------
  // LANGUAGE OUTSIDE CLICK
  // -----------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------------------
  // BODY SCROLL LOCK
  // -----------------------------------------
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // -----------------------------------------
  // NAV LINK HELPER
  // -----------------------------------------
  const navLinkClass =
    "relative inline-block text-[#eee] font-medium font-playfair uppercase tracking-wider group cursor-pointer";

  const renderNavLink = (text, href) => (
    <a href={href} className={navLinkClass}>
      <span>{text}</span>
      <span
        className="
          absolute left-0 top-0 text-white whitespace-nowrap overflow-hidden 
          max-w-0 opacity-0 transition-all duration-500 
          group-hover:max-w-full group-hover:opacity-100
        "
      >
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
                width: "280px",
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
                      width: "280px",
                    }
              }
            />

            {/* BOTTOM LOADING BAR */}
            <div className="absolute bottom-8 left-6 right-6">
              <div className="flex items-end justify-between mb-3 text-white">
                <span className="text-xs tracking-[0.3em] uppercase">
                  Move Agency
                </span>
                <span className="text-sm font-mono">{progress}%</span>
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
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/70 via-black/35 to-transparent">
        <nav className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-10 flex flex-row items-center justify-between">
          {/* LOGO */}
          <a href="#home" className="block">
            <img
              ref={logoRef}
              src={logo}
              alt="moveagency logo"
              className="object-contain max-w-40 sm:max-w-52 lg:max-w-72"
            />
          </a>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-10 text-lg">
            {renderNavLink("Ana Səhifə", "#home")}
            {renderNavLink("Xidmətlər", "#services")}
            {renderNavLink("Haqqımızda", "#about")}
            {renderNavLink("İletişim", "#contact")}
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="#contact"
              className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full font-medium transition-all duration-300 hover:bg-black hover:text-white"
            >
              <Phone size={18} />
              Əlaqə
            </a>

            {/* LANGUAGE DROPDOWN */}
            <div ref={langDropdownRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-white font-medium"
              >
                {currentLang}
                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-3 bg-white text-black rounded-lg overflow-hidden shadow-xl">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setCurrentLang(language.code);
                        setLangOpen(false);
                      }}
                      className="block w-full px-5 py-2 text-left hover:bg-gray-100"
                    >
                      {language.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-white"
          >
            <Menu size={30} />
          </button>
        </nav>
      </header>

      {/* =========================================
          MOBILE MENU
      ========================================= */}
      <div
        className={`fixed inset-0 z-[100] bg-[#FAF7F2] text-black lg:hidden transition-all duration-700 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          clipPath: isOpen
            ? "circle(150% at 100% 0%)"
            : "circle(0% at 100% 0%)",
        }}
      >
        <div className="flex flex-col h-full px-6 py-6">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="moveagency logo"
              className="object-contain max-w-44"
            />
            <button onClick={() => setIsOpen(false)} className="text-black">
              <X size={32} />
            </button>
          </div>

          <div className="flex flex-col gap-7 mt-20">
            <a
              href="#home"
              onClick={() => setIsOpen(false)}
              className="text-4xl font-playfair uppercase"
            >
              Ana Səhifə
            </a>
            <a
              href="#services"
              onClick={() => setIsOpen(false)}
              className="text-4xl font-playfair uppercase"
            >
              Xidmətlər
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="text-4xl font-playfair uppercase"
            >
              Haqqımızda
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-4xl font-playfair uppercase"
            >
              İletişim
            </a>
          </div>

          <div className="mt-auto">
            <div className="mb-8">
              <p className="text-sm mb-2">info@moveagency.az</p>
              <p className="text-sm mb-2">Bakı şəhəri, Azərbaycan</p>
              <a href="tel:*8400" className="text-sm">
                *8400
              </a>
            </div>

            <div className="flex gap-4 mb-8">
              <a href="#" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a href="#" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>

            <div className="flex gap-5">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setCurrentLang(language.code)}
                  className={`text-sm ${
                    currentLang === language.code
                      ? "font-bold"
                      : "opacity-50"
                  }`}
                >
                  {language.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;