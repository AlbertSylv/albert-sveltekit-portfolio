<script lang="ts">
	let { driveId, title, comingSoon }: { driveId: string; title: string; comingSoon: string } =
		$props();
</script>

<div class="video">
	{#if driveId}
		<iframe
			class="video-frame"
			src={`https://drive.google.com/file/d/${driveId}/preview`}
			{title}
			allow="autoplay; fullscreen"
			allowfullscreen
			loading="lazy"
		></iframe>
	{:else}
		<div class="video-placeholder">
			<span>{comingSoon}</span>
		</div>
	{/if}
</div>

<style>
	.video {
		position: relative;
		aspect-ratio: 16 / 9;
		width: 100%;
		background: var(--ink);
		border: 1px solid var(--border);
		overflow: hidden;
	}
	.video-frame,
	.video-placeholder {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.video-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--elevated);
		color: var(--muted);
		font-size: 0.9rem;
		font-weight: 600;
	}
</style>
