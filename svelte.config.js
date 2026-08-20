import adapter from '@sveltejs/adapter-vercel';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		// Pin the deployed function runtime explicitly: adapter-vercel otherwise infers it from
		// the local Node version doing the build, and this version of the adapter only
		// recognizes Node 18/20 for that inference (it errors out on anything else, e.g.
		// building locally with Node 24 via nvm). Vercel's current default/latest is 24.x.
		adapter: adapter({ runtime: 'nodejs24.x' })
	}
};

export default config;
