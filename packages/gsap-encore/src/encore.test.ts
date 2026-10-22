// @vitest-environment jsdom
import gsap from 'gsap';
import type Swup from 'swup';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type SwupLike, swupAdapter } from './adapters/swup.js';
import { encore } from './core.js';

const box = () => {
	const el = document.createElement('div');
	document.body.appendChild(el);
	return el;
};

afterEach(() => {
	encore.destroy();
	document.body.innerHTML = '';
});

describe('setup', () => {
	it('runs fn once per key and hands back the same context', () => {
		const fn = vi.fn();
		const a = encore.setup('k', fn);
		const b = encore.setup('k', fn);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(a.context, expect.any(Function));
		expect(b.context).toBe(a.context);
	});

	it('reverts what fn created and runs the returned teardown', () => {
		const el = box();
		const teardown = vi.fn();
		encore.setup('k', () => {
			gsap.set(el, { x: 100 });
			return teardown;
		});
		expect(el.style.transform).toContain('100px');
		encore.cleanup('k');
		expect(el.style.transform).toBe('');
		expect(teardown).toHaveBeenCalledTimes(1);
		expect(encore.entries().has('k')).toBe(false);
	});

	it('reverts tweens created later through contextSafe', () => {
		const el = box();
		const { contextSafe } = encore.setup('k', () => {});
		const onHover = contextSafe(() => gsap.set(el, { x: 100 }));
		onHover();
		expect(el.style.transform).toContain('100px');
		encore.cleanup('k');
		expect(el.style.transform).toBe('');
	});
});

describe('persist', () => {
	it('survives cleanupAll() and goes with force', () => {
		encore.setup('page', () => {});
		encore.setup('site', () => {}, { persist: true });
		encore.cleanupAll();
		expect([...encore.entries().keys()]).toEqual(['site']);
		encore.cleanupAll(true);
		expect(encore.entries().size).toBe(0);
	});
});

describe('swupAdapter', () => {
	it('accepts a real Swup instance (structural type)', () => {
		const typed: SwupLike = {} as Swup;
		expect(typed).toBeDefined();
	});

	it('cleans up before content:replace and detaches on destroy', () => {
		const hooks = { before: vi.fn(), on: vi.fn(), off: vi.fn() };
		encore.init({ adapter: swupAdapter({ hooks }) });
		encore.setup('page', () => {});

		const beforeSwap = hooks.before.mock.calls[0][1];
		const afterSwap = hooks.on.mock.calls[0][1];
		beforeSwap();
		expect(encore.entries().size).toBe(0);

		encore.destroy();
		expect(hooks.off).toHaveBeenCalledWith('content:replace', beforeSwap);
		expect(hooks.off).toHaveBeenCalledWith('content:replace', afterSwap);
	});
});
