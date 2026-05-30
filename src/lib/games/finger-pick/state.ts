export type FingerPhase = 'waiting' | 'countdown' | 'spinning' | 'winner';

export type Finger = {
	id: number;
	x: number;
	y: number;
	colorIndex: number;
};

export const SETTLE_MS = 400;
export const COUNTDOWN_SECONDS = 3;
export const MAX_FINGERS = 10;

export type SpinStep = {
	highlightIndex: number;
	delayMs: number;
};

/** Roulette highlight schedule with increasing pauses. */
export function buildSpinSchedule(fingerCount: number, extraCycles = 2): SpinStep[] {
	if (fingerCount < 1) return [];
	const totalSteps = fingerCount * extraCycles + fingerCount;
	const schedule: SpinStep[] = [];
	for (let step = 0; step < totalSteps; step++) {
		const highlightIndex = step % fingerCount;
		const t = step / Math.max(1, totalSteps - 1);
		const delayMs = Math.round(70 + t * t * 350);
		schedule.push({ highlightIndex, delayMs });
	}
	return schedule;
}

export function pickWinnerIndex(fingerCount: number): number {
	return Math.floor(Math.random() * fingerCount);
}
