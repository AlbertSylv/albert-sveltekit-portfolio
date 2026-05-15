<script lang="ts">
	import type { Locale } from '$lib/i18n/locales';
	import { t } from '$lib/i18n/copy';
	import { SITE_ORIGIN } from '$lib/site';

	let { locale }: { locale: Locale } = $props();

	const tr = $derived(t(locale));
	const year = new Date().getFullYear();
</script>

<footer class="foot">
	<div class="foot-inner">
		<p class="foot-line">
			<span class="foot-name">Albert Sylvester</span>
			<span class="foot-dot">·</span>
			<span>{year}</span>
		</p>
		<p class="foot-availability">{tr.footer.availability}</p>
		<p class="foot-meta">{SITE_ORIGIN.replace('https://', '')}</p>
	</div>
</footer>

<style>
	.foot {
		margin-top: 3.5rem;
		padding: calc(var(--space) * 1.75) var(--space);
		border-top: 1px solid var(--border);
		background: var(--surface);
	}
	.foot-inner {
		max-width: 72rem;
		margin: 0 auto;
		text-align: center;
		font-size: 0.88rem;
		color: var(--ink-muted);
	}
	.foot-line {
		margin-bottom: 0.35rem;
		color: var(--ink-muted);
	}
	.foot-name {
		font-family: var(--font-display);
		font-weight: 600;
		color: var(--ink);
	}
	.foot-dot {
		margin: 0 0.35rem;
		opacity: 0.35;
	}
	.foot-availability {
		margin: 0 0 0.6rem;
		color: var(--muted);
	}
	.foot-meta {
		font-size: 0.76rem;
		opacity: 0.6;
		letter-spacing: 0.03em;
	}
</style>
