<script lang="ts">
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import type { Locale } from '$lib/i18n/locales';
	import { t } from '$lib/i18n/copy';
	import { categoryLabel } from '$lib/games/insync/categories';
	import { createDeck, drawCard, type DeckState } from '$lib/games/insync/deck';
	import { formatScaleValue, randomTarget } from '$lib/games/insync/scale';
	import { syncVerdict, verdictPoints } from '$lib/games/insync/scoring';
	import {
		DEFAULT_ROUNDS_PER_GAME,
		initialRoundState,
		ROUNDS_MAX,
		ROUNDS_MIN,
		type RoundState
	} from '$lib/games/insync/state';
	import {
		activeTeamName,
		TEAM_A_COLOR,
		TEAM_B_COLOR,
		teamAccent
	} from '$lib/games/insync/teams';
	import type { InSyncCard } from '$lib/games/insync/types';
	import InSyncSlider from './InSyncSlider.svelte';
	import SpectrumCard from './SpectrumCard.svelte';

	let { locale }: { locale: Locale } = $props();

	const tr = $derived(t(locale).games.insync);
	const gamesHubHref = `${base}/sylvester-games`;

	let round = $state<RoundState>(initialRoundState());
	let deck = $state<DeckState>(createDeck());
	let currentCard = $state<InSyncCard | null>(null);
	let storedTarget = $state<number | null>(null);

	let teamAInput = $state('');
	let teamBInput = $state('');
	let roundsInput = $state(DEFAULT_ROUNDS_PER_GAME);

	function clampRounds(n: number): number {
		return Math.min(ROUNDS_MAX, Math.max(ROUNDS_MIN, Math.round(n)));
	}

	const accent = $derived(teamAccent(round.activeTeam));
	const teamName = $derived(activeTeamName(round));

	const labels = $derived(
		currentCard
			? {
					left: currentCard.left[locale],
					right: currentCard.right[locale],
					category: categoryLabel(currentCard.category, locale)
				}
			: null
	);

	const revealTargetValue = $derived(
		round.phase === 'reveal' ? (storedTarget ?? round.target ?? 0) : null
	);

	const verdictKey = $derived.by(() => {
		if (revealTargetValue == null) return null;
		return syncVerdict(revealTargetValue, round.guess);
	});

	const psychicDisplay = $derived(
		round.phase === 'psychic' && round.target != null ? formatScaleValue(round.target) : null
	);

	const roundLabel = $derived(
		tr.roundLabel
			.replace('{current}', String(round.roundNumber))
			.replace('{total}', String(round.roundsPerGame))
	);

	const pointsThisRound = $derived(
		verdictKey != null && revealTargetValue != null ? verdictPoints(verdictKey) : 0
	);

	/** True when Team B just finished the final full round */
	const isLastTurn = $derived(
		round.roundNumber >= round.roundsPerGame && round.activeTeam === 'B'
	);

	const revealContinueLabel = $derived(
		isLastTurn ? tr.seeFinalScores : round.activeTeam === 'A' ? tr.nextTurn : tr.nextRound
	);

	const gameWinner = $derived.by((): 'A' | 'B' | 'tie' | null => {
		if (round.phase !== 'gameOver') return null;
		if (round.scoreA > round.scoreB) return 'A';
		if (round.scoreB > round.scoreA) return 'B';
		return 'tie';
	});

	$effect(() => {
		if (!browser) return;
		const onHide = () => {
			if (!document.hidden) return;
			if (round.phase === 'psychic' && round.target != null) {
				storedTarget = null;
				round = { ...round, phase: 'handoff', target: null };
			}
		};
		document.addEventListener('visibilitychange', onHide);
		return () => document.removeEventListener('visibilitychange', onHide);
	});

	function startGame() {
		const a = teamAInput.trim() || tr.defaultTeamA;
		const b = teamBInput.trim() || tr.defaultTeamB;
		const roundsPerGame = clampRounds(roundsInput);
		roundsInput = roundsPerGame;
		round = {
			...initialRoundState(),
			teamA: a,
			teamB: b,
			activeTeam: 'A',
			roundNumber: 1,
			roundsPerGame,
			scoreA: 0,
			scoreB: 0,
			phase: 'handoff'
		};
		deck = createDeck();
		beginRound();
	}

	function beginRound() {
		const { deck: nextDeck, card } = drawCard(deck);
		deck = nextDeck;
		if (!card) return;
		currentCard = card;
		storedTarget = null;
		round = {
			...round,
			cardId: card.id,
			target: null,
			guess: 0,
			phase: 'handoff'
		};
	}

	function enterPsychic() {
		const target = randomTarget();
		round = { ...round, phase: 'psychic', target };
	}

	function leavePsychic() {
		if (round.target != null) storedTarget = round.target;
		round = { ...round, phase: 'guess', target: null };
	}

	function lockReveal() {
		round = { ...round, phase: 'reveal' };
	}

	function nextRound() {
		let { scoreA, scoreB } = round;
		if (verdictKey) {
			const pts = verdictPoints(verdictKey);
			if (round.activeTeam === 'A') scoreA += pts;
			else scoreB += pts;
		}
		if (currentCard) {
			deck = { ...deck, discard: [...deck.discard, currentCard] };
		}
		const nextTeam = round.activeTeam === 'A' ? 'B' : 'A';
		let nextRoundNumber = round.roundNumber;
		if (round.activeTeam === 'B') {
			nextRoundNumber = round.roundNumber + 1;
		}
		if (nextRoundNumber > round.roundsPerGame) {
			round = { ...round, scoreA, scoreB, phase: 'gameOver' };
			return;
		}
		round = {
			...round,
			scoreA,
			scoreB,
			activeTeam: nextTeam,
			roundNumber: nextRoundNumber
		};
		beginRound();
	}

	function playAgain() {
		round = initialRoundState();
		deck = createDeck();
		currentCard = null;
		storedTarget = null;
		teamAInput = '';
		teamBInput = '';
		roundsInput = DEFAULT_ROUNDS_PER_GAME;
	}
