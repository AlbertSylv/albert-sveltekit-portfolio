import type { Handle } from '@sveltejs/kit';
import { defaultLocale } from '$lib/i18n/locales';

export const handle: Handle = async ({ event, resolve }) => {
	const m = event.url.pathname.match(/\/(da|en)(\/|$)/);
	const lang = m?.[1] ?? defaultLocale;

	return resolve(event, {
		transformPageChunk({ html }) {
			return html.replace('%lang%', lang);
		}
	});
};
