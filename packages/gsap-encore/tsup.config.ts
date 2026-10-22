import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		debug: 'src/debug.ts',
	},
	format: ['esm', 'cjs'],
	target: 'es2020',
	dts: true,
	sourcemap: true,
	clean: true,
	// index and debug share only types, so nothing gets duplicated without splitting
	splitting: false,
	external: ['gsap', 'gsap/ScrollTrigger'],
});
