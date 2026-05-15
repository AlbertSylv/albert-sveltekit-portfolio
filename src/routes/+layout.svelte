<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="96x96" href={`${base}/favicon.png`} />
</svelte:head>

{@render children()}
