<script lang="ts">
	import { pointBandsForTarget, SCORING_ZONE_COLORS, type BandLayout } from '$lib/games/insync/scoring';
	import { formatScaleValue, percentToValue, SCALE_MAX, SCALE_MIN, valueToPercent } from '$lib/games/insync/scale';

	const THUMB_INSET = 20;

	let {
		leftLabel,
		rightLabel,
		value = $bindable(0),
		mode,
		target = null,
		disabled = false,
		accentColor = 'var(--games-ink)',
		zoneLegend = '',
		onInput
	}: {
		leftLabel: string;
		rightLabel: string;
		value?: number;
		mode: 'psychic' | 'guess' | 'reveal';
		target?: number | null;
		disabled?: boolean;
		/** Team color for live guess readout */
		accentColor?: string;
		/** Shown under track when point bands are visible */
		zoneLegend?: string;
		onInput?: (v: number) => void;
	} = $props();

	const showLiveValue = $derived(mode === 'guess' && !disabled);
	const liveDisplay = $derived(formatScaleValue(value));

	const interactive = $derived(mode === 'guess' && !disabled);
	const showThumb = $derived(mode === 'guess' || mode === 'reveal');
	const showTarget = $derived(target != null && (mode === 'psychic' || mode === 'reveal'));
	const showScoringZones = $derived(
		target != null && (mode === 'reveal' || mode === 'psychic')
	);
	const showSpectrumHalves = $derived(mode === 'guess');
	const pointBands = $derived(
		showScoringZones && target != null ? pointBandsForTarget(target) : null
	);
	const scoringZoneStyle = $derived(
		showScoringZones
			? `--zone-0: ${SCORING_ZONE_COLORS.pts0}; --zone-1: ${SCORING_ZONE_COLORS.pts1}; --zone-2: ${SCORING_ZONE_COLORS.pts2}; --zone-3: ${SCORING_ZONE_COLORS.pts3}`
			: undefined
	);
	const thumbPercent = $derived(valueToPercent(value));
	const targetPercent = $derived(target != null ? valueToPercent(target) : null);

	let trackEl: HTMLDivElement | undefined;

	function laneLeft(percent: number): string {
		return `calc(${THUMB_INSET}px + (100% - ${THUMB_INSET * 2}px) * ${percent} / 100)`;
	}

	function bandStyle(band: BandLayout): string {
		return `left: ${laneLeft(band.left)}; width: calc((100% - ${THUMB_INSET * 2}px) * ${band.width} / 100)`;
	}

	function setFromClientX(clientX: number) {
		if (!trackEl || !interactive) return;
		const rect = trackEl.getBoundingClientRect();
		const innerWidth = rect.width - THUMB_INSET * 2;
		const x = clientX - rect.left - THUMB_INSET;
		const p = (x / innerWidth) * 100;
		const v = percentToValue(p);
		value = v;
		onInput?.(v);
	}

	function onPointerDown(e: PointerEvent) {
		if (!interactive) return;
		e.preventDefault();
		trackEl?.setPointerCapture(e.pointerId);
		setFromClientX(e.clientX);
	}

	function onPointerMove(e: PointerEvent) {
		if (!interactive || !trackEl?.hasPointerCapture(e.pointerId)) return;
		setFromClientX(e.clientX);
	}

	function onPointerUp(e: PointerEvent) {
		trackEl?.releasePointerCapture(e.pointerId);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (!interactive) return;
		const step = e.shiftKey ? 10 : 1;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			const v = Math.max(SCALE_MIN, value - step);
			value = v;
			onInput?.(v);
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			const v = Math.min(SCALE_MAX, value + step);
			value = v;
			onInput?.(v);
		}
	}
</script>

