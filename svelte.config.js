import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/albert-sveltekit-portfolio' : ''
		},
		prerender: {
			// Enable prerendering and handle HTTP errors
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors during prerender
				if (message.includes('404')) {
					console.warn(`404 error on ${path} from ${referrer}`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
