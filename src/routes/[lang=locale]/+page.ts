import { locales } from '$lib/i18n/locales';

export const prerender = true;

export function entries() {
	return locales.map((lang) => ({ lang }));
}