<div class="slider-wrap" style={mode === 'guess' ? `--thumb-color: ${accentColor}` : undefined}>
	{#if showLiveValue}
		<p class="live-value" style="color: {accentColor}" aria-live="polite">{liveDisplay}</p>
	{/if}
	<div class="labels">
		<span class="label label-left">{leftLabel}</span>
		<span class="label label-right">{rightLabel}</span>
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="track-wrap"
		bind:this={trackEl}
		role="slider"
		tabindex={interactive ? 0 : -1}
		aria-valuemin={SCALE_MIN}
		aria-valuemax={SCALE_MAX}
		aria-valuenow={value}
		aria-label="{leftLabel} to {rightLabel}"
		aria-disabled={!interactive}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onkeydown={onKeyDown}
	>
		<div class="track-lane" style="--thumb-inset: {THUMB_INSET}px">
			<div class="track" class:track-scoring={showScoringZones} style={scoringZoneStyle} aria-hidden="true">
				{#if showScoringZones}
					<span class="track-base"></span>
					{#if pointBands}
						<span class="band band-1" style={bandStyle(pointBands.band1)}></span>
						<span class="band band-2" style={bandStyle(pointBands.band2)}></span>
						<span class="band band-3" style={bandStyle(pointBands.band3)}></span>
					{/if}
				{/if}
				{#if showSpectrumHalves}
					<span class="half half-minus"></span>
					<span class="half half-plus"></span>
				{/if}
				<span class="center-tick" aria-hidden="true"></span>
				{#if showTarget && targetPercent != null}
					<span class="target-pin" style="left: {laneLeft(targetPercent)}" aria-hidden="true">
						<span class="pin-head"></span>
						<span class="pin-stem"></span>
					</span>
				{/if}
				{#if showThumb}
					<span class="guess-pin" style="left: {laneLeft(thumbPercent)}; --thumb-color: {accentColor}" aria-hidden="true">
						<span class="guess-pin-stem"></span>
						<span class="guess-pin-head"></span>
					</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="scale-ends" aria-hidden="true">
		<span>{SCALE_MIN}</span>
		<span>0</span>
		<span>+{SCALE_MAX}</span>
	</div>

	{#if showScoringZones && zoneLegend}
		<p class="zone-legend">{zoneLegend}</p>
	{/if}
</div>

<style>
	.slider-wrap {
		width: 100%;
		flex-shrink: 0;
	}

	.live-value {
		margin: 0 0 clamp(0.35rem, 1.5dvh, 0.6rem);
		text-align: center;
		font-size: clamp(2rem, 10dvh, 3rem);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.03em;
		line-height: 1;
	}

	.labels {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: clamp(0.4rem, 1.5dvh, 0.65rem);
	}

	.label {
		font-size: clamp(0.6875rem, 2dvh + 0.35rem, 0.875rem);
		font-weight: 600;
		line-height: 1.2;
		max-width: 46%;
		color: var(--games-ink);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	.label-left {
		text-align: left;
	}

	.label-right {
		text-align: right;
	}

	.track-wrap {
		position: relative;
		height: clamp(6.5rem, 22dvh, 8rem);
		display: flex;
		align-items: center;
		touch-action: none;
		cursor: default;
		outline: none;
		overflow: visible;
	}

	.track-wrap[tabindex='0'] {
		cursor: pointer;
	}

	.track-wrap:focus-visible {
		outline: 2px solid var(--games-border-strong);
		outline-offset: 4px;
		border-radius: 4px;
	}

	.track-lane {
		position: relative;
		width: 100%;
		padding: 0 var(--thumb-inset);
		overflow: visible;
	}

	.track {
		position: relative;
		width: 100%;
		height: 20px;
		border-radius: 10px;
		overflow: visible;
	}

	.track-scoring .track-base {
		position: absolute;
		inset: 0;
		border-radius: 10px;
		background: var(--zone-0);
		pointer-events: none;
		z-index: 0;
	}

	.track-scoring .band {
		position: absolute;
		top: 0;
		height: 100%;
		border-radius: 10px;
		pointer-events: none;
		z-index: 1;
	}

	.track-scoring .band-1 {
		background: var(--zone-1);
		box-shadow: inset 0 0 0 1px rgb(46 90 120 / 0.35);
	}

	.track-scoring .band-2 {
		background: var(--zone-2);
		box-shadow: inset 0 0 0 1px rgb(120 90 20 / 0.35);
	}

	.track-scoring .band-3 {
		background: var(--zone-3);
		box-shadow: inset 0 0 0 1px rgb(40 80 36 / 0.4);
	}

	.half {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%;
		z-index: 1;
	}

	.half-minus {
		left: 0;
		background: rgb(74 36 16 / 0.2);
		border-radius: 10px 0 0 10px;
	}

	.half-plus {
		right: 0;
		background: rgb(225 86 0 / 0.35);
		border-radius: 0 10px 10px 0;
	}

	.center-tick {
		position: absolute;
		left: 50%;
		top: -6px;
		bottom: -6px;
		width: 2px;
		transform: translateX(-50%);
		background: var(--games-border-strong);
		border-radius: 1px;
		z-index: 2;
	}

	.guess-pin {
		position: absolute;
		top: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translate(-50%, 0);
		pointer-events: none;
		z-index: 5;
	}

	.guess-pin-stem {
		position: relative;
		z-index: 1;
		width: 3px;
		height: 22px;
		margin-bottom: -1px;
		background: var(--thumb-color, var(--games-ink));
		border-radius: 1px;
		flex-shrink: 0;
	}

	.guess-pin-head {
		position: relative;
		z-index: 2;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--thumb-color, var(--games-ink));
		border: 4px solid var(--games-surface-card);
		box-shadow: var(--games-shadow);
		flex-shrink: 0;
	}

	.target-pin {
		position: absolute;
		top: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translate(-50%, calc(-100% - 8px));
		pointer-events: none;
		z-index: 2;
	}

	.pin-head {
		position: relative;
		z-index: 2;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--games-accent);
		border: 2px solid var(--games-surface-card);
		box-shadow: 0 0 0 1px var(--games-accent);
		flex-shrink: 0;
	}

	.pin-stem {
		position: relative;
		z-index: 1;
		width: 3px;
		height: 22px;
		margin-top: -1px;
		background: var(--games-accent);
		border-radius: 1px;
		flex-shrink: 0;
	}

	.scale-ends {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		margin-top: 0.35rem;
		font-size: 0.5625rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--games-faint);
	}

	.scale-ends span:nth-child(1) {
		text-align: left;
	}

	.scale-ends span:nth-child(2) {
		text-align: center;
	}

	.scale-ends span:nth-child(3) {
		text-align: right;
	}

	.zone-legend {
		margin: 0.35rem 0 0;
		text-align: center;
		font-size: 0.625rem;
		font-weight: 600;
		color: var(--games-faint);
		line-height: 1.3;
	}
</style>
