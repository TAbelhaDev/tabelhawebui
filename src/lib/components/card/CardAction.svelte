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

<div class="twui-card-action {className}">
	{@render children()}
</div>

<style>
	.twui-card-action {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px;
	}
</style>
