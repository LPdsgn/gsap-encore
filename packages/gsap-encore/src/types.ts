/** Wraps a function so that every GSAP object it creates later belongs to the setup's context */
export type ContextSafe = <F extends (...args: never[]) => unknown>(fn: F) => F;

/**
 * Setup callback. Everything GSAP created inside is tracked by `ctx`.
 * Return a function to run extra teardown on cleanup (gsap semantics); any other return value,
 * like the tween of a concise arrow, is ignored.
 */
export type SetupFn = (ctx: gsap.Context, contextSafe: ContextSafe) => unknown;

export interface SetupOptions {
	/** Element or selector the context's selectors resolve against */
	scope?: Element | string;
	/** Survive `cleanupAll()` (page swaps); removed only with `force` */
	persist?: boolean;
}

export interface Setup {
	context: gsap.Context;
	contextSafe: ContextSafe;
}

export interface SwapHooks {
	beforeSwap(): void;
	afterSwap(): void;
}

/** Connects the page lifecycle of a router to encore; `connect` returns the disconnect function */
export interface Adapter {
	name: string;
	connect(hooks: SwapHooks): () => void;
}

export interface InitOptions {
	adapter?: Adapter;
}

export type Entry = { ctx: gsap.Context; persist: boolean };

export type EncoreEvents = {
	'before-swap': [];
	'after-swap': [];
	setup: [key: string];
	cleanup: [key: string];
};
