import gsapDefault from 'gsap';
import { Emitter } from './emitter.js';
import { scrollTriggerOf } from './scroll-trigger.js';
import type { EncoreEvents, Entry, InitOptions, Setup, SetupFn, SetupOptions } from './types.js';

let _gsap: typeof gsapDefault = gsapDefault;
const entries = new Map<string, Entry>();
const events = new Emitter<EncoreEvents>();
let disconnect: (() => void) | null = null;

const scrollTrigger = () => scrollTriggerOf(_gsap);

/** Use a specific gsap instance (e.g. the one loaded from a CDN) instead of the imported one */
function register(core: typeof gsapDefault): void {
	_gsap = core;
}

/**
 * Run `fn` once per `key` inside a `gsap.context()`. Idempotent: a second call with the same
 * key returns the same handles without running `fn` again, so page scripts can run on every
 * swap. Everything GSAP created in `fn`, or in a `contextSafe` wrapper, is reverted by `cleanup`.
 */
function setup(key: string, fn: SetupFn, { scope, persist = false }: SetupOptions = {}): Setup {
	let entry = entries.get(key);
	if (!entry) {
		// gsap calls fn(ctx, contextSafe) itself and keeps a returned function as cleanup
		const ctx = _gsap.context(fn as unknown as gsap.ContextFunc, scope);
		entry = { ctx, persist };
		entries.set(key, entry);
		events.emit('setup', key);
	}
	const { ctx } = entry;
	return {
		context: ctx,
		contextSafe: (f) => ctx.add(null as unknown as string, f) as typeof f,
	};
}

/** Revert and forget a key. Persistent keys survive unless `force` */
function cleanup(key: string, force = false): void {
	const entry = entries.get(key);
	if (!entry || (entry.persist && !force)) return;
	entry.ctx.revert();
	entries.delete(key);
	events.emit('cleanup', key);
}

function cleanupAll(force = false): void {
	for (const key of [...entries.keys()]) cleanup(key, force);
}

/** Recalculate every ScrollTrigger (safe refresh) */
function refresh(): void {
	scrollTrigger()?.refresh(true);
}

/** Connect a router adapter. Idempotent: a second adapter is ignored until `destroy()` */
function init({ adapter }: InitOptions = {}): void {
	if (!adapter || disconnect) return;
	disconnect = adapter.connect({
		beforeSwap: () => {
			events.emit('before-swap');
			cleanupAll();
		},
		afterSwap: () => {
			events.emit('after-swap');
			scrollTrigger()?.refresh();
		},
	});
}

/** Disconnect the adapter and revert everything, persistent keys included */
function destroy(): void {
	disconnect?.();
	disconnect = null;
	cleanupAll(true);
	events.destroy();
}

export const encore = {
	register,
	init,
	destroy,
	setup,
	cleanup,
	cleanupAll,
	refresh,
	/** Live, read-only view of the tracked keys (for `gsap-encore/debug`) */
	entries: (): ReadonlyMap<string, Entry> => entries,
	events,
};

export type Encore = typeof encore;
