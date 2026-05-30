<script lang="ts">
	import type { Locale } from '$lib/i18n/locales';
	import type { GameEntry } from '$lib/games/catalog';

	let {
		game,
		locale,
		base = '',
		href,
		playLabel,
		soonLabel,
		mobileBadgeLabel = '',
		compact = false
	}: {
		game: GameEntry;
		locale: Locale;
		base?: string;
		href?: string;
		playLabel: string;
		soonLabel: string;
		mobileBadgeLabel?: string;
		compact?: boolean;
	} = $props();

	const thumbUrl = $derived(game.thumbSrc ? `${base}/${game.thumbSrc}` : null);
	const thumbAlt = $derived(game.thumbAlt?.[locale] ?? game.title);

	const ctaLabel = $derived(game.live ? playLabel : soonLabel);
	const isLink = $derived(Boolean(game.live && href));
</script>

<svelte:element
	this={isLink ? 'a' : 'div'}
	class="tile"
	class:tile-static={!isLink}
	{href}
	aria-disabled={!isLink ? 'true' : undefined}
>
	<div class="thumb" class:thumb-has-art={Boolean(thumbUrl)}>
		{#if thumbUrl}
			<img class="thumb-img" src={thumbUrl} alt={thumbAlt} width="560" height="560" loading="lazy" decoding="async" />
		{:else}
			<div class="thumb-hatch" aria-hidden="true"></div>
			<span class="thumb-frame" aria-hidden="true"></span>
		{/if}
		{#if !game.live}
			<span class="status-pill status-soon">{soonLabel.toUpperCase()}</span>
		{/if}
	</div>
	<div class="tile-body">
		<div class="tile-kicker">
			{game.category} · {game.year}{#if game.mobileOnly && mobileBadgeLabel}
				· {mobileBadgeLabel}{/if}
		</div>
		<div class="tile-title">{game.title}</div>
		{#if !compact}
			<p class="tile-desc">{game.description[locale]}</p>
		{/if}
		<span class="tile-play">{ctaLabel} →</span>
	</div>
</svelte:element>

<style>
	.tile {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--games-ink);
		background: var(--games-surface-card);
		border: 1px solid var(--games-border);
		border-radius: 2px;
		transition:
			transform 120ms ease,
			box-shadow 120ms ease,
			border-color 120ms ease;
	}
	.tile:hover {
		border-color: var(--games-border-strong);
		transform: translateY(-3px);
		box-shadow: var(--games-shadow);
	}
	.tile:focus-visible {
		outline: 2px solid var(--games-border-strong);
		outline-offset: 3px;
	}
	.tile-static {
		cursor: default;
	}
	.thumb {
		position: relative;
		aspect-ratio: 1 / 1;
		background: var(--games-placeholder);
		overflow: hidden;
		border-bottom: 1px solid var(--games-border);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.thumb-has-art {
		background: var(--games-surface-card);
	}
	.thumb-img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb-hatch {
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			135deg,
			var(--games-hatch) 0 1px,
			transparent 1px 13px
		);
	}
	.thumb-frame {
		position: relative;
		width: 50px;
		height: 34px;
		border: 1.5px solid var(--games-thumb-frame);
		border-radius: 1px;
	}
	.status-pill {
		position: absolute;
		top: 11px;
		right: 11px;
		font-size: 0.59rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		padding: 3px 7px;
		background: var(--games-pill-bg);
		border: 1px solid var(--games-border-strong);
		color: var(--games-ink);
	}
	.status-soon {
		color: var(--games-faint);
	}
	.tile-body {
		padding: clamp(11px, 2.5vw, 16px);
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.tile-kicker {
		font-size: 0.625rem;
		letter-spacing: 0.16em;
		color: var(--games-faint);
		font-weight: 600;
	}
	.tile-title {
		font-size: clamp(0.94rem, 2.4vw, 1.125rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 6px;
	}
	.tile-desc {
		margin: 6px 0 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--games-muted);
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.tile-play {
		margin-top: 12px;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--games-accent);
	}
</style>
