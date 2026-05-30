/** Distinct dot colors — one unique color per finger until the pool is exhausted. */
export const FINGER_DOT_COLORS = [
	'#e15600',
	'#2e86ab',
	'#a23b72',
	'#f18f01',
	'#c73e1d',
	'#3b8c3e',
	'#6b4c9a',
	'#12b8a0',
	'#d4a017',
	'#5c4d7d',
	'#e84855',
	'#1d6f42'
] as const;

export function dotColor(index: number): string {
	return FINGER_DOT_COLORS[index % FINGER_DOT_COLORS.length] ?? FINGER_DOT_COLORS[0];
}

export function shuffledColorIndices(): number[] {
	const indices = FINGER_DOT_COLORS.map((_, i) => i);
	for (let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = indices[i]!;
		indices[i] = indices[j]!;
		indices[j] = tmp;
	}
	return indices;
}
