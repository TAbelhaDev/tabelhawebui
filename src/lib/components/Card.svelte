<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		header,
		children,
		class: className = ''
	}: {
		title?: string;
		description?: string;
		header?: Snippet;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<section class="twui-card {className}">
	{#if title || description || header}
		<div class="twui-card-header">
			{#if header}
				{@render header()}
			{:else}
				{#if title}<h2 class="twui-card-title">{title}</h2>{/if}
				{#if description}<p class="twui-card-description">{description}</p>{/if}
			{/if}
		</div>
	{/if}
	<div class="twui-card-content">{@render children()}</div>
</section>

<style>
	.twui-card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-card-header {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-card-title {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
		margin: 0;
	}

	.twui-card-description {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
		margin: 0;
	}

	.twui-card-content {
		padding: 16px;
	}
</style>
