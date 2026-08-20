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
			manifest: {
				name: 'Advanced Budgets',
				short_name: 'Budgets',
				description: 'Track spending and manage budgets',
				theme_color: '#161c91',
				background_color: '#161c91',
				display: 'standalone',
				start_url: '/',
				icons: [
					{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			},
			devOptions: {
				enabled: false
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
