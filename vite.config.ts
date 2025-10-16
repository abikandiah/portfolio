import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import "vitest/config" // <-- just dummy import

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		nitroV2Plugin(),
		tanstackRouter({ autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
	],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		coverage: {
			reporter: ['text', 'json', 'html'],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	}
})
