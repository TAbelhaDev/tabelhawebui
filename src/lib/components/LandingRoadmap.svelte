<script lang="ts">
	import type { Snippet, Component } from 'svelte';

	let {
		items,
		class: className = ''
	}: {
		items: Array<{ icon: Component<{ class?: string }> | Snippet; label: string }>;
		class?: string;
	} = $props();
</script>

<div class="twui-landing-roadmap {className}">
	{#each items as item (item.label)}
		<span class="twui-landing-roadmap-item">
			{#if typeof item.icon === 'function'}
				{@const icon = item.icon as Snippet}
				{@render icon()}
			{:else}
				{@const Icon = item.icon as Component<{ class?: string }>}
				<Icon class="twui-landing-roadmap-icon" />
			{/if}
			{item.label}
		</span>
	{/each}
</div>

<style>
	.twui-landing-roadmap {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.twui-landing-roadmap-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border: 1px solid var(--twui-rule);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-landing-roadmap-icon {
		width: 14px;
		height: 14px;
		color: var(--twui-accent);
	}
</style>
