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

<div class="twui-card-content {className}">
	{@render children()}
</div>

<style>
	.twui-card-content {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		padding: 16px;
		min-height: 0;
	}
</style>
