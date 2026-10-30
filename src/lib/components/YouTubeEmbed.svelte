<script lang="ts">
	let {
		id,
		title,
		playLabel,
		comingSoon
	}: { id: string; title: string; playLabel: string; comingSoon: string } = $props();

	let playing = $state(false);
</script>

<div class="yt">
	{#if !id}
		<div class="yt-placeholder">
			<span>{comingSoon}</span>
		</div>
	{:else if playing}
		<iframe
			class="yt-frame"
			src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
			{title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	{:else}
		<button type="button" class="yt-facade" onclick={() => (playing = true)} aria-label={`${playLabel}: ${title}`}>
			<img
				class="yt-thumb"
				src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
				alt=""
				loading="lazy"
				decoding="async"
			/>
			<span class="yt-play" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
			</span>
		</button>
	{/if}
</div>

<style>
	.yt {
		position: relative;
		aspect-ratio: 16 / 9;
		width: 100%;
		background: var(--ink);
		border: 1px solid var(--border);
		overflow: hidden;
	}
	.yt-frame,
	.yt-facade,
	.yt-placeholder {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.yt-facade {
		padding: 0;
		cursor: pointer;
		background: var(--ink);
	}
	.yt-thumb {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.15s ease;
	}
	.yt-facade:hover .yt-thumb {
		opacity: 0.85;
	}
	.yt-play {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		background: var(--surface);
		color: var(--ink);
		box-shadow: 0 6px 18px rgb(0 0 0 / 0.25);
		transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.yt-facade:hover .yt-play,
	.yt-facade:focus-visible .yt-play {
		transform: translate(-50%, -50%) scale(1.06);
	}
	.yt-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--elevated);
		color: var(--muted);
		font-size: 0.9rem;
		font-weight: 600;
	}
</style>
