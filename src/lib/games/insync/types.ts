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

/** Default full rounds (both teams play once per round) */
export const DEFAULT_ROUNDS_PER_GAME = 5;
export const ROUNDS_MIN = 3;
export const ROUNDS_MAX = 12;
/** @deprecated Use DEFAULT_ROUNDS_PER_GAME */
export const ROUNDS_PER_GAME = DEFAULT_ROUNDS_PER_GAME;

export type ActiveTeam = 'A' | 'B';
