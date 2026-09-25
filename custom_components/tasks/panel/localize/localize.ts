import * as en from './languages/en.json';
import * as de from './languages/de.json';
import * as es from './languages/es.json';
import * as fr from './languages/fr.json';
import * as it from './languages/it.json';
import * as nl from './languages/nl.json';
import * as pl from './languages/pl.json';
import * as ptBR from './languages/pt-BR.json';

import IntlMessageFormat from 'intl-messageformat';

var languages: any = {
    en: en,
    de: de,
    es: es,
    fr: fr,
    it: it,
    nl: nl,
    pl: pl,
    'pt-BR': ptBR,
};

/**
 * Resolve a Home Assistant language code to a translation table:
 * exact match ("pt-BR"), then the base tag ("es-419" -> "es"), then any
 * regional variant of the base ("pt" -> "pt-BR"), then English.
 */
function resolveLanguage(language: string): any {
    const lang = language.replace(/['"]+/g, '');
    if (languages[lang]) return languages[lang];
    const base = lang.split('-')[0];
    if (languages[base]) return languages[base];
    const regional = Object.keys(languages).find((key) => key.startsWith(base + '-'));
    return regional ? languages[regional] : languages['en'];
}

export function localize(string: string, language: string, ...args: any[]): string {
    var translated: string;

    try {
        translated = string.split('.').reduce((o, i) => o[i], resolveLanguage(language));
    } catch (e) {
        translated = string.split('.').reduce((o, i) => o[i], languages['en']);
    }

    if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

    if (!args.length) return translated;

    const argObject: Record<string, any> = {};
    for (let i = 0; i < args.length; i += 2) {
        let key = args[i];
        key = key.replace(/^{([^}]+)?}$/, '$1');
        argObject[key] = args[i + 1];
    }

    try {
        const message = new IntlMessageFormat(translated, language);
        return message.format(argObject) as string;
    } catch (err) {
        return 'Translation ' + err;
    }
}
