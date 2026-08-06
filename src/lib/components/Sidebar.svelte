<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		position = 'right',
		title,
		closeLabel = 'Fechar',
		children,
		class: className = ''
	}: {
		open?: boolean;
		position?: 'left' | 'right' | 'top' | 'bottom';
		title?: string;
		closeLabel?: string;
		children: Snippet;
		class?: string;
	} = $props();

	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});
</script>

{#if open}
	<div
		class="twui-sidebar-overlay"
		role="presentation"
		onpointerdown={(e) => {
			if (e.target === e.currentTarget) open = false;
		}}
	>
		<div
			class="twui-sidebar twui-sidebar-{position} {className}"
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div class="twui-sidebar-header">
				{#if title}
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

	.twui-sidebar-left {
		top: 0;
		bottom: 0;
		left: 0;
		width: 320px;
		max-width: 85vw;
	}

	.twui-sidebar-right {
		top: 0;
		bottom: 0;
		right: 0;
		width: 320px;
		max-width: 85vw;
	}

	.twui-sidebar-top {
		top: 0;
		left: 0;
		right: 0;
		height: 240px;
	}

	.twui-sidebar-bottom {
		bottom: 0;
		left: 0;
		right: 0;
		height: 240px;
	}

	.twui-sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-sidebar-title {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-sidebar-close {
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
