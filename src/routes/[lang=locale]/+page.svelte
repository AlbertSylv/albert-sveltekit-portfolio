<script lang="ts">
	import { base } from '$app/paths';
	import type { Locale } from '$lib/i18n/locales';
	import { t } from '$lib/i18n/copy';
	import { localizedHref } from '$lib/i18n/paths';
	import { SITE_ORIGIN } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const locale = $derived(data.locale as Locale);
	const tr = $derived(t(locale));

	const MAIL = 'mailto:albertsylvester@outlook.dk';
	const LI = 'https://www.linkedin.com/in/albert-sylvester-l/';
	const ogImg = $derived(`${SITE_ORIGIN}${base}/${tr.hero.portraitSrc}`);

	const NOTE_LINK_PLACEHOLDER = '{{linkText}}';
</script>

<svelte:head>
	<title>{tr.meta.title}</title>
	<meta name="description" content={tr.meta.description} />
	<meta property="og:title" content={tr.meta.title} />
	<meta property="og:description" content={tr.meta.description} />
	<meta property="og:image" content={ogImg} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="hero animate-in" aria-labelledby="hero-h">
	<div class="hero-grid">
		<div class="hero-copy">
			<p class="kicker">{tr.hero.kicker}</p>
			<h1 id="hero-h">{tr.hero.headline}</h1>
			<p class="lead">{tr.hero.lead}</p>
			<div class="hero-actions">
				<a class="btn btn-solid" href={`${localizedHref(locale, '')}#work`}>{tr.hero.ctaWork}</a>
				<a class="btn btn-ghost" href="#contact">{tr.hero.ctaContact}</a>
			</div>
		</div>
		<figure class="hero-figure">
			<img
				class="hero-img"
				src={`${base}/${tr.hero.portraitSrc}`}
				width="820"
				height="1024"
				loading="eager"
				decoding="async"
				fetchpriority="high"
				alt={tr.hero.portraitAlt}
			/>
		</figure>
	</div>
</section>

