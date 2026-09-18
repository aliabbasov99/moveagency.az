import LegalPage from '../components/LegalPage';
import { useLocale } from '../locales/useLocale';

const PrivacyPolicy = () => {
    const { dict } = useLocale();
    const content = dict.legal.privacyContent;
    
    return (
        <LegalPage title={dict.legal.privacy.title} updated={dict.legal.privacy.updated}>
            <p>{content.intro}</p>

            <h2>{content.section1}</h2>
            <ul>
                <li>{content.section1Item1}</li>
                <li>{content.section1Item2}</li>
            </ul>

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

export default PrivacyPolicy;
