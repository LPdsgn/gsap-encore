import type { Adapter } from '../types.js';

type Handler = () => void;

/** The slice of Swup 4 this adapter needs; structural, so `swup` stays out of the types */
export interface SwupLike {
	hooks: {
		before(hook: 'content:replace', handler: Handler): unknown;
		on(hook: 'content:replace', handler: Handler): unknown;
		off(hook: 'content:replace', handler: Handler): unknown;
	};
}

/**
 * Swup 4: cleanup before `content:replace` (old DOM still live, so pins revert cleanly),
 * refresh after it.
 *
 * @example
 * const swup = new Swup();
 * encore.init({ adapter: swupAdapter(swup) });
 */
export function swupAdapter(swup: SwupLike): Adapter {
	return {
		name: 'swup',
		connect({ beforeSwap, afterSwap }) {
			swup.hooks.before('content:replace', beforeSwap);
			swup.hooks.on('content:replace', afterSwap);
			return () => {
				swup.hooks.off('content:replace', beforeSwap);
				swup.hooks.off('content:replace', afterSwap);
			};
		},
	};
}
