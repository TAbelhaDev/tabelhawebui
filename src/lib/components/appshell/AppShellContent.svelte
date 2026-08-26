<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		pad = true,
		class: className = ''
	}: {
		children: Snippet;
		/** When false, skip the built-in padding so a child `Page.Shell` owns spacing. */
		pad?: boolean;
		class?: string;
	} = $props();
</script>

<main class="twui-appshell-content {className}" class:twui-appshell-content-nopad={!pad}>
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

	.twui-appshell-content-nopad {
		padding: 0;
	}
</style>
