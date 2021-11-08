import localeEn from './locales/en';
import localeEs from "./locales/es";

const dictionary = {
    'en': localeEn,
    'es': localeEs
};

export default function localize(key) {
    const lang = window.services.Localization.locale.language;

    const dict = dictionary[lang] || dictionary['en'];

    if (dict[key]) {
        return dict[key];
    }

    return window.services.Localization.localize(key);
}