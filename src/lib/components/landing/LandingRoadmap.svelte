<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		items,
		class: className = ''
	}: {
		// icon é um Snippet (ex. `icon: () => <Icon class="..." />`). Não usar
		// Component direto: não há como distinguir snippet de componente em
		// runtime no Svelte 5 (quebraria no SSR).
		items: Array<{ icon: Snippet; label: string }>;
		class?: string;
	} = $props();
</script>

<div class="twui-landing-roadmap {className}">
	{#each items as item (item.label)}
		<span class="twui-landing-roadmap-item">
			{@render item.icon()}
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
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}
</style>
