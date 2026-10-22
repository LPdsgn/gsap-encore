import gsap from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Encore } from './core.js';
import { scrollTriggerOf } from './scroll-trigger.js';

const ICON = '%c ';
const ICON_STYLE = [
	'background: url("data:image/svg+xml,%3Csvg%20version%3D%221.0%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400.000000pt%22%20height%3D%22400.000000pt%22%20viewBox%3D%220%200%20400.000000%20400.000000%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%3E%3Cg%20transform%3D%22translate(0.000000%2C400.000000)%20scale(0.100000%2C-0.100000)%22%20fill%3D%22%230ae448%22%20stroke%3D%22none%22%3E%3Cpath%20d%3D%22M853%203945%20c-202%20-36%20-385%20-133%20-533%20-284%20-189%20-194%20-281%20-430%20-274%20-708%205%20-262%2098%20-478%20283%20-664%20150%20-150%20310%20-234%20519%20-272%2063%20-11%2082%20-26%2037%20-28%20-14%20-1%20-28%20-2%20-32%20-3%20-5%20-1%20-26%20-5%20-48%20-10%20-287%20-57%20-567%20-291%20-685%20-573%20-55%20-132%20-73%20-224%20-74%20-378%200%20-283%2092%20-505%20289%20-700%20181%20-179%20399%20-273%20650%20-280%20446%20-12%20823%20248%20964%20667%2027%2081%2047%20178%2042%20206%20-1%206%202%2012%206%2012%205%200%2010%20-12%2011%20-27%207%20-91%2045%20-219%2095%20-318%20103%20-206%20297%20-387%20506%20-471%20213%20-86%20482%20-93%20694%20-18%20146%2053%20258%20124%20373%20239%20126%20126%20218%20293%20260%20473%2019%2078%2025%20259%2013%20352%20-42%20308%20-249%20594%20-534%20737%20-103%2052%20-306%20107%20-350%2094%20-5%20-1%20-6%201%20-2%205%204%204%2014%209%2022%2010%207%201%2032%205%2055%208%20310%2043%20615%20282%20738%20578%2058%20139%2075%20228%2076%20383%200%20154%20-14%20234%20-64%20364%20-87%20226%20-283%20432%20-504%20531%20-143%2064%20-269%2088%20-436%2084%20-298%20-7%20-550%20-134%20-745%20-375%20-92%20-113%20-171%20-295%20-191%20-439%20-3%20-23%20-7%20-48%20-8%20-55%20-1%20-8%20-6%20-18%20-10%20-22%20-4%20-4%20-6%20-3%20-5%202%207%2022%20-13%20129%20-37%20207%20-50%20158%20-124%20280%20-243%20399%20-138%20137%20-285%20218%20-481%20265%20-83%2020%20-284%2025%20-377%209z%20m1199%20-1279%20c93%20-264%20270%20-459%20521%20-576%2084%20-39%20228%20-80%20279%20-80%2043%200%2025%20-16%20-24%20-23%20-197%20-26%20-383%20-121%20-534%20-271%20-157%20-156%20-258%20-357%20-287%20-573%20-5%20-33%20-12%20-36%20-15%20-5%20-20%20257%20-196%20543%20-429%20698%20-115%2076%20-324%20153%20-423%20156%20-17%201%20-33%206%20-37%2011%20-3%206%20-2%207%204%204%2016%20-10%20203%2033%20283%2065%20307%20125%20554%20436%20596%20748%2010%2073%2017%2069%2031%20-15%208%20-44%2023%20-107%2035%20-139z%20m-1102%20-662%20c0%20-8%20-19%20-13%20-24%20-6%20-3%205%201%209%209%209%208%200%2015%20-2%2015%20-3z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") no-repeat black center',
	'background-size: 12px 12px',
	'padding: 2px 6px',
	'border-radius: 2px 0 0 2px',
].join(';');
const TITLE = '%cencore%c';
const TITLE_STYLE =
	'background: #424242; color: white; padding: 2px 4px; border-radius: 0 2px 2px 0';

const log = (message: string, ...rest: unknown[]) => {
	console.log(`${ICON}${TITLE} ${message}`, ICON_STYLE, TITLE_STYLE, '', ...rest);
};

const isContext = (item: unknown): item is gsap.Context =>
	typeof item === 'object' && item !== null && Array.isArray((item as gsap.Context).data);

/** Every GSAP object a context owns, nested contexts (matchMedia, setups) included */
const owned = (ctx: gsap.Context, into: Set<unknown>) => {
	for (const item of ctx.data as unknown[]) {
		if (isContext(item)) {
			owned(item, into);
			continue;
		}
		into.add(item);
		if (item instanceof gsap.core.Timeline) {
			for (const child of item.getChildren(true, true, false)) into.add(child);
		}
	}
};

export interface Orphans {
	tweens: gsap.core.Tween[];
	scrollTriggers: ScrollTrigger[];
}

/**
 * Logs the lifecycle to the console with a badge, exposes `window.encore`, and adds
 * `encore.orphans()`: tweens and ScrollTriggers alive that no setup owns (they would survive
 * the next swap). Returns the detach function.
 *
 * @example
 * import.meta.env.DEV && import('gsap-encore/debug').then((m) => m.attach(encore));
 */
export function attach(encore: Encore): () => void {
	const orphans = (): Orphans => {
		const tracked = new Set<unknown>();
		for (const { ctx } of encore.entries().values()) owned(ctx, tracked);
		const ST = scrollTriggerOf(gsap);
		return {
			tweens: gsap.globalTimeline
				.getChildren(true, true, false)
				.filter((t) => !tracked.has(t)) as gsap.core.Tween[],
			scrollTriggers: (ST?.getAll() ?? []).filter((st) => !tracked.has(st)),
		};
	};

	const describe = (key: string) =>
		encore.entries().get(key)?.persist ? `${key} (persist)` : key;
	const offs = [
		encore.events.on('setup', (key) => log(`🔧 setup ${describe(key)}`)),
		encore.events.on('cleanup', (key) => log(`🧹 cleanup ${key}`)),
		encore.events.on('before-swap', () => log('⏳ before swap', [...encore.entries().keys()])),
		encore.events.on('after-swap', () => {
			const { tweens, scrollTriggers } = orphans();
			log('🔄 after swap', {
				orphanTweens: tweens.length,
				orphanScrollTriggers: scrollTriggers.length,
			});
		}),
	];

	const exposed = Object.assign(encore, { orphans });
	(window as Window & { encore?: typeof exposed }).encore = exposed;
	// Usually attached through a dynamic import, after the first setups ran: list them now
	log('attached', [...encore.entries().keys()].map(describe));

	return () => {
		for (const off of offs) off();
		delete (window as Window & { encore?: unknown }).encore;
	};
}
