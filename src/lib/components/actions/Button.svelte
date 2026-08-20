<script module lang="ts">
	export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline';
	export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm';

	// Variant class helper for use where a real <Button> doesn't fit (e.g. decorative <span>).
	export function buttonVariants(
		opts: { variant?: ButtonVariant; size?: ButtonSize } = {}
	): string {
		const { variant = 'primary', size = 'md' } = opts;
		return `twui-button twui-button-${variant} twui-button-${size}`;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		variant = 'primary',
		size = 'md',
		href,
		loading = false,
		children,
		class: className = '',
		...rest
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
		loading?: boolean;
		children: Snippet;
		class?: string;
	} & HTMLButtonAttributes & HTMLAnchorAttributes = $props();
</script>

{#if href}
	<a
		href={href}
		class="twui-button twui-button-{variant} twui-button-{size} {loading ? 'twui-button-loading' : ''} {className}"
		aria-busy={loading}
		{...rest}
	>
		{#if loading}
			<span class="twui-button-spinner" aria-hidden="true"></span>
		{/if}
		{@render children()}
	</a>
{:else}
	<button
		class="twui-button twui-button-{variant} twui-button-{size} {loading ? 'twui-button-loading' : ''} {className}"
		disabled={rest.disabled || loading}
		aria-busy={loading}
		{...rest}
	>
		{#if loading}
			<span class="twui-button-spinner" aria-hidden="true"></span>
		{/if}
		{@render children()}
	</button>
{/if}

<style>
	.twui-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 1px solid transparent;
		background: transparent;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.twui-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-button-spinner {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 9999px;
		animation: twui-button-spin 0.7s linear infinite;
	}

	@keyframes twui-button-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.twui-button-sm {
		padding: 4px 12px;
		font-size: 13px;
	}

	.twui-button-md {
		padding: 6px 16px;
		font-size: 14px;
	}

	.twui-button-lg {
		padding: 8px 24px;
		font-size: 14px;
	}

	.twui-button-icon-sm {
		width: 28px;
		height: 28px;
		padding: 0;
	}

	.twui-button-primary {
		background: color-mix(in oklab, var(--twui-accent) 12%, transparent);
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-button-primary:hover:not(:disabled) {
		background: color-mix(in oklab, var(--twui-accent) 25%, transparent);
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-button-ghost {
		background: transparent;
		border-color: transparent;
		color: var(--twui-ink-soft);
	}

	.twui-button-ghost:hover:not(:disabled) {
		background: transparent;
		color: var(--twui-ink);
	}

	.twui-button-danger {
		background: transparent;
		border-color: var(--twui-danger);
		color: var(--twui-danger);
	}

	.twui-button-danger:hover:not(:disabled) {
		background: var(--twui-danger);
		color: var(--twui-paper);
	}

	.twui-button-outline {
		background: transparent;
		border-color: var(--twui-ink-soft);
		color: var(--twui-ink);
	}

	.twui-button-outline:hover:not(:disabled) {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}
</style>
