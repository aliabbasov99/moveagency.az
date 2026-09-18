import LegalPage from '../components/LegalPage';
import { useLocale } from '../locales/useLocale';

const TermsOfUse = () => {
    const { dict } = useLocale();
    const content = dict.legal.termsContent;
    
    return (
        <LegalPage title={dict.legal.terms.title} updated={dict.legal.terms.updated}>
            <p>{content.intro}</p>

            <h2>{content.section1}</h2>
            <p>{content.section1Text}</p>

            <h2>{content.section2}</h2>
            <p>{content.section2Text}</p>

            <h2>{content.section3}</h2>
            <p>{content.section3Text}</p>

            <h2>{content.section4}</h2>
            <p>{content.section4Text}</p>

            <h2>{content.section5}</h2>
            <p>{content.section5Text}</p>

            <h2>{content.section6}</h2>
            <p>
                {content.section6Text}{' '}
                <a href="mailto:moveagencyy@gmail.com">moveagencyy@gmail.com</a> {dict.footer.or}{' '}
                <a href="tel:+994559242562">+994 55 924 25 62</a>.
            </p>
        </LegalPage>
    );
};

export default TermsOfUse;
