<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		position = 'bottom-right',
		closable = false,
		visible = $bindable(true),
		dismissLabel = 'Fechar status',
		style,
		children,
		class: className = ''
	}: {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		closable?: boolean;
		visible?: boolean;
		dismissLabel?: string;
		style?: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

{#if visible}
	<div
		class="twui-status-pill twui-status-pill-{position} {closable ? 'twui-status-pill-closable' : ''} {className}"
		style={style}
		role="status"
	>
		{@render children()}
		{#if closable}
			<button
				type="button"
				class="twui-status-pill-close"
				aria-label={dismissLabel}
				onclick={() => (visible = false)}
			>×</button>
		{/if}
	</div>
{/if}

<style>
	.twui-status-pill {
		position: fixed;
		z-index: 40;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
	}

	.twui-status-pill-bottom-right {
		right: 1rem;
		bottom: 1.5rem;
	}

	.twui-status-pill-bottom-left {
		left: 1rem;
		bottom: 1.5rem;
	}

	.twui-status-pill-top-right {
		right: 1rem;
		top: 1rem;
	}

	.twui-status-pill-top-left {
		left: 1rem;
		top: 1rem;
	}

	.twui-status-pill-close {
		margin-left: 2px;
		padding-left: 8px;
		border: none;
		border-left: 1px solid var(--twui-rule);
		background: transparent;
		font-size: 14px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-status-pill-close:hover {
		color: var(--twui-accent);
	}
</style>
