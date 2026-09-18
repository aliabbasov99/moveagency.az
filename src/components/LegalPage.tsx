import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../locales/useLocale';
import { getLocalizedPath } from '../locales/index';

const LegalPage = ({
    title,
    updated,
    children,
}: {
    title: string;
    updated: string;
    children: ReactNode;
}) => {
    const { locale, dict } = useLocale();
    return (
        <div className="min-h-screen w-full bg-[#FAF7F2] text-[#0B132B]">
            <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28">
                <Link
                    to={getLocalizedPath(locale, '/')}
                    className="inline-block text-xs sm:text-sm uppercase tracking-widest text-[#0B132B]/60 hover:text-[#0B132B] transition-colors font-montserrat mb-10 lg:mb-14"
                >
                    {dict.footer.backToHome}
                </Link>

                <h1 className="font-playfair text-3xl sm:text-4xl uppercase tracking-wide">
                    {title}
                </h1>
                <div className="w-full h-[1px] bg-[#0B132B]/15 my-8" />
                <p className="text-xs sm:text-sm text-[#0B132B]/55 font-montserrat mb-8">
                    {dict.footer.lastUpdated} {updated}
                </p>

                <div className="space-y-4 font-montserrat text-[15px] sm:text-base leading-relaxed text-[#0B132B]/85 [&_h2]:font-playfair [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:text-[#0B132B] [&_h2]:pt-4 [&_h2]:normal-case [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-[#0B132B]">
                    {children}
                </div>

                <div className="mt-14 pt-6 border-t border-[#0B132B]/15 text-xs sm:text-sm text-[#0B132B]/55 font-montserrat">
                    {dict.footer.copyright}
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
