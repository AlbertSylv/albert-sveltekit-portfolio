<script lang="ts">
	import { getGamesLocale } from '$lib/games/unlock';
	import { t } from '$lib/i18n/copy';
	import InSyncGame from '$lib/components/games/insync/InSyncGame.svelte';

	const gamesLocale = $derived(getGamesLocale());
	const tr = $derived(t(gamesLocale).games.insync);
</script>

<svelte:head>
	<title>{tr.metaTitle} · Sylvester Games</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<InSyncGame locale={gamesLocale} />
