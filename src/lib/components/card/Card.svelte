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

<section class="twui-card {className}">
	{@render children()}
</section>

<style>
	.twui-card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}
</style>
