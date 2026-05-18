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
	const metaDesc = $derived(
		card.noteLink ? card.note.replace('{{linkText}}', card.noteLink.text) : card.note
	);

	const NOTE_LINK_PLACEHOLDER = '{{linkText}}';
	const noteParts = $derived.by(() => {
		if (!card.noteLink) return null;
		const [before, after = ''] = card.note.split(NOTE_LINK_PLACEHOLDER);
		return { before, after };
	});
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
		{#if noteParts && card.noteLink}
			{@const noteHref = localizedHref(locale, `/experience/${card.noteLink.slug}`)}
			<p class="xp-note">{noteParts.before}<a class="xp-note-link" href={noteHref}
					>{card.noteLink.text}</a
				>{noteParts.after}</p>
		{:else}
			<p class="xp-note">{card.note}</p>
		{/if}
		{#if card.detail?.length}
			{#each card.detail as block}
				{#if block.heading}
					<h2 class="xp-detail-heading">{block.heading}</h2>
				{/if}
				<p class="xp-detail">{block.body}</p>
			{/each}
		{/if}

		{#if card.figures?.length}
			<section class="xp-gallery" aria-labelledby="xp-gallery-h">
				<h2 id="xp-gallery-h" class="xp-gallery-heading">
					{card.figuresHeading ?? tr.experience.figuresHeading}
				</h2>
				<div class="xp-gallery-grid">
					{#each card.figures as fig}
						<figure class="xp-figure">
							<div class="xp-figure-frame">
								<img
									class="xp-figure-img"
									src={`${base}/${fig.src}`}
									alt={fig.alt}
									loading="lazy"
									decoding="async"
								/>
							</div>
							{#if fig.caption}
								<figcaption class="xp-figcaption">{fig.caption}</figcaption>
							{/if}
						</figure>
					{/each}
				</div>
			</section>
		{/if}

		{#if card.clients?.length}
			<section class="xp-clients" aria-labelledby="xp-clients-h">
				<h2 id="xp-clients-h" class="xp-gallery-heading">{tr.experience.clients}</h2>
				<ul class="xp-clients-grid">
					{#each card.clients as client}
						<li class="xp-client">
							<div class="xp-client-logo-wrap">
								<img
									class="xp-client-logo"
									src={`${base}/${client.logoSrc}`}
									alt={client.logoAlt}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<p class="xp-client-name">{client.name}</p>
							{#if client.note}
								<p class="xp-client-note">{client.note}</p>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/if}
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
		max-width: min(84ch, 100%);
	}
	.xp-note {
		margin: 0;
		line-height: 1.55;
		color: color-mix(in srgb, var(--muted) 40%, var(--ink));
	}
	.xp-detail {
		margin: 1rem 0 0;
		line-height: 1.55;
		color: color-mix(in srgb, var(--muted) 40%, var(--ink));
	}
	.xp-detail-heading {
		margin: 1.6rem 0 0.35rem;
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.3;
		letter-spacing: -0.01em;
	}
	.xp-detail-heading + .xp-detail {
		margin-top: 0;
	}

	.xp-gallery {
		margin-top: 2rem;
		padding-top: 1.75rem;
		border-top: 1px solid var(--border);
	}
	.xp-gallery-heading {
		margin: 0 0 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--muted) 50%, var(--ink));
	}
	.xp-gallery-grid {
		display: grid;
		gap: 1.35rem;
	}
	@media (min-width: 48rem) {
		.xp-gallery-grid {
			gap: 1.5rem;
		}
	}
	.xp-figure {
		margin: 0;
	}
	.xp-figure-frame {
		background: var(--elevated);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.5rem;
		box-sizing: border-box;
	}
	.xp-figure-img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 4px;
		border: 1px solid var(--border);
	}
	.xp-figcaption {
		margin-top: 0.5rem;
		font-size: 0.88rem;
		line-height: 1.45;
		color: color-mix(in srgb, var(--muted) 45%, var(--ink));
	}

	.xp-clients {
		margin-top: 2rem;
		padding-top: 1.75rem;
		border-top: 1px solid var(--border);
	}
	.xp-clients-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	@media (min-width: 38rem) {
		.xp-clients-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 1.1rem;
		}
	}
	.xp-client {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		margin: 0;
	}
	.xp-client-logo-wrap {
		aspect-ratio: 1;
		width: 100%;
		box-sizing: border-box;
		background: var(--surface);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.xp-client-logo {
		display: block;
		max-width: 100%;
		max-height: 80%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
	.xp-client-name {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.3;
	}
	.xp-client-note {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: color-mix(in srgb, var(--muted) 45%, var(--ink));
	}
</style>