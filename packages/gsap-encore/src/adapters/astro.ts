import type { Adapter } from '../types.js';

/**
 * Astro view transitions: cleanup on `astro:before-swap`, refresh on `astro:after-swap`.
 *
 * @example
 * encore.init({ adapter: astroAdapter() });
 */
export function astroAdapter(): Adapter {
	return {
		name: 'astro',
		connect({ beforeSwap, afterSwap }) {
			document.addEventListener('astro:before-swap', beforeSwap);
			document.addEventListener('astro:after-swap', afterSwap);
			return () => {
				document.removeEventListener('astro:before-swap', beforeSwap);
				document.removeEventListener('astro:after-swap', afterSwap);
			};
		},
	};
}
