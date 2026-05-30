export const SCALE_MIN = -100;
export const SCALE_MAX = 100;

export function valueToPercent(v: number): number {
	const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, v));
	return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

export function percentToValue(p: number): number {
	const clamped = Math.max(0, Math.min(100, p));
	const raw = SCALE_MIN + (clamped / 100) * (SCALE_MAX - SCALE_MIN);
	return Math.round(raw);
}

export function formatScaleValue(v: number): string {
	if (v > 0) return `+${v}`;
	if (v < 0) return `${v}`;
	return '0';
}

export function randomTarget(): number {
	return Math.floor(Math.random() * (SCALE_MAX - SCALE_MIN + 1)) + SCALE_MIN;
}
