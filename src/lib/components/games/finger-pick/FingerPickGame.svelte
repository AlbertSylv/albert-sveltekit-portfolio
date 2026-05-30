<script lang="ts">
	import { base } from '$app/paths';
	import type { Locale } from '$lib/i18n/locales';
	import { t } from '$lib/i18n/copy';
	import {
		dotColor,
		FINGER_DOT_COLORS,
		shuffledColorIndices
	} from '$lib/games/finger-pick/colors';
	import {
		SETTLE_MS,
		COUNTDOWN_SECONDS,
		MAX_FINGERS,
		FLASH_MS,
		pulseDurationSec,
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
	let winnerId = $state<number | null>(null);
	let flashColor = $state<string | null>(null);
	/** Shuffled palette indices still available this round */
	let colorPool = $state<number[]>(shuffledColorIndices());
	let reducedMotion = $state(false);

	let settleTimer: ReturnType<typeof setTimeout> | undefined;
	let countdownTimer: ReturnType<typeof setInterval> | undefined;
	let flashTimer: ReturnType<typeof setTimeout> | undefined;

	const fingerMap = $derived(new Map(fingers.map((f) => [f.id, f])));

	const pulseDuration = $derived(
		phase === 'countdown' && countdown > 0 ? `${pulseDurationSec(countdown)}s` : '2s'
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function clearTimers() {
		clearTimeout(settleTimer);
		clearInterval(countdownTimer);
		clearTimeout(flashTimer);
		settleTimer = countdownTimer = flashTimer = undefined;
	}

	function resetGame() {
		clearTimers();
		phase = 'waiting';
		fingers = [];
		countdown = 0;
		winnerId = null;
		flashColor = null;
		colorPool = shuffledColorIndices();
	}

	function takeColorIndex(): number {
		if (colorPool.length > 0) return colorPool.pop()!;
		const used = new Set(fingers.map((f) => f.colorIndex));
		for (let i = 0; i < FINGER_DOT_COLORS.length; i++) {
			if (!used.has(i)) return i;
		}
		return 0;
	}

	function releaseColorIndex(colorIndex: number) {
		if (!colorPool.includes(colorIndex)) {
			colorPool = [...colorPool, colorIndex];
		}
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
		if (phase === 'flash') return;
		e.preventDefault();
		playEl?.setPointerCapture(e.pointerId);

		if (fingerMap.size >= MAX_FINGERS) return;

		const { x, y } = localCoords(e.clientX, e.clientY);
		const colorIndex = takeColorIndex();
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
		const removed = fingerMap.get(pointerId)!;
		const map = new Map(fingerMap);
		map.delete(pointerId);
		releaseColorIndex(removed.colorIndex);
		syncFingers(map);

		if (phase === 'countdown' || phase === 'flash') {
			clearTimers();
			phase = 'waiting';
			countdown = 0;
			flashColor = null;
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
				revealWinner();
			}
		}, 1000);
	}

	function revealWinner() {
		const list = [...fingerMap.values()];
		if (list.length < 2) {
			phase = 'waiting';
			return;
		}
		const winner = list[pickWinnerIndex(list.length)]!;
		winnerId = winner.id;
		flashColor = dotColor(winner.colorIndex);

		if (reducedMotion) {
			phase = 'winner';
			flashColor = null;
			return;
		}

		phase = 'flash';
		flashTimer = setTimeout(() => {
			flashColor = null;
			phase = 'winner';
			flashTimer = undefined;
		}, FLASH_MS);
	}

	function dotClass(id: number): string {
		let c = 'dot';
		if (phase === 'waiting' || phase === 'countdown') c += ' dot-pulse';
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
		style="--pulse-duration: {pulseDuration}"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerCancel}
		onlostpointercapture={(e) => removePointer(e.pointerId)}
	>
		{#if phase === 'flash' && flashColor}
			<div
				class="flash"
				style="background-color: {flashColor}"
				aria-hidden="true"
			></div>
		{/if}

		{#each fingers as finger (finger.id)}
			{@const fill = dotColor(finger.colorIndex)}
			<span
				class={dotClass(finger.id)}
				style="left: {finger.x}px; top: {finger.y}px; background-color: {fill}; --dot-ring: {fill}"
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
		color: var(--games-ink);
		text-decoration: none;
		line-height: 1;
	}
	.back:focus-visible {
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

	.flash {
		position: absolute;
		inset: 0;
		z-index: 15;
		pointer-events: none;
		animation: screen-flash 780ms cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
	}

	@keyframes screen-flash {
		0% {
			opacity: 0;
		}
		42% {
			opacity: 0.52;
		}
		100% {
			opacity: 0;
		}
	}

	.dot {
		position: absolute;
		width: 100px;
		height: 100px;
		margin-left: -50px;
		margin-top: -50px;
		border-radius: 50%;
		pointer-events: none;
		box-shadow: 0 3px 12px rgb(74 36 16 / 0.22);
		z-index: 5;
		transition: opacity 220ms ease, transform 220ms ease;
	}
	.dot-pulse {
		animation: finger-pulse var(--pulse-duration, 2s) ease-in-out infinite;
	}
	.dot-winner {
		animation: finger-winner 1s ease-in-out infinite;
		box-shadow:
			0 0 0 4px var(--games-surface-card),
			0 0 0 8px var(--dot-ring),
			0 4px 16px rgb(74 36 16 / 0.25);
		z-index: 10;
	}
	.dot-faded {
		opacity: 0.22;
		transform: scale(0.88);
		animation: none;
	}

	@keyframes finger-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.9;
		}
	}

	@keyframes finger-winner {
		0%,
		100% {
			transform: scale(1.12);
		}
		50% {
			transform: scale(1.24);
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
		z-index: 4;
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
		z-index: 8;
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
		z-index: 8;
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
		.dot-pulse,
		.dot-winner {
			animation: none;
		}
		.flash {
			animation-duration: 120ms;
		}
	}
</style>
