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

<p class="twui-card-description {className}">
	{@render children()}
</p>

<style>
	.twui-card-description {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}
</style>
