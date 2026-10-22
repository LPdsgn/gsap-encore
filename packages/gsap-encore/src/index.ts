export { astroAdapter } from './adapters/astro.js';
export { type BarbaLike, barbaAdapter } from './adapters/barba.js';
export { type SwupLike, swupAdapter } from './adapters/swup.js';
export { type Encore, encore } from './core.js';
export { Emitter } from './emitter.js';
export type {
	Adapter,
	ContextSafe,
	EncoreEvents,
	Entry,
	InitOptions,
	Setup,
	SetupFn,
	SetupOptions,
	SwapHooks,
} from './types.js';
