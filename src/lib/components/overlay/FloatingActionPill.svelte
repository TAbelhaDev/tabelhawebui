<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fade, scale } from 'svelte/transition';

	let {
		position = 'bottom-right',
		expanded = false,
		animate = true,
		label,
		expandedLabel = 'Fechar',
		children,
		class: className = '',
		...rest
	}: {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		expanded?: boolean;
		animate?: boolean;
		label: string;
		expandedLabel?: string;
		children: Snippet;
		class?: string;
	} & HTMLButtonAttributes = $props();

	const reduced = () =>
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function pillTransition(node: HTMLElement) {
		if (!animate || reduced()) return fade(node, { duration: 0 });
		return scale(node, { duration: 150, easing: (t) => 1 - Math.pow(1 - t, 3) });
	}
</script>

<button
	type="button"
	class="twui-floating-action-pill twui-floating-action-pill-{position} {className}"
	aria-label={expanded ? expandedLabel : label}
	aria-expanded={expanded}
	transition:pillTransition
	{...rest}
>
	{@render children()}
</button>

<style>
	.twui-floating-action-pill {
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
		cursor: pointer;
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		transition:
			color 0.15s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.twui-floating-action-pill:hover {
		color: var(--twui-accent);
	}

	.twui-floating-action-pill:active {
		transform: translate(2px, 2px);
		box-shadow: none;
	}

	.twui-floating-action-pill-bottom-right {
		right: 1rem;
		bottom: 1.5rem;
	}

	.twui-floating-action-pill-bottom-left {
		left: 1rem;
		bottom: 1.5rem;
	}

	.twui-floating-action-pill-top-right {
		right: 1rem;
		top: 1rem;
	}

	.twui-floating-action-pill-top-left {
		left: 1rem;
		top: 1rem;
	}
</style>