</script>

<div class="insync" style="--team-accent: {accent}">
	<a class="back" href={gamesHubHref}>{tr.back}</a>

	<div class="viewport">
		{#if round.phase === 'teams'}
			<section class="panel panel-teams">
				<h1 class="title">{tr.title}</h1>
				<p class="teams-sub">{tr.teamsSub.replace('{rounds}', String(roundsInput))}</p>
				<div class="rounds-picker">
					<label class="rounds-label" for="insync-rounds">{tr.roundsLabel}</label>
					<input
						id="insync-rounds"
						class="rounds-input"
						type="number"
						min={ROUNDS_MIN}
						max={ROUNDS_MAX}
						bind:value={roundsInput}
						onchange={() => (roundsInput = clampRounds(roundsInput))}
					/>
				</div>
				<div class="team-cards">
					<label class="team-card team-card-a" style="--team-color: {TEAM_A_COLOR}">
						<span class="team-card-label">{tr.teamALabel}</span>
						<input
							type="text"
							bind:value={teamAInput}
							placeholder={tr.defaultTeamA}
							maxlength="24"
							autocomplete="off"
						/>
					</label>
					<label class="team-card team-card-b" style="--team-color: {TEAM_B_COLOR}">
						<span class="team-card-label">{tr.teamBLabel}</span>
						<input
							type="text"
							bind:value={teamBInput}
							placeholder={tr.defaultTeamB}
							maxlength="24"
							autocomplete="off"
						/>
					</label>
				</div>
				<div class="panel-footer">
					<button type="button" class="btn-primary" onclick={startGame}>{tr.start}</button>
				</div>
			</section>

		{:else if round.phase === 'handoff' && labels}
			<section class="panel">
				<p class="round-badge">{roundLabel}</p>
				<p class="phase-kicker">{tr.turnKicker.replace('{team}', teamName)}</p>
				<p class="score-strip">
					<span style="color: {TEAM_A_COLOR}">{round.teamA} {round.scoreA}</span>
					<span class="score-sep">·</span>
					<span style="color: {TEAM_B_COLOR}">{round.teamB} {round.scoreB}</span>
				</p>
				<div class="panel-main">
					<SpectrumCard
						leftLabel={labels.left}
						rightLabel={labels.right}
						categoryLabel={labels.category}
					/>
				</div>
				<p class="handoff-msg">{tr.handoffPass.replace('{team}', teamName)}</p>
				<p class="hint">{tr.handoffHint}</p>
				<div class="panel-footer">
					<button type="button" class="btn-primary" onclick={enterPsychic}
						>{tr.handoffPsychicButton}</button
					>
				</div>
			</section>

		{:else if round.phase === 'psychic' && labels && round.target != null && psychicDisplay}
			<section class="panel panel-psychic">
				<p class="round-badge">{roundLabel}</p>
				<p class="phase-kicker">{tr.psychicOnly}</p>
				<p class="psychic-value" style="color: {accent}" aria-live="polite">{psychicDisplay}</p>
				<div class="panel-main">
					<InSyncSlider
						leftLabel={labels.left}
						rightLabel={labels.right}
						mode="psychic"
						target={round.target}
						value={round.target}
						disabled={true}
						zoneLegend={tr.zoneLegend}
					/>
				</div>
				<div class="panel-footer">
					<button type="button" class="btn-primary" onclick={leavePsychic}
						>{tr.psychicDone}</button
					>
				</div>
			</section>

		{:else if round.phase === 'guess' && labels}
			<section class="panel">
				<p class="round-badge">{roundLabel}</p>
				<p class="phase-kicker">{tr.guessKicker.replace('{team}', teamName)}</p>
				<div class="panel-main">
					<InSyncSlider
						leftLabel={labels.left}
						rightLabel={labels.right}
						mode="guess"
						value={round.guess}
						accentColor={accent}
						onInput={(v) => (round = { ...round, guess: v })}
					/>
				</div>
				<div class="panel-footer">
					<button type="button" class="btn-primary" onclick={lockReveal}>{tr.revealButton}</button>
				</div>
			</section>

		{:else if round.phase === 'reveal' && labels && revealTargetValue != null}
			<section class="panel">
				<p class="round-badge">{roundLabel}</p>
				<p class="phase-kicker">{tr.revealKicker}</p>
				<div class="panel-main">
					<InSyncSlider
						leftLabel={labels.left}
						rightLabel={labels.right}
						mode="reveal"
						target={revealTargetValue}
						value={round.guess}
						disabled={true}
						accentColor={accent}
						zoneLegend={tr.zoneLegend}
					/>
				</div>
				{#if verdictKey}
					<p class="points-earned" style="color: {accent}">
						{tr.pointsEarned.replace('{n}', String(pointsThisRound))}
					</p>
					<p class="verdict">{tr.verdict[verdictKey]}</p>
				{/if}
				<p class="reveal-nums">
					{tr.revealTargetLabel}
					<strong>{formatScaleValue(revealTargetValue)}</strong>
					·
					{tr.revealGuessLabel}
					<strong>{formatScaleValue(round.guess)}</strong>
				</p>
				<div class="panel-footer">
					<button type="button" class="btn-primary" onclick={nextRound}>
						{revealContinueLabel}
					</button>
				</div>
			</section>

		{:else if round.phase === 'gameOver'}
			<section class="panel panel-gameover">
				<h2 class="gameover-title">{tr.gameOverTitle}</h2>
				<div class="final-scores">
					<div class="final-row" style="--team-color: {TEAM_A_COLOR}">
						<span class="final-name">{round.teamA}</span>
						<span class="final-score">{round.scoreA}</span>
					</div>
					<div class="final-row" style="--team-color: {TEAM_B_COLOR}">
						<span class="final-name">{round.teamB}</span>
						<span class="final-score">{round.scoreB}</span>
					</div>
				</div>
				{#if gameWinner === 'tie'}
					<p class="gameover-result">{tr.gameOverTie}</p>
				{:else if gameWinner === 'A'}
					<p class="gameover-result" style="color: {TEAM_A_COLOR}">
						{tr.gameOverWinner.replace('{team}', round.teamA)}
					</p>
				{:else if gameWinner === 'B'}
					<p class="gameover-result" style="color: {TEAM_B_COLOR}">
						{tr.gameOverWinner.replace('{team}', round.teamB)}
					</p>
				{/if}
				<div class="panel-footer">
					<button type="button" class="btn-primary btn-marmalade" onclick={playAgain}
						>{tr.playAgain}</button
					>
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	.insync {
		--insync-safe-top: max(2.25rem, calc(env(safe-area-inset-top) + 1.75rem));
		--insync-safe-bottom: max(0.75rem, env(safe-area-inset-bottom));
		--insync-safe-x: max(1rem, env(safe-area-inset-left));

		position: fixed;
		inset: 0;
		height: 100dvh;
		max-height: 100dvh;
		background: var(--games-bg);
		overflow: hidden;
		overscroll-behavior: none;
	}

	.back {
		position: fixed;
		top: max(0.5rem, env(safe-area-inset-top));
		left: max(0.5rem, env(safe-area-inset-left));
		z-index: 30;
		padding: 0.35rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--games-ink);
		text-decoration: none;
		line-height: 1;
	}

	.back:focus-visible {
		outline: 2px solid var(--games-border-strong);
		outline-offset: 2px;
	}

	.viewport {
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: var(--insync-safe-top) var(--insync-safe-x) var(--insync-safe-bottom);
		max-width: 28rem;
		margin: 0 auto;
		width: 100%;
		min-height: 0;
		overflow: hidden;
	}

	.panel {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.35rem, 1.5dvh, 0.65rem);
		overflow: hidden;
		width: 100%;
	}

	.panel-teams {
		align-items: stretch;
	}

	.panel-main {
		flex: 1;
		min-height: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.panel-footer {
		flex-shrink: 0;
		width: 100%;
		margin-top: auto;
		padding-top: 0.25rem;
	}

	.title {
		margin: 0;
		flex-shrink: 0;
		font-size: clamp(1.35rem, 5dvh, 1.75rem);
		font-weight: 700;
		color: var(--games-accent);
		letter-spacing: -0.03em;
	}

	.rounds-picker {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.65rem 0.85rem;
		background: var(--games-surface-card);
		border: 1px solid var(--games-border);
		border-radius: 2px;
	}

	.rounds-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--games-ink);
	}

	.rounds-input {
		width: 4rem;
		font: inherit;
		font-size: 1rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		text-align: center;
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--games-border-strong);
		border-radius: 2px;
		background: var(--games-bg);
		color: var(--games-ink);
	}

	.rounds-input:focus-visible {
		outline: 2px solid var(--games-border-strong);
		outline-offset: 2px;
	}

	.team-cards {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.65rem;
		margin-top: 0.35rem;
	}

	.team-card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.75rem 0.85rem;
		background: var(--games-surface-card);
		border: 2px solid var(--games-border);
		border-radius: 2px;
	}

	.teams-sub {
		margin: 0.35rem 0 0;
		font-size: 0.8125rem;
		color: var(--games-muted);
		line-height: 1.4;
	}

	.team-card-a,
	.team-card-b {
		border-left: 4px solid var(--team-color);
	}

	.round-badge {
		margin: 0;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--games-faint);
	}

	.score-strip {
		margin: 0;
		font-size: 0.6875rem;
		font-weight: 600;
		text-align: center;
	}

	.score-sep {
		color: var(--games-faint);
		margin: 0 0.35rem;
	}

	.points-earned {
		margin: 0;
		font-size: clamp(1.75rem, 8dvh, 2.5rem);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		text-align: center;
		line-height: 1.1;
	}

	.gameover-title {
		margin: 0;
		font-size: clamp(1.25rem, 5dvh, 1.5rem);
		font-weight: 700;
		color: var(--games-ink);
		text-align: center;
	}

	.final-scores {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.65rem;
		width: 100%;
	}

	.final-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0.85rem;
		background: var(--games-surface-card);
		border: 2px solid var(--games-border);
		border-left: 4px solid var(--team-color);
		border-radius: 2px;
	}

	.final-name {
		font-weight: 600;
		color: var(--games-ink);
	}

	.final-score {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--team-color);
	}

	.gameover-result {
		margin: 0;
		text-align: center;
		font-size: 1.0625rem;
		font-weight: 700;
	}

	.btn-marmalade {
		background: var(--games-accent-btn) !important;
		border-color: var(--games-accent-btn) !important;
	}

	.btn-marmalade:hover {
		background: var(--games-accent-btn-hover) !important;
		border-color: var(--games-accent-btn-hover) !important;
		filter: none !important;
	}

	.team-card-label {
		font-size: 0.5625rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--games-faint);
	}

	.team-card input {
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 600;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--games-ink);
	}

	.team-card input:focus-visible {
		outline: none;
	}

	.team-card:focus-within {
		outline: 2px solid var(--games-border-strong);
		outline-offset: 2px;
	}

	.phase-kicker {
		margin: 0;
		flex-shrink: 0;
		font-size: 0.5625rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--team-accent, var(--games-accent));
		text-align: center;
	}

	.handoff-msg {
		margin: 0;
		flex-shrink: 0;
		text-align: center;
		font-size: clamp(0.875rem, 2.5dvh, 1rem);
		line-height: 1.4;
		color: var(--games-ink);
	}

	.hint {
		margin: 0;
		flex-shrink: 0;
		text-align: center;
		font-size: 0.75rem;
		color: var(--games-muted);
		line-height: 1.35;
	}

	.psychic-value {
		margin: 0;
		flex-shrink: 0;
		font-size: clamp(2.75rem, 14dvh, 4.5rem);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.04em;
		line-height: 1;
		color: var(--team-accent, var(--games-accent));
		text-align: center;
	}

	.reveal-nums {
		margin: 0;
		flex-shrink: 0;
		font-size: 0.8125rem;
		color: var(--games-muted);
		text-align: center;
	}

	.reveal-nums strong {
		color: var(--games-ink);
		font-variant-numeric: tabular-nums;
	}

	.verdict {
		margin: 0;
		flex-shrink: 0;
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
		color: var(--games-muted);
	}

	.btn-primary {
		width: 100%;
		padding: clamp(0.65rem, 2dvh, 0.85rem) 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: inherit;
		color: var(--games-accent-btn-text);
		background: var(--team-accent, var(--games-accent-btn));
		border: 1px solid var(--team-accent, var(--games-accent-btn));
		border-radius: 2px;
		cursor: pointer;
	}

	.btn-primary:hover {
		filter: brightness(0.92);
	}

	.btn-primary:focus-visible {
		outline: 2px solid var(--games-border-strong);
		outline-offset: 3px;
	}

	.panel-teams .btn-primary {
		background: var(--games-accent-btn);
		border-color: var(--games-accent-btn);
	}

	.panel-teams .btn-primary:hover {
		background: var(--games-accent-btn-hover);
		border-color: var(--games-accent-btn-hover);
		filter: none;
	}
</style>
