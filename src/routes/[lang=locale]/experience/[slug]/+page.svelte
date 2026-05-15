<script lang="ts">
	import { base } from '$app/paths';
	import type { Locale } from '$lib/i18n/locales';
	import { localizedHref } from '$lib/i18n/paths';
	import { t } from '$lib/i18n/copy';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const locale = $derived(data.locale as Locale);
	const card = $derived(data.card);
	const tr = $derived(t(locale));

	const metaTitle = $derived(`${card.title} · Albert Sylvester`);
	const metaDesc = $derived(card.context);
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<article class="xp animate-in" aria-labelledby="xp-h">
	<p class="back">
		<a href={localizedHref(locale, '')}>{tr.experience.back}</a>
	</p>

	<header class="xp-head">
		<div class="xp-thumb-wrap">
			<div class="xp-thumb-surface">
				<img
					class="xp-thumb"
					src={`${base}/${card.thumbSrc}`}
					width="320"
					height="320"
					loading="eager"
					decoding="async"
					alt={card.thumbAlt}
				/>
			</div>
		</div>
		<div class="xp-head-copy">
			<h1 id="xp-h">{card.title}</h1>
			<p class="xp-context">{card.context}</p>
		</div>
	</header>

	<div class="xp-body">
		<p class="xp-note">{card.note}</p>
	</div>
</article>

<style>
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-in {
		animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		opacity: 0;
	}

	.back {
		margin: 0 0 1.25rem;
		font-size: 0.9rem;
	}
	.back a {
		color: var(--muted);
		text-decoration: none;
		border-bottom: 1px solid var(--border-strong);
	}
	.back a:hover {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}

	.xp-head {
		display: grid;
		gap: clamp(1rem, 2.5vw, 1.5rem);
		align-items: start;
		margin-bottom: 1.5rem;
	}
	@media (min-width: 40rem) {
		.xp-head {
			grid-template-columns: minmax(10rem, 13rem) minmax(0, 1fr);
			align-items: center;
		}
	}

	.xp-thumb-wrap {
		aspect-ratio: 1;
		width: 100%;
		max-width: 13rem;
		box-sizing: border-box;
		padding: 0.65rem;
		background: var(--elevated);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.xp-thumb-surface {
		width: 100%;
		aspect-ratio: 1;
		box-sizing: border-box;
		background: var(--surface);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.65rem;
	}
	.xp-thumb {
		display: block;
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.xp-head-copy h1 {
		margin-bottom: 0.45rem;
	}
	.xp-context {
		margin: 0;
		font-weight: 600;
		font-size: 0.92rem;
		color: color-mix(in srgb, var(--muted) 55%, var(--ink));
	}

	.xp-body {
		max-width: var(--measure);
	}
	.xp-note {
		margin: 0;
		line-height: 1.55;
		color: color-mix(in srgb, var(--muted) 40%, var(--ink));
	}
</style>
