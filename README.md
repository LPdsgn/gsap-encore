<p align="center">
  <img alt="gsap-encore" src="https://shieldcn.dev/header/graph.svg?title=gsap-encore&subtitle=GSAP+contexts+keyed+by+name%2C+reverted+on+SPA+page+swaps+%28Swup%2C+Barba%2C+Astro%29.&logo=gsap&size=wide&mode=dark">
</p>
<p align="center">
  <img alt="TypeScript" src="https://shieldcn.dev/badge/TypeScript.svg?variant=branded&amp;brand=typescript">
  <img alt="Release + License" src="https://shieldcn.dev/group/github/release/lpdsgn/gsap-spa-manager+github/license/lpdsgn/gsap-spa-manager.svg?variant=branded">
</p>

## What it does

- **One `gsap.context()` per feature**, keyed by name, reverted before the next page comes in
- **`contextSafe`** for animations created later in handlers, like `useGSAP`
- **Persistence** for elements outside the swapped container
- **Adapters** for Swup, Barba and Astro view transitions, each its own subpath, no router types leaked
- **Debug module** on `gsap-encore/debug`, out of production bundles

## Quick Start

```bash
npm install gsap-encore gsap
```

```typescript
import { gsap } from 'gsap';
import { encore, swupAdapter } from 'gsap-encore';

encore.init({ adapter: swupAdapter(swup) });
encore.setup('hero', () => gsap.from('.hero', { opacity: 0, y: 50 }));
```

For the API and the SPA gotchas, see the [package README](./packages/gsap-encore/README.md).

## License

[MIT Licensed](./LICENSE). Made by [LPdsgn](https://github.com/LPdsgn).
