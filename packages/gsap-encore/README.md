# gsap-encore

GSAP contexts keyed by name, reverted on SPA page swaps. Works with [Swup](https://swup.js.org), [Barba](https://barba.js.org), Astro view transitions, or any router through a 10-line adapter.

Encore is what [`useGSAP`](https://github.com/greensock/react) is for React, for sites that swap the DOM instead of re-rendering it: one `gsap.context()` per feature, `revert()` before the next page comes in, and nothing to track by hand.

```bash
npm install gsap-encore gsap
```

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swup from 'swup';
import { encore } from 'gsap-encore';
import { swupAdapter } from 'gsap-encore/adapters/swup';

gsap.registerPlugin(ScrollTrigger);
const swup = new Swup();
encore.init({ adapter: swupAdapter(swup) });

// In a page or component script, run on every load
encore.setup('hero', () => {
	gsap.from('.hero', { opacity: 0, y: 50 });
	ScrollTrigger.create({ trigger: '.hero', pin: true, end: '+=500' });
});
```

Before the swap, encore reverts every context that isn't `persist`ent: the tweens, the ScrollTriggers (pin spacers included) and the inline styles `from()` left behind. After the swap, it refreshes ScrollTrigger.

## API

### `encore.setup(key, fn, options?)`

Runs `fn` inside a `gsap.context()` and tracks it under `key`. Returns `{ context, contextSafe }`.

- **Idempotent.** A second call with the same key does not run `fn` again and returns the same handles, so a script can run on every page load.
- **`fn(ctx, contextSafe)`.** Everything GSAP created inside is tracked: tweens, timelines, ScrollTriggers, `gsap.matchMedia()` contexts. For non-GSAP side effects, `ctx.add(() => { listen(); return () => unlisten(); })`. A function returned by `fn` runs on cleanup.
- **`contextSafe(fn)`** wraps a function so that what it creates *later* (in a click or pointer handler, in a ScrollTrigger callback) is tracked too. Without it, those tweens survive the swap.
- **`options.scope`**: element or selector that scopes the context's selectors.
- **`options.persist`**: survive page swaps. Use it for elements outside the swapped container (header, cursor). Call it at module level, never in a per-page runner.

```ts
const { contextSafe } = encore.setup('cards', (ctx) => {
	const cards = gsap.utils.toArray<HTMLElement>('.card');
	const enter = contextSafe((card: HTMLElement) => gsap.to(card, { scale: 1.05 }));
	ctx.add(() => {
		cards.forEach((card) => card.addEventListener('pointerenter', () => enter(card)));
		return () => cards.forEach((card) => card.replaceWith(card.cloneNode(true)));
	});
}, { scope: '#works' });
```

### `encore.cleanup(key, force?)` / `encore.cleanupAll(force?)`

Revert and forget one key, or every key. Persistent keys stay unless `force` is true.

### `encore.refresh()`

`ScrollTrigger.refresh(true)`, if the plugin is registered.

### `encore.init({ adapter })` / `encore.destroy()`

Connect a router: `cleanupAll()` before the swap, `ScrollTrigger.refresh()` after. `destroy()` detaches the adapter and reverts everything, persistent keys included.

### `encore.register(gsap)`

Use a specific gsap instance, for example the one loaded from a CDN, instead of the one encore imports.

### `encore.events`

`on(event, listener)` returns the unsubscribe function. Events: `before-swap`, `after-swap`, `setup` and `cleanup` (both with the key).

### `encore.entries()`

Read-only map of the tracked keys, for tooling.

## Adapters

```ts
import { swupAdapter } from 'gsap-encore/adapters/swup'; // Swup 4: before/after content:replace, detaches with hooks.off
import { barbaAdapter } from 'gsap-encore/adapters/barba'; // Barba 2: hooks.beforeLeave / hooks.afterEnter
import { astroAdapter } from 'gsap-encore/adapters/astro'; // astro:before-swap / astro:after-swap
```

Adapters take structural types, so no router types leak into yours. A custom adapter is an object with `name` and `connect({ beforeSwap, afterSwap })` that returns its disconnect function. Call `beforeSwap` **while the old DOM is still in the document**, so pins and inline styles revert on the right elements.

## Debugging

```ts
import.meta.env.DEV && import('gsap-encore/debug').then((m) => m.attach(encore));
```

Logs setups, cleanups and swaps to the console with a badge, exposes `window.encore`, and adds `encore.orphans()`: the tweens and ScrollTriggers alive that no setup owns. Those are the ones that will survive the next swap. The module stays out of production bundles.

## SPA gotchas

- **Don't create animations outside a setup.** Encore no longer sweeps `ScrollTrigger.getAll()` on swap: a trigger created outside any context is yours to kill. `orphans()` shows them.
- **One key per feature, not per element.** Keys are idempotent: `setup('card-' + i, …)` in a loop works, `setup('card', …)` in a loop runs only the first.
- **Handlers need `contextSafe`.** A tween created in a click handler after `fn` returned isn't in the context.
- **Persistent setups and closures.** A persistent setup runs once; variables it assigns are set on that first run only. Keep it at module level.
- **Pins.** Reverting a pinned ScrollTrigger before the swap removes its pin spacer. If the adapter fires after the swap, prefer `position: sticky` in CSS for pinning.
- **`gsap.matchMedia()` across pages.** A matchMedia created inside a setup is reverted with it, but it stays in gsap's media list. Either create a fresh `gsap.matchMedia()` per setup, or keep one global and `revert()` it before the swap yourself.

## License

[MIT](../../LICENSE)
