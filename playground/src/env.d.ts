/// <reference types="astro/client" />
import type { encore } from 'gsap-encore';
import type { Orphans } from 'gsap-encore/debug';

declare global {
	interface Window {
		encore: typeof encore & { orphans(): Orphans };
	}
}
