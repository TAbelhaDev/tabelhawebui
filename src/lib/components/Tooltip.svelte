<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		position = 'top',
		children,
		class: className = ''
	}: {
		label: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
		class?: string;
	} = $props();
</script>

<span class="twui-tooltip twui-tooltip-{position} {className}" data-tooltip={label}>
	{@render children()}
</span>

<style>
	.twui-tooltip {
		position: relative;
		display: inline-flex;
	}

	.twui-tooltip::after {
		content: attr(data-tooltip);
		position: absolute;
		z-index: 50;
		padding: 4px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 11px;
		white-space: nowrap;
		color: var(--twui-ink);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.12s ease;
	}

	.twui-tooltip:hover::after,
	.twui-tooltip:focus-within::after {
		opacity: 1;
	}

	.twui-tooltip-top::after {
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
	}

	.twui-tooltip-bottom::after {
		top: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
	}

	.twui-tooltip-left::after {
		right: calc(100% + 6px);
		top: 50%;
		transform: translateY(-50%);
	}

	.twui-tooltip-right::after {
		left: calc(100% + 6px);
		top: 50%;
		transform: translateY(-50%);
	}
</style>
