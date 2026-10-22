import type gsapDefault from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

/** ScrollTrigger, if the user registered it: encore never imports the plugin itself */
export const scrollTriggerOf = (core: typeof gsapDefault) =>
	(core.core as unknown as { globals(): Record<string, unknown> }).globals().ScrollTrigger as
		| typeof ScrollTrigger
		| undefined;
