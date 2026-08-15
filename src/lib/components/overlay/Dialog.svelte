<script module lang="ts">
	// Module-level counter, shared by every Dialog instance: the page scroll
	// stays locked while ANY dialog is open, and is only restored when the last
	// one closes — a nested dialog (e.g. onboarding → install modal) must not
	// unlock the background while the outer one is still up.
	let openCount = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';

	let {
		open = $bindable(false),
		title,
		size = 'md',
		closeLabel = 'Fechar',
		children,
		footer,
		class: className = ''
	}: {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg';
		closeLabel?: string;
		children: Snippet;
		footer?: Snippet;
		class?: string;
	} = $props();

	const FOCUSABLE =
		'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

	let panelEl = $state<HTMLDivElement | undefined>();

	$effect(() => {
		if (!open) return;
		openCount += 1;
		if (openCount === 1) {
			document.body.style.overflow = 'hidden';
		}
		return () => {
			openCount -= 1;
			if (openCount === 0) {
				document.body.style.overflow = '';
			}
		};
	});

	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				open = false;
				return;
			}
			// Focus trap (WCAG 2.4.3): Tab circula dentro do modal, sem
			// escapar pro conteúdo atrás do overlay.
			if (e.key !== 'Tab' || !panelEl) return;
			const focusable = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE));
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('keydown', onKey);
		tick().then(() => {
			const first = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
			(first ?? panelEl)?.focus();
		});
		return () => document.removeEventListener('keydown', onKey);
	});
</script>

{#if open}
	<div
		class="twui-dialog-overlay"
		role="presentation"
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
			{#if footer}
				<div class="twui-dialog-footer">
					{@render footer()}
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

	/* The `size` prop maps to a max-width; the `class` prop still wins over it. */
	.twui-dialog-sm {
		max-width: 480px;
	}
	.twui-dialog-md {
		max-width: 640px;
	}
	.twui-dialog-lg {
		max-width: 800px;
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
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
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
