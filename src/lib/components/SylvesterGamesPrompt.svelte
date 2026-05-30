<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { Locale } from '$lib/i18n/locales';
	import { setGamesUnlocked } from '$lib/games/unlock';

	let {
		open = false,
		locale,
		title,
		body,
		continueLabel,
		cancelLabel,
		onclose
	}: {
		open: boolean;
		locale: Locale;
		title: string;
		body: string;
		continueLabel: string;
		cancelLabel: string;
		onclose: () => void;
	} = $props();

	let dialogEl: HTMLDialogElement | undefined;
	const gamesPath = `${base}/sylvester-games`;

	$effect(() => {
		if (!browser || !dialogEl) return;
		if (open && !dialogEl.open) dialogEl.showModal();
		if (!open && dialogEl.open) dialogEl.close();
	});

	function close() {
		onclose();
	}

	function onContinue() {
		setGamesUnlocked(locale);
		close();
		goto(gamesPath);
	}

	function onDialogClose() {
		close();
	}
</script>

<dialog
	class="games-prompt"
	bind:this={dialogEl}
	onclose={onDialogClose}
	onclick={(e) => {
		if (e.target === dialogEl) close();
	}}
	aria-labelledby="games-prompt-title"
	aria-describedby="games-prompt-body"
>
	<div class="games-prompt-panel games-prompt-theme">
		<div class="games-prompt-rule" aria-hidden="true"></div>
		<div class="games-prompt-pad">
			<div class="games-prompt-title-row">
				<span class="games-prompt-dot" aria-hidden="true"></span>
				<h2 id="games-prompt-title" class="games-prompt-title">{title}</h2>
			</div>
			<p id="games-prompt-body" class="games-prompt-body">{body}</p>
			<div class="games-prompt-actions">
				<button type="button" class="btn btn-ghost" onclick={close}>
					{cancelLabel}
				</button>
				<button type="button" class="btn btn-accent" onclick={onContinue}>
					{continueLabel}
				</button>
			</div>
		</div>
	</div>
</dialog>

<style>
	.games-prompt-theme {
		--games-surface-card: #fcf8ec;
		--games-border-strong: #cdbe92;
		--games-ink: #4a2410;
		--games-muted: #7e5c40;
		--games-backdrop: rgb(54 33 16 / 0.3);
		--games-accent: #e15600;
		--games-accent-btn: #c24a00;
		--games-accent-btn-hover: #a33e00;
		--games-accent-btn-text: #fff6eb;
		--games-shadow-lg: 0 22px 50px rgb(74 45 18 / 0.2);
	}

	.games-prompt {
		margin: auto;
		padding: 0;
		border: none;
		background: transparent;
		max-width: min(440px, calc(100vw - 2.5rem));
	}
	.games-prompt::backdrop {
		background: var(--games-backdrop, rgb(54 33 16 / 0.3));
	}
	.games-prompt-panel {
		background: var(--games-surface-card, var(--surface));
		border: 1px solid var(--games-border-strong, var(--border-strong));
		box-shadow: var(--games-shadow-lg, 0 22px 50px rgb(74 45 18 / 0.2));
	}
	.games-prompt-rule {
		height: 3px;
		background: var(--games-accent, var(--ink));
	}
	.games-prompt-pad {
		padding: 26px 26px 24px;
	}
	.games-prompt-title-row {
		display: flex;
		align-items: center;
		gap: 11px;
	}
	.games-prompt-dot {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: var(--games-accent, var(--ink));
		flex-shrink: 0;
	}
	.games-prompt-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--games-ink, var(--ink));
	}
	.games-prompt-body {
		margin: 14px 0 0;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--games-muted, var(--muted));
	}
	.games-prompt-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 24px;
		flex-wrap: wrap;
	}
	.btn {
		font: inherit;
		font-size: 0.90625rem;
		font-weight: 600;
		padding: 12px 18px;
		min-height: 46px;
		border-radius: 2px;
		cursor: pointer;
		white-space: nowrap;
		-webkit-tap-highlight-color: transparent;
		transition:
			background 120ms ease,
			border-color 120ms ease;
	}
	.btn-ghost {
		background: transparent;
		color: var(--games-ink, var(--ink));
		border: 1px solid var(--games-border-strong, var(--border-strong));
	}
	.btn-ghost:hover {
		border-color: var(--games-ink, var(--ink));
	}
	.btn-accent {
		padding-inline: 20px;
		background: var(--games-accent-btn, var(--ink));
		color: var(--games-accent-btn-text, var(--surface));
		border: 1px solid var(--games-accent-btn, var(--ink));
	}
	.btn-accent:hover {
		background: var(--games-accent-btn-hover, var(--ink));
		border-color: var(--games-accent-btn-hover, var(--ink));
	}
	.btn:focus-visible {
		outline: 2px solid var(--games-border-strong, var(--border-strong));
		outline-offset: 3px;
	}
</style>
