<script lang="ts">
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { localizedHref } from '$lib/i18n/paths';
	import { t } from '$lib/i18n/copy';
	import { gamesCatalog, experimentCount, gameHref } from '$lib/games/catalog';
	import { isMobilePlayDevice } from '$lib/games/device';
	import { getGamesLocale } from '$lib/games/unlock';
	import GameTile from '$lib/components/games/GameTile.svelte';

	const gamesLocale = $derived(getGamesLocale());
	const tr = $derived(t(gamesLocale).games);
	const homeHref = $derived(localizedHref(gamesLocale, ''));

	let mobilePlay = $state(false);

	$effect(() => {
		if (!browser) return;
		const update = () => (mobilePlay = isMobilePlayDevice());
		update();
		const coarse = window.matchMedia('(pointer: coarse)');
		const narrow = window.matchMedia('(max-width: 48rem)');
		coarse.addEventListener('change', update);
		narrow.addEventListener('change', update);
		return () => {
			coarse.removeEventListener('change', update);
			narrow.removeEventListener('change', update);
		};
	});

	const visibleGames = $derived(
		gamesCatalog.filter((g) => !g.mobileOnly || mobilePlay)
	);
</script>

<svelte:head>
	<title>{tr.hubTitle} · Albert Sylvester</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="hub">
	<p class="hub-kicker">{tr.kickerTop}</p>
	<div class="hub-title-row">
		<span class="hub-dot" aria-hidden="true"></span>
		<h1 class="hub-title">{tr.hubTitle}</h1>
	</div>
	<p class="hub-lead">{tr.hubLead}</p>

	{#if visibleGames.length > 0}
		<section class="hub-panel" aria-label={tr.hubTitle}>
			<div class="hub-panel-rule" aria-hidden="true"></div>
			<div class="hub-grid-head">
				<span class="hub-grid-count">{experimentCount(gamesLocale, visibleGames.length)}</span>
			</div>
			<div class="hub-grid hub-grid-single">
				{#each visibleGames as game (game.id)}
					<GameTile
						{game}
						{base}
						locale={gamesLocale}
						href={gameHref(base, game)}
						playLabel={tr.play}
						soonLabel={tr.soon}
						mobileBadgeLabel={tr.mobileBadge}
					/>
				{/each}
			</div>
		</section>
	{/if}

	<p class="hub-back-wrap">
		<a class="hub-back" href={homeHref}>{tr.back}</a>
	</p>
</div>

<style>
	.hub {
		max-width: var(--games-max);
		margin: 0 auto;
		padding: clamp(2.5rem, 6vw, 4.5rem) var(--games-pad) clamp(2.5rem, 6vw, 4rem);
	}
	.hub-kicker {
		margin: 0;
		font-size: 0.625rem;
		letter-spacing: 0.18em;
		color: var(--games-faint);
		font-weight: 600;
		text-transform: uppercase;
	}
	.hub-title-row {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 18px;
	}
	.hub-dot {
		display: inline-block;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: var(--games-accent);
		flex-shrink: 0;
	}
	.hub-title {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.14;
		color: var(--games-accent);
	}
	.hub-lead {
		margin: 16px 0 0;
		color: var(--games-muted);
		font-size: 1.0625rem;
		max-width: 52ch;
		line-height: 1.56;
	}
	.hub-panel {
		position: relative;
		margin-top: clamp(2rem, 5vw, 3.25rem);
		margin-bottom: clamp(2rem, 5vw, 3rem);
		background: var(--games-panel);
		border: 1px solid var(--games-border);
	}
	.hub-panel-rule {
		height: 3px;
		background: var(--games-accent);
	}
	.hub-grid-head {
		padding: 16px var(--games-pad) 0;
		display: flex;
		justify-content: flex-end;
	}
	.hub-grid-count {
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		color: var(--games-faint);
		font-weight: 600;
		text-transform: uppercase;
	}
	.hub-grid {
		display: grid;
		gap: clamp(10px, 2.5vw, 18px);
		padding: 16px var(--games-pad) var(--games-pad);
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
	}
	/* One game: use panel width with a horizontal card on wider viewports */
	.hub-grid-single {
		grid-template-columns: 1fr;
	}
	@media (min-width: 34rem) {
		.hub-grid-single :global(.tile) {
			flex-direction: row;
			align-items: stretch;
		}
		.hub-grid-single :global(.thumb) {
			flex: 0 0 clamp(10rem, 34vw, 15.5rem);
			width: clamp(10rem, 34vw, 15.5rem);
			aspect-ratio: 1;
			align-self: center;
			border-bottom: none;
			border-right: 1px solid var(--games-border);
		}
		.hub-grid-single :global(.tile-body) {
			justify-content: center;
			padding: clamp(14px, 3vw, 22px) clamp(16px, 3vw, 24px);
		}
		.hub-grid-single :global(.tile-desc) {
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}
	}
	.hub-back-wrap {
		margin: 0;
		text-align: center;
	}
	.hub-back {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--games-ink);
		text-decoration: none;
	}
	.hub-back:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
</style>
