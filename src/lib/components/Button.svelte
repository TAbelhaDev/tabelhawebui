<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		children,
		class: className = '',
		...rest
	}: {
		variant?: 'default' | 'primary' | 'ghost' | 'danger';
		children: Snippet;
		class?: string;
	} & import('svelte/elements').HTMLButtonAttributes = $props();
</script>

<button class="twui-button twui-button-{variant} {className}" {...rest}>
	{@render children()}
</button>

<style>
	.twui-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 16px;
		border: 1px solid var(--twui-rule);
		background: transparent;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.twui-button:hover:not(:disabled) {
		background: var(--twui-paper);
	}

	.twui-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-button-primary {
		border-color: var(--twui-accent);
		background: var(--twui-accent-soft);
		font-weight: 500;
		color: var(--twui-accent);
	}

	.twui-button-primary:hover:not(:disabled) {
		background: var(--twui-accent);
		color: var(--twui-paper);
	}

	.twui-button-ghost {
		border-color: transparent;
		color: var(--twui-ink-soft);
	}

	.twui-button-ghost:hover:not(:disabled) {
		background: transparent;
		color: var(--twui-ink);
	}

	.twui-button-danger {
		border-color: var(--twui-danger);
		color: var(--twui-danger);
	}

	.twui-button-danger:hover:not(:disabled) {
		background: var(--twui-danger);
		color: var(--twui-paper);
	}
</style>
