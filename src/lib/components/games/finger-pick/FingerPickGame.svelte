<script lang="ts">
	import { base } from '$app/paths';
	import type { Locale } from '$lib/i18n/locales';
	import { t } from '$lib/i18n/copy';
	import { dotColor } from '$lib/games/finger-pick/colors';
	import {
		SETTLE_MS,
		COUNTDOWN_SECONDS,
		MAX_FINGERS,
		buildSpinSchedule,
		pickWinnerIndex,
		type Finger,
		type FingerPhase
	} from '$lib/games/finger-pick/state';

	let { locale }: { locale: Locale } = $props();

	const tr = $derived(t(locale).games.fingerPick);
	const hubHref = `${base}/sylvester-games`;

	let playEl: HTMLDivElement | undefined;
	let phase = $state<FingerPhase>('waiting');
	let fingers = $state<Finger[]>([]);
	let countdown = $state(0);
	let highlightId = $state<number | null>(null);
	let winnerId = $state<number | null>(null);
	let nextColorIndex = $state(0);
	let reducedMotion = $state(false);

	let settleTimer: ReturnType<typeof setTimeout> | undefined;
	let countdownTimer: ReturnType<typeof setInterval> | undefined;
	let spinTimer: ReturnType<typeof setTimeout> | undefined;

	const fingerMap = $derived(new Map(fingers.map((f) => [f.id, f])));

	$effect(() => {
		if (typeof window === 'undefined') return;
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function clearTimers() {
		clearTimeout(settleTimer);
		clearInterval(countdownTimer);
		clearTimeout(spinTimer);
		settleTimer = countdownTimer = spinTimer = undefined;
	}

	function resetGame() {
		clearTimers();
		phase = 'waiting';
		fingers = [];
		countdown = 0;
		highlightId = null;
		winnerId = null;
		nextColorIndex = 0;
	}

	function localCoords(clientX: number, clientY: number) {
		const rect = playEl!.getBoundingClientRect();
		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	}

	function syncFingers(map: Map<number, Finger>) {
		fingers = [...map.values()];
	}

	function onPointerDown(e: PointerEvent) {
		if (phase === 'winner') {
			resetGame();
			return;
		}
		if (phase === 'spinning') return;
		e.preventDefault();
		playEl?.setPointerCapture(e.pointerId);

		if (fingerMap.size >= MAX_FINGERS) return;

		const { x, y } = localCoords(e.clientX, e.clientY);
		const colorIndex = nextColorIndex++;
		const map = new Map(fingerMap);
		map.set(e.pointerId, { id: e.pointerId, x, y, colorIndex });
		syncFingers(map);

		if (phase === 'waiting' || phase === 'countdown') {
			scheduleSettle();
		}
	}

	function onPointerMove(e: PointerEvent) {
		if (!fingerMap.has(e.pointerId)) return;
		const { x, y } = localCoords(e.clientX, e.clientY);
		const map = new Map(fingerMap);
		const f = map.get(e.pointerId)!;
		map.set(e.pointerId, { ...f, x, y });
		syncFingers(map);
	}

	function onPointerUp(e: PointerEvent) {
		removePointer(e.pointerId);
		playEl?.releasePointerCapture(e.pointerId);
	}

	function onPointerCancel(e: PointerEvent) {
		removePointer(e.pointerId);
	}

	function removePointer(pointerId: number) {
		if (!fingerMap.has(pointerId)) return;
		const map = new Map(fingerMap);
		map.delete(pointerId);
		syncFingers(map);

		if (phase === 'countdown') {
			clearTimers();
			phase = 'waiting';
			countdown = 0;
		} else if (phase === 'waiting') {
			clearTimers();
			if (map.size >= 2) scheduleSettle();
		}
	}

	function scheduleSettle() {
		clearTimeout(settleTimer);
		if (fingerMap.size < 2) return;
		settleTimer = setTimeout(() => {
			if (fingerMap.size >= 2 && phase === 'waiting') {
				startCountdown();
			}
		}, SETTLE_MS);
	}

	function startCountdown() {
		clearTimers();
		phase = 'countdown';
		countdown = COUNTDOWN_SECONDS;
		countdownTimer = setInterval(() => {
			if (fingerMap.size < 2) {
				clearTimers();
				phase = 'waiting';
				countdown = 0;
				return;
			}
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(countdownTimer);
				countdownTimer = undefined;
				startSpin();
			}
		}, 1000);
	}

	function startSpin() {
		const list = [...fingerMap.values()];
		if (list.length < 2) {
			phase = 'waiting';
			return;
		}
		phase = 'spinning';
		const winnerIndex = pickWinnerIndex(list.length);
		const winnerPointerId = list[winnerIndex]!.id;
		const schedule = buildSpinSchedule(list.length);

		if (schedule.length > 0) {
			const last = schedule[schedule.length - 1]!;
			schedule[schedule.length - 1] = { highlightIndex: winnerIndex, delayMs: last.delayMs };
		}

		if (reducedMotion) {
			winnerId = winnerPointerId;
			highlightId = winnerPointerId;
			phase = 'winner';
			return;
		}

		let step = 0;
		const runStep = () => {
			if (step < schedule.length) {
				const { highlightIndex, delayMs } = schedule[step]!;
				highlightId = list[highlightIndex]!.id;
				step += 1;
				spinTimer = setTimeout(runStep, delayMs);
			} else {
				winnerId = winnerPointerId;
				highlightId = winnerPointerId;
				phase = 'winner';
			}
		};
		runStep();
	}

	function dotClass(id: number): string {
		let c = 'dot';
		if (phase === 'spinning' && highlightId === id) c += ' dot-highlight';
		if (phase === 'winner') {
			if (winnerId === id) c += ' dot-winner';
			else c += ' dot-faded';
		}
		return c;
	}
</script>

<div class="finger-pick">
	<a class="back" href={hubHref} aria-label={tr.back}>{tr.back}</a>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="play"
		bind:this={playEl}
		role="application"
		aria-label={tr.waiting}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerCancel}
		onlostpointercapture={(e) => removePointer(e.pointerId)}
	>
		{#each fingers as finger (finger.id)}
			<span
				class={dotClass(finger.id)}
				class:dot-idle={phase === 'waiting' || phase === 'countdown'}
				style="left: {finger.x}px; top: {finger.y}px; background-color: {dotColor(finger.colorIndex)}"
			></span>
		{/each}

		{#if phase === 'waiting' && fingers.length < 2}
			<div class="hint">
				<p class="hint-title">{tr.waiting}</p>
				<p class="hint-sub">{tr.waitingSub}</p>
			</div>
		{/if}

		{#if phase === 'countdown' && countdown > 0}
			<div class="countdown" aria-live="polite" aria-atomic="true">
				<span class="countdown-num">{countdown}</span>
			</div>
		{/if}

		{#if phase === 'winner'}
			<div class="winner-banner" aria-live="polite">
				<p class="winner-title">{tr.winner}</p>
				<p class="winner-sub">{tr.playAgain}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.finger-pick {
		position: fixed;
		inset: 0;
		height: 100dvh;
		width: 100%;
		background: var(--games-bg);
		overflow: hidden;
	}

	.back {
		position: fixed;
		top: max(0.5rem, env(safe-area-inset-top));
		left: max(0.5rem, env(safe-area-inset-left));
		z-index: 30;
		min-width: 32px;
		min-height: 32px;
		padding: 0.35rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--games-faint);
		opacity: 0.4;
		text-decoration: none;
		line-height: 1;
	}
	.back:focus-visible {
		opacity: 1;
		outline: 2px solid var(--games-border-strong);
		outline-offset: 2px;
	}

	.play {
		position: absolute;
		inset: 0;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		overflow: hidden;
	}

	.dot {
		position: absolute;
		width: 60px;
		height: 60px;
		margin-left: -30px;
		margin-top: -30px;
		border-radius: 50%;
		pointer-events: none;
		box-shadow: 0 2px 8px rgb(74 36 16 / 0.2);
		transition: transform 80ms ease, opacity 200ms ease;
	}
	.dot-idle {
		animation: finger-pulse 2s ease-in-out infinite;
	}
	.dot-highlight {
		transform: scale(1.2);
		box-shadow: 0 0 0 3px var(--games-surface-card), 0 0 0 5px var(--games-accent);
	}
	.dot-winner {
		animation: finger-winner 1s ease-in-out infinite;
		box-shadow: 0 0 0 3px var(--games-surface-card), 0 0 0 6px var(--games-accent);
		z-index: 10;
	}
	.dot-faded {
		opacity: 0.2;
		transform: scale(0.85);
		animation: none;
	}

	@keyframes finger-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.06);
			opacity: 0.92;
		}
	}

	@keyframes finger-winner {
		0%,
		100% {
			transform: scale(1.15);
		}
		50% {
			transform: scale(1.28);
		}
	}

	.hint {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--games-pad);
		pointer-events: none;
	}
	.hint-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--games-ink);
		letter-spacing: -0.02em;
	}
	.hint-sub {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		color: var(--games-muted);
	}

	.countdown {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	.countdown-num {
		font-size: clamp(4rem, 20vw, 7rem);
		font-weight: 700;
		letter-spacing: -0.04em;
		color: var(--games-ink);
		line-height: 1;
	}

	.winner-banner {
		position: absolute;
		bottom: max(2rem, env(safe-area-inset-bottom));
		left: 0;
		right: 0;
		text-align: center;
		pointer-events: none;
		padding: var(--games-pad);
	}
	.winner-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--games-accent);
		letter-spacing: -0.02em;
	}
	.winner-sub {
		margin: 0.35rem 0 0;
		font-size: 0.875rem;
		color: var(--games-muted);
		font-weight: 500;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot-idle,
		.dot-winner {
			animation: none;
		}
		.dot-highlight {
			transform: scale(1.15);
		}
	}
</style>
