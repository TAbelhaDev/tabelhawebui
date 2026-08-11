<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let {
		open = $bindable(false),
		mode = 'overlay',
		overlay = true,
		collapsible = false,
		collapsed = $bindable(false),
		position = 'right',
		title,
		closeLabel = 'Fechar',
		collapseLabel = 'Recolher',
		expandLabel = 'Expandir',
		children,
		class: className = ''
	}: {
		open?: boolean;
		mode?: 'overlay' | 'push';
		overlay?: boolean;
		collapsible?: boolean;
		collapsed?: boolean;
		position?: 'left' | 'right' | 'top' | 'bottom';
		title?: string;
		closeLabel?: string;
		collapseLabel?: string;
		expandLabel?: string;
		children: Snippet;
		class?: string;
	} = $props();

	let isMobile = $state(false);

	$effect(() => {
		const mq = window.matchMedia('(max-width: 768px)');
		const update = () => (isMobile = mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	});

	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	const reduced = () =>
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

	function overlayFade(node: HTMLElement) {
		return fade(node, { duration: reduced() ? 0 : 150 });
	}

	function drawerTransition(node: HTMLElement) {
		const dirX = position === 'left' ? -1 : position === 'right' ? 1 : 0;
		const dirY = position === 'top' ? -1 : position === 'bottom' ? 1 : 0;
		const duration = reduced() ? 0 : 160;
		return {
			duration,
			easing: easeOutCubic,
			css: (t: number) =>
				`transform: translate(${dirX * (1 - t) * 40}px, ${dirY * (1 - t) * 40}px); opacity: ${t};`
		};
	}
</script>

{#if open}
	{#if overlay && (mode === 'overlay' || isMobile)}
		<div
			class="twui-sidebar-overlay"
			role="presentation"
			onpointerdown={(e) => {
				if (e.target === e.currentTarget) open = false;
			}}
			transition:overlayFade
		></div>
	{/if}

	<div
		class="twui-sidebar twui-sidebar-{position} {mode === 'push' ? 'twui-sidebar-push' : ''} {collapsible ? 'twui-sidebar-collapsible' : ''} {collapsible && collapsed ? 'twui-sidebar-collapsed' : ''} {className}"
		role="dialog"
		aria-modal={mode === 'overlay' || isMobile}
		aria-label={title}
		transition:drawerTransition
	>
		<div class="twui-sidebar-header">
			{#if collapsible}
				<button
					type="button"
					class="twui-sidebar-collapse-toggle"
					aria-label={collapsed ? expandLabel : collapseLabel}
					aria-expanded={!collapsed}
					onclick={() => (collapsed = !collapsed)}
				>{collapsed ? '»' : '«'}</button>
			{/if}
			{#if title && !(collapsible && collapsed)}
				<h2 class="twui-sidebar-title">{title}</h2>
			{/if}
			<button type="button" class="twui-sidebar-close" aria-label={closeLabel} onclick={() => (open = false)}>
				×
			</button>
		</div>
		<div class="twui-sidebar-body">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.twui-sidebar-overlay {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: color-mix(in srgb, var(--twui-ink) 25%, transparent);
	}

	.twui-sidebar {
		display: flex;
		flex-direction: column;
		position: fixed;
		z-index: 91;
		background: var(--twui-paper-raised);
		border: 1px solid var(--twui-rule);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
	}

	.twui-sidebar-left,
	.twui-sidebar-right {
		top: 0;
		bottom: 0;
		width: var(--twui-sidebar-width, 320px);
		max-width: 85vw;
	}

	.twui-sidebar-left {
		left: 0;
	}

	.twui-sidebar-right {
		right: 0;
	}

	.twui-sidebar-top,
	.twui-sidebar-bottom {
		left: 0;
		right: 0;
		height: 240px;
	}

	.twui-sidebar-top {
		top: 0;
	}

	.twui-sidebar-bottom {
		bottom: 0;
	}

	.twui-sidebar-collapsed {
		width: var(--twui-sidebar-width-collapsed, 48px);
		max-width: var(--twui-sidebar-width-collapsed, 48px);
	}

	@media (min-width: 769px) {
		.twui-sidebar-push {
			position: static;
			align-self: stretch;
			max-width: none;
			box-shadow: none;
		}

		.twui-sidebar-push.twui-sidebar-top,
		.twui-sidebar-push.twui-sidebar-bottom {
			height: var(--twui-sidebar-height, 240px);
		}
	}

	@media (max-width: 768px) {
		.twui-sidebar-left,
		.twui-sidebar-right {
			width: var(--twui-sidebar-width-mobile, 100vw);
			max-width: var(--twui-sidebar-width-mobile, 100vw);
		}
	}

	.twui-sidebar-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-sidebar-collapse-toggle {
		border: 1px solid var(--twui-rule);
		background: transparent;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-sidebar-collapse-toggle:hover {
		color: var(--twui-ink);
	}

	.twui-sidebar-title {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-sidebar-close {
		margin-left: auto;
		border: none;
		background: transparent;
		font-size: 18px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
	}

	.twui-sidebar-close:hover {
		color: var(--twui-accent);
	}

	.twui-sidebar-body {
		flex: 1;
		padding: 16px;
		overflow-y: auto;
	}
</style>