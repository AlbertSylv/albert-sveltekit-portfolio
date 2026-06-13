<script lang="ts">
	let {
		leftLabel,
		rightLabel,
		categoryLabel
	}: {
		leftLabel: string;
		rightLabel: string;
		categoryLabel: string;
	} = $props();
</script>

<div class="spectrum-card">
	<p class="category">{categoryLabel}</p>
	<div class="ends">
		<span class="end">{leftLabel}</span>
		<span class="sep" aria-hidden="true">↔</span>
		<span class="end">{rightLabel}</span>
	</div>
</div>

<style>
	.spectrum-card {
		width: 100%;
		text-align: center;
		flex-shrink: 1;
		min-height: 0;
	}
	.category {
		margin: 0 0 0.5rem;
		font-size: 0.5625rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--games-faint);
	}
	.ends {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.35rem 0.6rem;
		width: 100%;
	}
	.end {
		font-size: clamp(0.75rem, 2.8dvh + 0.5rem, 1.2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.2;
		text-align: center;
		text-wrap: balance;
		color: var(--games-accent);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}
	.sep {
		font-size: clamp(1.5rem, 5dvh, 2.25rem);
		font-weight: 700;
		color: var(--games-ink);
		line-height: 1;
	}
</style>
