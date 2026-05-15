import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const m = event.url.pathname.match(/\/(da|en)(\/|$)/);
	const lang = m?.[1] ?? 'da';

	return resolve(event, {
		transformPageChunk({ html }) {
			return html.replace('%lang%', lang);
		}
	});
};
