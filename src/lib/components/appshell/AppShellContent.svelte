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

<main class="twui-appshell-content {className}">
	{@render children()}
</main>

<style>
	.twui-appshell-content {
		margin-inline: auto;
		width: 100%;
		max-width: 72rem;
		flex: 1;
		padding: 1rem 1rem 6rem;
	}

	@media (min-width: 1024px) {
		.twui-appshell-content {
			padding: 2rem;
		}
	}
</style>