<section class="panel contribution animate-in stagger-1" aria-labelledby="contrib-h">
	<h2 id="contrib-h" class="contrib-title">
		<span>{tr.contribution.title}</span>
		<svg class="contrib-diamond" viewBox="0 0 40 20" width="40" height="20" aria-hidden="true">
			<path
				d="M0 10 10 0 20 10 10 20Z"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
			<path
				d="M20 10 30 0 40 10 30 20Z"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
		</svg>
	</h2>
	<ol class="contrib-steps">
		{#each tr.contribution.bullets as item}
			<li class="contrib-step">
				<h3 class="contrib-heading">{item.heading}</h3>
				<p class="contrib-body">{item.body}</p>
			</li>
		{/each}
	</ol>
</section>

<section id="work" class="work animate-in stagger-2" aria-labelledby="work-h">
	<div class="work-head">
		<h2 id="work-h">{tr.work.title}</h2>
	</div>
	<div class="card-grid">
		{#each tr.work.cards as card}
			<a
				class="card"
				href={localizedHref(locale, `/experience/${card.slug}`)}
				data-slug={card.slug}
				data-sveltekit-preload-data="hover"
			>
				<div class="card-thumb-wrap">
					<div class="card-thumb-surface">
						<img
							class="card-thumb"
							src={`${base}/${card.thumbSrc}`}
							width="560"
							height="340"
							loading="lazy"
							decoding="async"
							alt={card.thumbAlt}
						/>
					</div>
				</div>
				<h3>{card.title}</h3>
				<p class="card-context">{card.context}</p>
				<p class="card-note">
					{#if card.noteLink}
						{@const [before, after = ''] = card.note.split(NOTE_LINK_PLACEHOLDER)}
						{before}{card.noteLink.text}{after}
					{:else}
						{card.note}
					{/if}
				</p>
				<span class="card-cta" aria-hidden="true">
					{locale === 'da' ? 'Læs case' : 'Read case'}
					<svg class="card-cta-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path
							d="M3 7h8m-3-3 3 3-3 3"
							stroke="currentColor"
							stroke-width="1.4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</a>
		{/each}
	</div>
</section>

<section id="contact" class="panel contact animate-in stagger-3" aria-labelledby="contact-h">
	<h2 id="contact-h">{tr.contact.title}</h2>
	<p class="contact-lead">{tr.contact.lead}</p>
	<div class="contact-row">
		<a class="btn btn-solid" href={MAIL}>{tr.contact.email}</a>
		<a class="btn btn-ghost" href={LI} target="_blank" rel="noopener noreferrer">{tr.contact.linkedin}</a>
	</div>
</section>

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
	.stagger-1 {
		animation-delay: 0.06s;
	}
	.stagger-2 {
		animation-delay: 0.11s;
	}
	.stagger-3 {
		animation-delay: 0.16s;
	}

	.hero {
		margin-bottom: clamp(2rem, 4vw, 2.75rem);
	}
	.hero-grid {
		display: grid;
		gap: clamp(1.5rem, 3.5vw, 2.5rem);
		align-items: start;
		grid-template-columns: 1fr;
	}
	@media (min-width: 48rem) {
		.hero-grid {
			grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.92fr);
			align-items: center;
		}
	}

	.hero .kicker {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.62rem;
		font-weight: 600;
		color: var(--muted);
		margin-bottom: 0.75rem;
	}
	.hero .lead {
		max-width: 38rem;
		font-size: 1.02rem;
		line-height: 1.58;
		color: var(--muted);
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 1.25rem;
	}

	.hero-figure {
		margin: 0 auto;
		padding: 0.6rem;
		border: 1px solid var(--border);
		background: var(--elevated);
		max-width: 24rem;
		box-sizing: border-box;
	}
	@media (min-width: 48rem) {
		.hero-figure {
			margin-inline: 0;
			justify-self: end;
			max-width: min(100%, 25rem);
		}
	}
	.hero-img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--border);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		border-radius: 2px;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		border: 1px solid var(--border);
		transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
	}
	.btn-solid {
		background: var(--ink);
		color: var(--surface);
		border-color: var(--ink);
	}
	.btn-solid:hover {
		background: transparent;
		color: var(--ink);
		border-color: var(--ink);
	}
	.btn-ghost {
		background: transparent;
		border-color: var(--border-strong);
		color: var(--ink);
	}
	.btn-ghost:hover {
		border-color: var(--ink);
		color: var(--ink);
	}

	.panel {
		background: var(--elevated);
		padding: clamp(1.25rem, 2vw, 1.75rem);
		border-radius: 0;
		border: 1px solid var(--border);
		margin-bottom: 2rem;
	}
	.contrib-title {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0 0 1.35rem;
		color: var(--ink);
	}
	.contrib-diamond {
		display: block;
		flex-shrink: 0;
		width: 2.35rem;
		height: auto;
		color: var(--ink);
	}
	.contrib-steps {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 1.35rem;
	}
	.contrib-step {
		margin: 0;
		padding: 0;
	}
	.contrib-heading {
		margin: 0 0 0.4rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.3;
		letter-spacing: -0.005em;
	}
	.contrib-body {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.55;
		color: color-mix(in srgb, var(--ink) 80%, var(--muted));
	}
	@media (min-width: 48rem) {
		.contrib-steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0 2rem;
			align-items: start;
		}
		.contrib-step:not(:first-child) {
			border-left: 1px solid var(--border-strong);
			padding-left: 2rem;
		}
	}

	.work {
		margin-bottom: clamp(2.75rem, 5vw, 4rem);
	}
	.work-head {
		margin-bottom: 1.25rem;
	}
	.work-head h2 {
		color: var(--ink);
		margin-bottom: 0;
	}
	.card-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
		align-items: stretch;
	}
	@media (min-width: 52rem) {
		.card-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	.card {
		position: relative;
		height: 100%;
		min-height: 0;
		padding: 0 0 1rem;
		background: var(--surface);
		border-radius: 0;
		border: 1px solid var(--border);
		transition:
			border-color 0.15s ease,
			transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 0.18s ease;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
	}
	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgb(0 0 0 / 0.06);
	}
	.card:hover .card-cta {
		color: var(--ink);
	}
	.card:hover .card-cta-arrow {
		transform: translateX(2px);
	}
	.card-thumb-wrap {
		flex-shrink: 0;
		aspect-ratio: 1;
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem;
		background: var(--elevated);
		border-bottom: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card-thumb-surface {
		width: 100%;
		max-width: 100%;
		aspect-ratio: 1;
		box-sizing: border-box;
		background: var(--surface);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.card-thumb {
		display: block;
		width: auto;
		height: auto;
		object-fit: contain;
	}
	/* Optical balance: same padding, tuned scale per logo shape */
	.card[data-slug='bmf-systems'] .card-thumb {
		max-width: 60%;
		max-height: 60%;
	}
	.card[data-slug='cph-cloud'] .card-thumb {
		max-width: 70%;
		max-height: 70%;
	}
	.card[data-slug='fauna-photonics'] .card-thumb {
		max-width: 78%;
		max-height: 56%;
	}
	.card h3 {
		padding: 0.75rem 1rem 0.15rem;
		margin: 0;
		font-size: 1.05rem;
	}
	.card-context {
		font-weight: 600;
		color: var(--ink);
		font-size: 0.84rem;
		margin: 0 1rem 0.35rem;
	}
	.card-note {
		font-size: 0.86rem;
		margin: 0 1rem 0;
		flex: 1;
		line-height: 1.45;
		color: color-mix(in srgb, var(--muted) 40%, var(--ink));
	}
	.card-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
		margin: auto 1rem 0;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--muted);
		transition: color 0.15s ease;
	}
	.card-cta-arrow {
		display: block;
		transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.contact-lead {
		margin-bottom: 0.75rem;
		max-width: 28rem;
	}
	.contact .contact-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 0.35rem;
	}
</style>
