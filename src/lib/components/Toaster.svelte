<script lang="ts">
	import { toasts, dismiss, type ToastKind } from './toast.svelte.js';

	let { closeLabel = 'Fechar' }: { closeLabel?: string } = $props();

	function kindColor(kind: ToastKind): string {
		switch (kind) {
			case 'success':
				return 'var(--twui-signal)';
			case 'error':
				return 'var(--twui-danger)';
			case 'warning':
				return 'var(--twui-yellow)';
			case 'info':
				return 'var(--twui-ink-soft)';
		}
	}
</script>

{#if toasts.current.length > 0}
	<div class="twui-toaster">
		{#each toasts.current as t (t.id)}
			<div
				class="twui-toast"
				role="status"
				style="border-left: 2px solid {kindColor(t.kind)}"
			>
				<span class="twui-toast-message">{t.message}</span>
				{#if t.action}
					<button class="twui-toast-action" onclick={() => { t.action!.onClick(); dismiss(t.id); }}>
						{t.action.label}
					</button>
				{/if}
				<button class="twui-toast-close" aria-label={closeLabel} onclick={() => dismiss(t.id)}>×</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.twui-toaster {
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 100;
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 360px;
	}

	.twui-toast {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
	}

	.twui-toast-message {
		flex: 1;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		color: var(--twui-ink);
	}

	.twui-toast-action {
		border: 1px solid var(--twui-accent);
		background: var(--twui-accent-soft);
		padding: 4px 8px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-accent);
		cursor: pointer;
	}

	.twui-toast-action:hover {
		background: var(--twui-accent);
		color: var(--twui-paper);
	}

	.twui-toast-close {
		border: none;
		background: transparent;
		font-size: 16px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
	}

	.twui-toast-close:hover {
		color: var(--twui-ink);
	}
</style>
