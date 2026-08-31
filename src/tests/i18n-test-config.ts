import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonJson from '../../public/locales/en/common.json';
import userJson from '../../public/locales/en/user.json';

// Initialize i18n instance for testing
const setupI18n = () => {
    // Check if i18n is already initialized to avoid duplicate initialization
    if (i18n.isInitialized) {
        return i18n;
    }

    i18n.use(initReactI18next).init({
        lng: 'en',
        fallbackLng: 'en',
        ns: ['common', 'user'],
        defaultNS: 'common',
        resources: {
            en: {
                common: commonJson,
                user: userJson,
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

    return i18n;
};

export { setupI18n };

// Automatically set up i18n when this module is imported
setupI18n();

// Export a pre-configured instance
export default i18n;