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
		padding: 16px;
	}
</style>
