import type { Adapter } from '../types.js';

type Handler = () => void;

/** The slice of Barba 2 this adapter needs; structural, so `@barba/core` stays out of the types */
export interface BarbaLike {
	hooks: {
		beforeLeave(handler: Handler): unknown;
		afterEnter(handler: Handler): unknown;
	};
}

/**
 * Barba 2: cleanup before `leave`, refresh after `enter`.
 * Barba has no per-handler removal (`hooks.clear()` drops everyone's), so disconnecting
 * only disables the handlers.
 *
 * @example
 * barba.init();
 * encore.init({ adapter: barbaAdapter(barba) });
 */
export function barbaAdapter(barba: BarbaLike): Adapter {
	return {
		name: 'barba',
		connect({ beforeSwap, afterSwap }) {
			let active = true;
			barba.hooks.beforeLeave(() => active && beforeSwap());
			barba.hooks.afterEnter(() => active && afterSwap());
			return () => {
				active = false;
			};
		},
	};
}
