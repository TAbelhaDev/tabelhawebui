<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		children,
		class: className = ''
	}: {
		variant?: 'default' | 'secondary' | 'outline';
		children: Snippet;
		class?: string;
	} = $props();
</script>

<span class="twui-badge twui-badge-{variant} {className}">
	{@render children()}
</span>

<style>
	.twui-badge {
		display: inline-flex;
		align-items: center;
		padding: 2px 6px;
		border: 1px solid var(--twui-rule);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
		line-height: 1.4;
	}

	.twui-badge-secondary {
		background: var(--twui-rule);
		color: var(--twui-ink);
	}

	.twui-badge-outline {
		border-color: var(--twui-ink-soft);
		background: transparent;
		color: var(--twui-ink);
	}
</style>
