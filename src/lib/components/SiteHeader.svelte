<script lang="ts">
	import type { Locale } from '$lib/i18n/locales';
	import { pathAfterLocale, localizedHref } from '$lib/i18n/paths';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/copy';

	let { locale }: { locale: Locale } = $props();

	let wrap: HTMLDivElement | undefined;
	let dropdownOpen = $state(false);
	const menuId = 'nav-experience-menu';

	const pathname = $derived(page.url.pathname);
	const tr = $derived(t(locale));
	const suffix = $derived(pathAfterLocale(pathname));

	const homePath = $derived(localizedHref(locale, '').replace(/\/$/, ''));
	const curPath = $derived(pathname.replace(/\/$/, ''));
	const onHome = $derived(curPath === homePath);
	const onExperience = $derived(/\/experience\//.test(pathname));
	const experienceNavActive = $derived(onExperience);

	function subIsActive(slug: string) {
		const target = localizedHref(locale, `/experience/${slug}`).replace(/\/$/, '');
		return curPath === target;
	}

	function toggleExperienceMenu() {
		dropdownOpen = !dropdownOpen;
	}

	afterNavigate(() => {
		dropdownOpen = false;
	});

	$effect(() => {
		if (!browser || !dropdownOpen) return;
		function closeOnOutside(e: PointerEvent) {
			if (wrap && !wrap.contains(e.target as Node)) {
				dropdownOpen = false;
			}
		}
		function onEsc(e: KeyboardEvent) {
			if (e.key === 'Escape') dropdownOpen = false;
		}
		window.addEventListener('pointerdown', closeOnOutside, true);
		window.addEventListener('keydown', onEsc, true);
		return () => {
			window.removeEventListener('pointerdown', closeOnOutside, true);
			window.removeEventListener('keydown', onEsc, true);
		};
	});
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header class="masthead">
	<div class="masthead-inner">
		<div class="masthead-top">
			<a class="wordmark" href={localizedHref(locale, '')}>
				<span class="wordmark-dot" aria-hidden="true"></span>
				<span class="wordmark-text">Albert Sylvester</span>
			</a>
		</div>

		<nav class="nav" aria-label="Primary">
			<div class="nav-links">
				<a class="nav-link" class:nav-link-active={onHome} href={localizedHref(locale, '')}>{tr.nav.home}</a>

				<div class="nav-exp" bind:this={wrap}>
					<button
						type="button"
						class="nav-exp-hit"
						class:nav-exp-hit-active={experienceNavActive}
						class:nav-exp-hit-open={dropdownOpen}
						aria-expanded={dropdownOpen}
						aria-haspopup="true"
						aria-controls={menuId}
						onclick={toggleExperienceMenu}
					>
						<span class="nav-exp-label">{tr.nav.work}</span>
						<svg
							class="nav-exp-chevron"
							class:nav-exp-chevron-open={dropdownOpen}
							width="11"
							height="11"
							viewBox="0 0 12 12"
							aria-hidden="true"
							fill="none"
						>
							<path
								stroke="currentColor"
								stroke-width="1.35"
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.75 4.25 6 7.5 9.25 4.25"
							/>
						</svg>
					</button>

					{#if dropdownOpen}
						<ul class="nav-exp-list" role="list" id={menuId}>
							{#each tr.work.cards as card}
								<li>
									<a
										class="nav-exp-sublink"
										class:nav-exp-sublink-active={subIsActive(card.slug)}
										href={localizedHref(locale, `/experience/${card.slug}`)}
										data-sveltekit-preload-data="hover"
										onclick={() => (dropdownOpen = false)}
									>
										{card.menuLabel}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<a class="nav-link" href={`${localizedHref(locale, '')}#contact`}>{tr.nav.contact}</a>
			</div>

			<div class="nav-tail">
				<div class="nav-divider" aria-hidden="true"></div>
				<div class="lang" role="group" aria-label={tr.lang.label}>
					{#if locale === 'da'}
						<span class="lang-active" aria-current="true">DA</span>
						<a class="lang-muted" lang="en" href={localizedHref('en', suffix)}>EN</a>
					{:else}
						<a class="lang-muted" lang="da" href={localizedHref('da', suffix)}>DA</a>
						<span class="lang-active" aria-current="true">EN</span>
					{/if}
				</div>
			</div>
		</nav>
	</div>
</header>

<style>
	.skip-link {
		position: absolute;
		left: -999px;
		top: 0.75rem;
		padding: 0.5rem 1rem;
		background: var(--ink);
		color: var(--surface);
		border-radius: 2px;
		z-index: 10001;
	}
	.skip-link:focus {
		left: 0.75rem;
	}

	.masthead {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		overflow: visible;
	}
	.masthead-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: calc(var(--space) * 0.85) var(--space);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 1.75rem;
		overflow: visible;
	}
	.masthead-top {
		flex-shrink: 0;
	}

	@media (max-width: 47.99rem) {
		.masthead-inner {
			position: relative;
			flex-direction: column;
			align-items: stretch;
			gap: 0.65rem;
		}
		.masthead-top {
			width: 100%;
			padding-right: 4.75rem;
		}
		.wordmark-text {
			white-space: nowrap;
		}
		.nav {
			width: 100%;
		}
		.nav-links {
			width: 100%;
			--nav-item-gap: 0;
			justify-content: space-between;
			flex-wrap: nowrap;
			font-size: 0.875rem;
		}
		.nav-links > .nav-link {
			flex: 1 1 0;
			min-width: 0;
			display: block;
			text-align: center;
		}
		.nav-links > .nav-exp {
			flex: 1 1 0;
			min-width: 0;
			display: flex;
			justify-content: center;
		}
		.nav-tail {
			position: absolute;
			top: calc(var(--space) * 0.85);
			right: var(--space);
		}
		.nav-divider {
			display: none;
		}
	}
	.wordmark {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--ink);
		text-decoration: none;
		letter-spacing: -0.03em;
		line-height: 1.2;
	}
	.wordmark-dot {
		display: inline-block;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--ink);
		flex-shrink: 0;
	}
	.wordmark:hover .wordmark-text {
		text-decoration: underline;
		text-underline-offset: 0.22em;
		text-decoration-thickness: 1px;
	}

	/* --- Nav toolbar: evenly spaced links + separated language --- */
	.nav {
		--nav-item-gap: clamp(1.125rem, 2.8vw, 1.625rem);

		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 var(--nav-item-gap);
		font-size: 0.9375rem;
		line-height: 1.3;
		font-weight: 500;
		overflow: visible;
	}

	.nav-links {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: var(--nav-item-gap);
		row-gap: 0.35rem;
	}

	.nav-link {
		display: inline;
		color: var(--ink-muted);
		text-decoration: none;
		padding: 0.12rem 0 0.25rem;
		transition: color 0.12s ease;
		border-bottom: 1px solid transparent;
	}
	.nav-link:hover {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}
	.nav-link-active {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}

	.nav-exp {
		position: relative;
		display: inline-block;
		vertical-align: baseline;
	}
	.nav-exp-hit {
		display: inline-flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: baseline;
		gap: 0.04em;
		padding: 0.12rem 0 0.25rem;
		margin: 0;
		font: inherit;
		font-family: inherit;
		font-size: inherit;
		font-weight: 500;
		line-height: 1.25;
		color: var(--ink-muted);
		border: none;
		border-bottom: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		text-align: left;
		transition:
			color 0.12s ease,
			border-color 0.12s ease;
		-webkit-tap-highlight-color: transparent;
	}
	.nav-exp-hit:hover {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}
	.nav-exp-hit:focus-visible {
		outline: 2px solid var(--border-strong);
		outline-offset: 3px;
		border-radius: 2px;
	}
	.nav-exp-hit-active {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}
	.nav-exp-hit-open {
		color: var(--ink);
	}

	.nav-exp-label {
		flex-shrink: 0;
		line-height: 1.25;
		color: inherit;
		white-space: nowrap;
	}

	.nav-exp-chevron {
		display: block;
		flex-shrink: 0;
		width: 0.62em;
		height: 0.62em;
		transform: translateY(0.06em);
		transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.nav-exp-chevron-open {
		transform: translateY(0.06em) rotate(180deg);
	}

	.nav-exp-list {
		position: absolute;
		left: 0;
		top: calc(100% + 0.375rem);
		margin: 0;
		padding: 0.35rem 0;
		min-width: 13.5rem;
		list-style: none;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		box-shadow: 0 10px 26px rgb(0 0 0 / 0.07);
		z-index: 200;
	}
	.nav-exp-sublink {
		display: block;
		padding: 0.45rem 1rem;
		color: var(--muted);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
	}
	.nav-exp-sublink:hover,
	.nav-exp-sublink:focus-visible {
		background: var(--elevated);
		color: var(--ink);
	}
	.nav-exp-sublink-active {
		color: var(--ink);
		font-weight: 600;
		background: var(--elevated);
	}

	.nav-tail {
		display: inline-flex;
		align-items: center;
		column-gap: 0.75rem;
		flex-shrink: 0;
	}

	.nav-divider {
		width: 1px;
		height: 1.375rem;
		background: var(--border-strong);
		flex-shrink: 0;
	}

	.lang {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.42rem 0.65rem;
		border-radius: 4px;
		background: var(--elevated);
		border: 1px solid var(--border);
		font-size: 0.74rem;
		line-height: 1.25;
		letter-spacing: 0.04em;
		font-weight: 500;
	}
	.lang a {
		color: var(--muted);
		text-decoration: none;
	}
	.lang a:hover {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}
	.lang-active {
		color: var(--ink);
		font-weight: 600;
	}
	.lang-muted {
		opacity: 0.75;
	}
</style>
