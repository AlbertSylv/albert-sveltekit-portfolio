<script lang="ts">
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { defaultLocale, type Locale } from '$lib/i18n/locales';
	import { SITE_ORIGIN } from '$lib/site';
	import { localizedHref, pathAfterLocale } from '$lib/i18n/paths';
	import { page } from '$app/state';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const locale = $derived(data.locale as Locale);
	const pathSuffix = $derived(pathAfterLocale(page.url.pathname));

	const canonical = $derived(SITE_ORIGIN + page.url.pathname);
	const hrefDa = $derived(SITE_ORIGIN + localizedHref('da', pathSuffix));
	const hrefEn = $derived(SITE_ORIGIN + localizedHref('en', pathSuffix));
	const hrefDefault = $derived(SITE_ORIGIN + localizedHref(defaultLocale, pathSuffix));
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang="da" href={hrefDa} />
	<link rel="alternate" hreflang="en" href={hrefEn} />
	<link rel="alternate" hreflang="x-default" href={hrefDefault} />
</svelte:head>

<div class="page-wrap">
	<SiteHeader locale={locale} />
	<main id="main" class="main">
		{@render children()}
	</main>
	<SiteFooter locale={locale} />
</div>

<style>
	.page-wrap {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.main {
		flex: 1;
		width: 100%;
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 var(--space) calc(var(--space) * 2);
		padding-top: calc(var(--space) * 2);
	}
</style>
