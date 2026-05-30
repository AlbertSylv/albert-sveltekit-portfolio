import { browser } from '$app/environment';

/** True when the device is likely a phone used for touch play (bar games). */
export function isMobilePlayDevice(): boolean {
	if (!browser) return false;
	return (
		window.matchMedia('(pointer: coarse)').matches &&
		window.matchMedia('(max-width: 48rem)').matches
	);
}
