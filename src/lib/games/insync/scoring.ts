import { SCALE_MAX, SCALE_MIN, valueToPercent } from './scale';

/** Distance from target (same thresholds as syncVerdict / verdictPoints) */
export const SYNC_ZONE_3 = 6;
export const SYNC_ZONE_2 = 18;
export const SYNC_ZONE_1 = 35;

/** Opaque zone fills for psychic/reveal slider (0 → 3 pts, outer to inner) */
export const SCORING_ZONE_COLORS = {
	pts0: '#e4ddd0',
	pts1: '#9ec5de',
	pts2: '#e6b84d',
	pts3: '#6a9e62'
} as const;

/** Wedge half-widths for future competitive mode */
export const WEDGE_4 = 5;
export const WEDGE_3 = 12;
export const WEDGE_2 = 20;

export type BandLayout = { left: number; width: number };

export function pointBandsForTarget(target: number): {
	band1: BandLayout;
	band2: BandLayout;
	band3: BandLayout;
} {
	const band = (radius: number): BandLayout => {
		const lo = Math.max(SCALE_MIN, target - radius);
		const hi = Math.min(SCALE_MAX, target + radius);
		const left = valueToPercent(lo);
		const right = valueToPercent(hi);
		return { left, width: Math.max(0, right - left) };
	};
	return {
		band1: band(SYNC_ZONE_1),
		band2: band(SYNC_ZONE_2),
		band3: band(SYNC_ZONE_3)
	};
}

export type SyncVerdict = 'perfect' | 'close' | 'mid' | 'far';

export function syncVerdict(target: number, guess: number): SyncVerdict {
	const d = Math.abs(target - guess);
	if (d <= SYNC_ZONE_3) return 'perfect';
	if (d <= SYNC_ZONE_2) return 'close';
	if (d <= SYNC_ZONE_1) return 'mid';
	return 'far';
}

export function teamPoints(target: number, guess: number): 0 | 2 | 3 | 4 {
	const d = Math.abs(target - guess);
	if (d <= WEDGE_4) return 4;
	if (d <= WEDGE_3) return 3;
	if (d <= WEDGE_2) return 2;
	return 0;
}

export function opponentPoint(
	target: number,
	guess: number,
	pick: 'left' | 'right'
): 0 | 1 {
	const correct = pick === 'left' ? target < guess : target > guess;
	return correct ? 1 : 0;
}

/** Points awarded to the guessing team each round */
export function verdictPoints(verdict: SyncVerdict): number {
	switch (verdict) {
		case 'perfect':
			return 3;
		case 'close':
			return 2;
		case 'mid':
			return 1;
		default:
			return 0;
	}
}
