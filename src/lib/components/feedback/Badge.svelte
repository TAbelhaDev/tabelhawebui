<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		children,
		class: className = ''
	}: {
		variant?: 'default' | 'secondary' | 'outline' | 'success' | 'danger' | 'info' | 'warn';
		children: Snippet;
		class?: string;
	} = $props();
</script>

<span class="twui-badge twui-badge-{variant} {className}">
	{#if variant === 'success' || variant === 'danger' || variant === 'info' || variant === 'warn'}
		<span class="twui-badge-bracket">[</span>
	{/if}
	{@render children()}
	{#if variant === 'success' || variant === 'danger' || variant === 'info' || variant === 'warn'}
		<span class="twui-badge-bracket">]</span>
	{/if}
</span>

<style>
	.twui-badge {
		display: inline-flex;
		align-items: center;
		padding: 2px 6px;
		border: 1px solid var(--twui-rule);
		font-family: var(--twui-font-mono);
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

	.twui-badge-success {
		background: color-mix(in oklab, var(--twui-signal, #22c55e) 10%, transparent);
		border-color: var(--twui-signal, #22c55e);
		color: var(--twui-signal, #22c55e);
	}

	.twui-badge-danger {
		background: color-mix(in oklab, var(--twui-danger) 10%, transparent);
		border-color: var(--twui-danger);
		color: var(--twui-danger);
	}

	.twui-badge-info {
		background: color-mix(in oklab, var(--twui-accent) 10%, transparent);
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-badge-warn {
		background: color-mix(in oklab, var(--twui-warning, #f59e0b) 10%, transparent);
		border-color: var(--twui-warning, #f59e0b);
		color: var(--twui-warning, #f59e0b);
	}

	.twui-badge-bracket {
		color: var(--twui-ink-faint);
	}
</style>
