<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		title,
		description,
		class: className = ''
	}: {
		children?: Snippet;
		title?: Snippet;
		description?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-card-header {className}">
	{#if title || description}
		<div class="twui-card-header-main">
			{#if title}{@render title()}{/if}
			{#if description}{@render description()}{/if}
		</div>
		{#if children}
			<div class="twui-card-header-side">
				{@render children()}
			</div>
		{/if}
	{:else if children}
		{@render children()}
	{/if}
</div>

<style>
	.twui-card-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-card-header-main {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.twui-card-header-side {
		flex-shrink: 0;
	}
</style>
