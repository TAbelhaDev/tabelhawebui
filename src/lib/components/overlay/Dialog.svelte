<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { lockScroll } from '../../actions/scroll-lock';
	import { trapFocus } from '../../actions/focus-trap';
	import DialogActions from './DialogActions.svelte';

	let {
		open = $bindable(false),
		title,
		size = 'md',
		closeLabel = 'Fechar',
		animate = true,
		children,
		footer,
		footerStart,
		footerEnd,
		class: className = ''
	}: {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg';
		closeLabel?: string;
		animate?: boolean;
		children: Snippet;
		/** Full custom footer: rendered as-is inside the docked bar. */
		footer?: Snippet;
		/** Secondary action (dismiss/back), docked left. */
		footerStart?: Snippet;
		/** Primary action(s), docked right. */
		footerEnd?: Snippet;
		class?: string;
	} = $props();

	let panelEl = $state<HTMLDivElement | undefined>();

	const reduced = () =>
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function overlayTransition(node: HTMLElement) {
		if (!animate || reduced()) return fade(node, { duration: 0 });
		return fade(node, { duration: 150 });
	}

	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

	function panelTransition(node: HTMLElement) {
		if (!animate || reduced()) return fade(node, { duration: 0 });
		return {
			duration: 160,
			easing: easeOutCubic,
			css: (t: number) => `transform: scale(${0.95 + t * 0.05}); opacity: ${t};`
		};
	}

	$effect(() => {
		if (!open) return;
		return lockScroll();
	});

	$effect(() => {
		if (!open || !panelEl) return;
		return trapFocus(panelEl, () => (open = false));
	});
</script>

{#if open}
	<div
		class="twui-dialog-overlay"
		role="presentation"
		transition:overlayTransition
		onpointerdown={(e) => {
			if (e.target === e.currentTarget) open = false;
		}}
	>
		<div
			class="twui-dialog twui-dialog-{size} {className}"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabindex="-1"
			bind:this={panelEl}
			transition:panelTransition
		>
			<div class="twui-dialog-header">
				{#if title}
					<h2 class="twui-dialog-title">{title}</h2>
				{/if}
				<button type="button" class="twui-dialog-close" aria-label={closeLabel} onclick={() => (open = false)}>
					×
				</button>
			</div>
			<div class="twui-dialog-body">
				{@render children()}
			</div>
		{#if footer || footerStart || footerEnd}
			<div class="twui-dialog-footer">
				{#if footer}
					{@render footer()}
				{:else}
					<DialogActions>
						{#snippet start()}
							{#if footerStart}{@render footerStart()}{/if}
						{/snippet}
						{#snippet end()}
							{#if footerEnd}{@render footerEnd()}{/if}
						{/snippet}
					</DialogActions>
				{/if}
			</div>
		{/if}
		</div>
	</div>
{/if}

<style>
	.twui-dialog-overlay {
		position: fixed;
		inset: 0;
		z-index: 90;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: color-mix(in srgb, var(--twui-ink) 25%, transparent);
	}

	.twui-dialog {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-height: 85vh;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		outline: none;
	}

	/* The `size` prop maps to Tailwind max-width values; the `class` prop still wins. */
	.twui-dialog-sm {
		max-width: 448px; /* max-w-md */
	}
	.twui-dialog-md {
		max-width: 576px; /* max-w-xl */
	}
	.twui-dialog-lg {
		max-width: 768px; /* max-w-3xl */
	}

	.twui-dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-dialog-title {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-dialog-close {
		border: none;
		background: transparent;
		font-size: 18px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
	}

	.twui-dialog-close:hover {
		color: var(--twui-accent);
	}

	.twui-dialog-body {
		padding: 16px;
		overflow-y: auto;
		/* The native scrollbar breaks the mono aesthetic; scrolling still works
		   by keyboard/wheel, the indicator is just hidden (same as the Select). */
		scrollbar-width: none;
	}
	.twui-dialog-body::-webkit-scrollbar {
		display: none;
	}

	.twui-dialog-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		padding: 12px 16px;
		border-top: 1px solid var(--twui-rule);
	}
</style>
