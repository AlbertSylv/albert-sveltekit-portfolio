import type { Locale } from '$lib/i18n/locales';

export type CardCategory =
	| 'general'
	| 'social'
	| 'food'
	| 'pop'
	| 'life'
	| 'places'
	| 'weird'
	| 'debate'
	| 'classic';

export type InSyncCard = {
	id: string;
	category: CardCategory;
	left: Record<Locale, string>;
	right: Record<Locale, string>;
};

export type GameMode = 'casual' | 'competitive';

export type InSyncPhase = 'teams' | 'handoff' | 'psychic' | 'guess' | 'reveal' | 'gameOver';

export const ROUNDS_PER_GAME = 5;

export type ActiveTeam = 'A' | 'B';
