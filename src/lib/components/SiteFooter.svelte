<script lang="ts">

	import { base } from '$app/paths';

	import type { Locale } from '$lib/i18n/locales';

	import { t } from '$lib/i18n/copy';

	import { SITE_ORIGIN } from '$lib/site';

	import SylvesterGamesPrompt from '$lib/components/SylvesterGamesPrompt.svelte';



	let { locale }: { locale: Locale } = $props();



	const tr = $derived(t(locale));

	const year = new Date().getFullYear();

	const cvHref = `${base}/Albert-Sylvester-CV.pdf`;



	const TAP_WINDOW_MS = 1200;

	let nameTaps = 0;

	let nameTapTimer: ReturnType<typeof setTimeout> | undefined;

	let gamesPromptOpen = $state(false);



	function onNameTap() {

		nameTaps += 1;

		clearTimeout(nameTapTimer);

		if (nameTaps >= 3) {

			nameTaps = 0;

			gamesPromptOpen = true;

			return;

		}

		nameTapTimer = setTimeout(() => {

			nameTaps = 0;

		}, TAP_WINDOW_MS);

	}

</script>



<footer class="foot">

	<div class="foot-inner">

		<p class="foot-line">

			<button type="button" class="foot-name" onclick={onNameTap}>

				{tr.footer.rights}

			</button>

			<span class="foot-dot">·</span>

			<span>{year}</span>

		</p>

		<p class="foot-availability">{tr.footer.availability}</p>

		<p class="foot-links">

			<a class="foot-link" href={cvHref} download="Albert-Sylvester-CV.pdf">{tr.footer.cvDownload}</a>

			<span class="foot-dot" aria-hidden="true">·</span>

			<span class="foot-meta">{SITE_ORIGIN.replace('https://', '')}</span>

		</p>

	</div>

</footer>



<SylvesterGamesPrompt

	open={gamesPromptOpen}

	{locale}

	title={tr.games.modalTitle}

	body={tr.games.modalBody}

	continueLabel={tr.games.modalContinue}

	cancelLabel={tr.games.modalCancel}

	onclose={() => (gamesPromptOpen = false)}

/>



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

		display: inline;

		padding: 0;

		margin: 0;

		border: none;

		background: none;

		font: inherit;

		font-family: var(--font-display);

		font-weight: 600;

		color: var(--ink);

		cursor: default;

		-webkit-tap-highlight-color: transparent;

	}

	.foot-name:hover,

	.foot-name:focus-visible {

		cursor: default;

	}

	.foot-name:focus-visible {

		outline: 2px solid var(--border-strong);

		outline-offset: 3px;

		border-radius: 2px;

	}

	.foot-dot {

		margin: 0 0.35rem;

		opacity: 0.35;

	}

	.foot-availability {

		margin: 0 0 0.6rem;

		color: var(--muted);

	}

	.foot-links {

		margin: 0;

		display: flex;

		flex-wrap: wrap;

		align-items: center;

		justify-content: center;

		gap: 0.35rem 0.5rem;

	}

	.foot-link {

		color: var(--ink-muted);

		text-decoration: none;

		border-bottom: 1px solid var(--border-strong);

	}

	.foot-link:hover {

		color: var(--ink);

		border-bottom-color: var(--ink);

	}

	.foot-meta {

		font-size: 0.76rem;

		opacity: 0.6;

		letter-spacing: 0.03em;

	}

</style>

