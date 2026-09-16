import React, { useEffect, useState } from 'react';
import logo from '../assets/img/static/ma_logo.webp';

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let current = 0;

        const interval = setInterval(() => {
            current += Math.floor(Math.random() * 4) + 1;

            if (current >= 100) {
                current = 100;
                clearInterval(interval);

                setTimeout(() => {
                    setIsFinished(true);
                }, 500);
            }

            setProgress(current);
        }, 35);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isFinished) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFinished]);

    return (
        <div
            className={`
                fixed inset-0 z-[9999]
                bg-[#0B132B]
                flex flex-col items-center justify-center
                transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]
                ${isFinished
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }
            `}
        >
            {/* Logo */}
            <div
                className="flex items-center justify-center"
                style={{
                    transform: `scale(${0.35 + (progress / 100) * 0.65})`,
                    transition: 'transform 0.15s ease-out',
                }}
            >
                <img
                    src={logo}
                    alt="Move Agency"
                    className="w-52 sm:w-64 md:w-72 object-contain"
                />
            </div>

            {/* Loading */}
            <div className="absolute bottom-10 left-0 w-full px-8">
                <div className="max-w-xs mx-auto">

                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white/50 text-xs tracking-[0.3em] uppercase">
                            Loading
                        </span>

                        <span className="text-white text-sm font-montserrat">
                            {progress}%
                        </span>
                    </div>

                    {/* Progress line */}
                    <div className="w-full h-[1px] bg-white/20 overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-150 ease-out"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Preloader;