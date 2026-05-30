import type { ActiveTeam, GameMode, InSyncPhase } from './types';
import { ROUNDS_PER_GAME } from './types';

export type { ActiveTeam };

export type RoundState = {
	phase: InSyncPhase;
	mode: GameMode;
	teamA: string;
	teamB: string;
	activeTeam: ActiveTeam;
	roundNumber: number;
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
		scoreA: 0,
		scoreB: 0,
		cardId: null,
		target: null,
		guess: 0
	};
}

export { ROUNDS_PER_GAME };
