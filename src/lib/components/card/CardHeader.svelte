<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = ''
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-card-header {className}">
	{@render children()}
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
</style>
