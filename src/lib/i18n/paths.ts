import { base } from '$app/paths';
import type { Locale } from './locales';

/** Path after `/da` or `/en`, e.g. `''`, `'/experience/bmf-systems'`. */
export function pathAfterLocale(pathname: string): string {
	let p = pathname.replace(/\/$/, '') || '/';
	if (base && p.startsWith(base)) {
		p = p.slice(base.length) || '/';
	}
	const m = p.match(/^\/(da|en)(\/.*)?$/);
	if (!m) return '';
	return m[2] ?? '';
}

export function localizedHref(locale: Locale, pathSuffix = ''): string {
	const suf = pathSuffix === '/' ? '' : pathSuffix;
	return `${base}/${locale}${suf}`;
}
