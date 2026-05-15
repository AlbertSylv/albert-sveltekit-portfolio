import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {string} */
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Force runes mode for app code; allow classic mode in dependencies.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build'
		}),
		paths: {
			base
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (message.includes('404')) {
					console.warn(`404 during prerender on ${path} (from ${referrer})`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
