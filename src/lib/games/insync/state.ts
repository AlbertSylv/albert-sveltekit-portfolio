import type { ActiveTeam, GameMode, InSyncPhase } from './types';
import { DEFAULT_ROUNDS_PER_GAME } from './types';

export type { ActiveTeam };

export type RoundState = {
	phase: InSyncPhase;
	mode: GameMode;
	teamA: string;
	teamB: string;
	activeTeam: ActiveTeam;
	/** Full rounds (each team plays once); 1..roundsPerGame */
	roundNumber: number;
	roundsPerGame: number;
	scoreA: number;
	scoreB: number;
	cardId: string | null;
	target: number | null;
	guess: number;
};

export function initialRoundState(): RoundState {
	return {
		phase: 'teams',
		mode: 'casual',
		teamA: '',
		teamB: '',
		activeTeam: 'A',
		roundNumber: 1,
		roundsPerGame: DEFAULT_ROUNDS_PER_GAME,
		scoreA: 0,
		scoreB: 0,
		cardId: null,
		target: null,
		guess: 0
	};
}

export { DEFAULT_ROUNDS_PER_GAME, ROUNDS_MAX, ROUNDS_MIN } from './types';
