import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'adapters/swup': 'src/adapters/swup.ts',
		'adapters/barba': 'src/adapters/barba.ts',
		'adapters/astro': 'src/adapters/astro.ts',
		debug: 'src/debug.ts',
	},
	format: ['esm', 'cjs'],
	target: 'es2020',
	dts: true,
	sourcemap: true,
	clean: true,
	// Entries share only types, so nothing gets duplicated without splitting
	splitting: false,
	external: ['gsap', 'gsap/ScrollTrigger'],
});
