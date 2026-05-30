import type { Locale } from '$lib/i18n/locales';
import { defaultLocale } from '$lib/i18n/locales';

export const GAMES_UNLOCK_KEY = 'sylvester-games-unlocked';
export const GAMES_LOCALE_KEY = 'sylvester-games-locale';

export function isGamesUnlocked(): boolean {
	if (typeof sessionStorage === 'undefined') return false;
	return sessionStorage.getItem(GAMES_UNLOCK_KEY) === '1';
}

export function setGamesUnlocked(locale: Locale): void {
	sessionStorage.setItem(GAMES_UNLOCK_KEY, '1');
	sessionStorage.setItem(GAMES_LOCALE_KEY, locale);
}

export function getGamesLocale(): Locale {
	if (typeof sessionStorage === 'undefined') return defaultLocale;
	return sessionStorage.getItem(GAMES_LOCALE_KEY) === 'da' ? 'da' : 'en';
}
