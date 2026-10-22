import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		debug: 'src/debug.ts',
	},
	format: ['esm', 'cjs'],
	target: 'es2020',
	dts: true,
	// exports, main, module e types vengono riscritti in package.json a ogni build: niente drift
	exports: true,
	sourcemap: true,
	deps: { neverBundle: ['gsap', 'gsap/ScrollTrigger'] },
});
