import { FINGER_DOT_COLORS } from '$lib/games/finger-pick/colors';
import type { RoundState } from './state';
import type { ActiveTeam } from './types';

export type { ActiveTeam };

/** Finger Pick palette — distinct from games chrome (marmalade/cream) */
export const TEAM_A_COLOR = FINGER_DOT_COLORS[1]; // #2e86ab
export const TEAM_B_COLOR = FINGER_DOT_COLORS[2]; // #a23b72 purple

export const TEAM_COLORS: Record<ActiveTeam, string> = {
	A: TEAM_A_COLOR,
	B: TEAM_B_COLOR
};

export function teamAccent(team: ActiveTeam): string {
	return TEAM_COLORS[team];
}

export function activeTeamName(state: RoundState): string {
	return state.activeTeam === 'A' ? state.teamA : state.teamB;
}
