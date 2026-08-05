<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		focused = false,
		children,
		class: className = ''
	}: {
		focused?: boolean;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-panel {focused ? 'twui-panel-focused' : ''} {className}">
	{@render children()}
</div>

<style>
	.twui-panel {
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-panel-focused {
		border-color: var(--twui-accent);
	}
</style>
