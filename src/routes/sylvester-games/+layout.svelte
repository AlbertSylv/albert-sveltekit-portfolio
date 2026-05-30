<script lang="ts">
	import '$lib/games/theme.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { defaultLocale, type Locale } from '$lib/i18n/locales';
	import { localizedHref } from '$lib/i18n/paths';
	import { getGamesLocale, isGamesUnlocked } from '$lib/games/unlock';

	let { children } = $props();

	let locale = $state<Locale>(defaultLocale);
	let allowed = $state(false);
	const homeHref = $derived(localizedHref(locale, ''));
	const immersive = $derived(
		page.url.pathname.includes('/finger-pick') || page.url.pathname.includes('/insync')
	);

	$effect(() => {
		if (!browser) return;
		locale = getGamesLocale();
		if (!isGamesUnlocked()) {
			goto(homeHref, { replaceState: true });
			return;
		}
		allowed = true;
	});
</script>

{#if allowed}
	<div class="games-shell" class:games-shell-immersive={immersive}>
		{#if immersive}
			{@render children()}
		{:else}
			<SiteHeader {locale} />
			<main id="main" class="games-main">
				{@render children()}
			</main>
			<SiteFooter {locale} />
		{/if}
	</div>
{/if}

<style>
	.games-shell :global(.masthead) {
		background: var(--games-bg);
		border-bottom-color: var(--games-border);
	}
	.games-shell :global(.wordmark) {
		color: var(--games-accent);
	}
	.games-shell :global(.wordmark-dot) {
		background: var(--games-accent);
	}
	.games-shell :global(.nav-exp-list) {
		background: var(--games-surface-card);
		border-color: var(--games-border-strong);
		box-shadow: var(--games-shadow);
	}
	.games-shell :global(.nav-exp-sublink:hover),
	.games-shell :global(.nav-exp-sublink:focus-visible) {
		background: var(--games-panel);
	}
	.games-shell :global(.lang) {
		background: var(--games-panel);
		border-color: var(--games-border);
	}
	.games-shell :global(.foot) {
		margin-top: auto;
		background: var(--games-bg);
		border-top-color: var(--games-border);
	}
	.games-main {
		flex: 1;
		width: 100%;
	}
	.games-shell-immersive {
		min-height: 100dvh;
		height: 100dvh;
		overflow: hidden;
	}
</style>
