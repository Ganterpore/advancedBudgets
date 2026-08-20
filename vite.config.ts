import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [sveltekit(),
		Icons({
		compiler: 'svelte',
			autoInstall: true
	}),
		SvelteKitPWA({
			// This app is server-rendered per-user (auth + live budget data), so we only
			// precache static build assets/icons — not page HTML — and never register a
			// navigateFallback, meaning navigations always hit the network as before.
			registerType: 'prompt',
			// The web app manifest is served dynamically instead (src/routes/manifest.webmanifest)
			// so its theme_color/background_color can match the logged-in user's saved theme.
			// See src/lib/types/userTypes.ts for the theme definitions.
			manifest: false,
			devOptions: {
				enabled: false
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
