import type { Locale } from '$lib/i18n/locales';

export type GameEntry = {
	id: string;
	category: string;
	year: string;
	title: string;
	live: boolean;
	description: Record<Locale, string>;
	/** Path after site base, e.g. `/sylvester-games/finger-pick` */
	path?: string;
	mobileOnly?: boolean;
};

export const gamesCatalog: GameEntry[] = [
	{
		id: 'finger-pick',
		category: 'PARTY',
		year: '2026',
		title: 'Finger Pick',
		live: true,
		mobileOnly: true,
		path: '/sylvester-games/finger-pick',
		description: {
			en: 'Everyone puts a finger on the screen — one dot wins after the countdown.',
			da: 'Alle lægger en finger på skærmen — én prik vinder efter nedtællingen.'
		}
	}
];

export function gameHref(base: string, game: GameEntry): string | undefined {
	if (!game.path) return undefined;
	return `${base}${game.path}`;
}

export function experimentCount(locale: Locale, n: number): string {
	if (locale === 'da') return `${n} ${n === 1 ? 'eksperiment' : 'eksperimenter'}`;
	return `${n} ${n === 1 ? 'experiment' : 'experiments'}`;
}
