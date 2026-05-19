import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { defaultLocale } from '$lib/i18n/locales';

export const prerender = true;

export function load() {
	throw redirect(307, `${base}/${defaultLocale}`);
}
