import { error } from '@sveltejs/kit';
import { EXPERIENCE_SLUGS } from '$lib/i18n/experience';
import { locales, type Locale } from '$lib/i18n/locales';
import { workCardBySlug } from '$lib/i18n/copy';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
	return locales.flatMap((lang) => EXPERIENCE_SLUGS.map((slug) => ({ lang, slug })));
}

export const load: PageLoad = ({ params }) => {
	if (!EXPERIENCE_SLUGS.includes(params.slug as (typeof EXPERIENCE_SLUGS)[number])) {
		throw error(404, 'Not found');
	}
	const locale = params.lang as Locale;
	const card = workCardBySlug(locale, params.slug);
	if (!card) throw error(404, 'Not found');
	return { card };
};
