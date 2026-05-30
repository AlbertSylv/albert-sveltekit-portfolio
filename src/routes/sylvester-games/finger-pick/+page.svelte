<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/copy';
	import { isMobilePlayDevice } from '$lib/games/device';
	import { getGamesLocale } from '$lib/games/unlock';
	import FingerPickGame from '$lib/components/games/finger-pick/FingerPickGame.svelte';

	const gamesLocale = $derived(getGamesLocale());
	const tr = $derived(t(gamesLocale).games.fingerPick);
	const hubHref = `${base}/sylvester-games`;

	let canPlay = $state(false);

	$effect(() => {
		if (!browser) return;
		if (!isMobilePlayDevice()) {
			goto(hubHref, { replaceState: true });
			return;
		}
		canPlay = true;
	});
</script>

<svelte:head>
	<title>{tr.metaTitle} · Sylvester Games</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if canPlay}
	<FingerPickGame locale={gamesLocale} />
{/if}
