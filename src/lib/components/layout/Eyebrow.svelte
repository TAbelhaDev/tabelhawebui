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

<span class="twui-eyebrow {className}">
	{@render children()}
</span>

<style>
	.twui-eyebrow {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		text-transform: uppercase;
		color: var(--twui-ink-faint);
	}
</style>
