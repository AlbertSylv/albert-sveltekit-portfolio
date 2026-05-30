/** Distinct warm dot colors on the cream play field */
export const FINGER_DOT_COLORS = [
	'#e15600',
	'#c24a00',
	'#8b3dff',
	'#12b8a0',
	'#c2502e',
	'#6b4c9a',
	'#d4a017',
	'#2d6a4f'
] as const;

export function dotColor(index: number): string {
	return FINGER_DOT_COLORS[index % FINGER_DOT_COLORS.length];
}
