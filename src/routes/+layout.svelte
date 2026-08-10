<script lang="ts">
	import '$lib/theme/theme.css';

	// The library ships as a package (build = svelte-package), so these routes
	// never reach npm. They exist so `bun run dev` gives a place to look at
	// every component in both themes.
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		background: var(--twui-paper);
		color: var(--twui-ink);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
	}
</style>
