export type FingerPhase = 'waiting' | 'countdown' | 'flash' | 'winner';

export type Finger = {
	id: number;
	x: number;
	y: number;
	colorIndex: number;
};

export const SETTLE_MS = 400;
export const COUNTDOWN_SECONDS = 3;
export const MAX_FINGERS = 10;
export const FLASH_MS = 480;

/** Pulse cycle length (seconds) — shorter = faster as countdown nears zero. */
export function pulseDurationSec(countdown: number): number {
	if (countdown >= 3) return 1.15;
	if (countdown >= 2) return 0.7;
	if (countdown >= 1) return 0.38;
	return 0.38;
}

export function pickWinnerIndex(fingerCount: number): number {
	return Math.floor(Math.random() * fingerCount);
}
