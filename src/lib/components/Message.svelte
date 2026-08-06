<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		severity = 'info',
		variant = 'simple',
		size,
		closable = false,
		life,
		closeLabel = 'Fechar',
		children,
		class: className = ''
	}: {
		severity?: 'info' | 'success' | 'warn' | 'error';
		variant?: 'simple' | 'outlined';
		size?: 'small';
		closable?: boolean;
		life?: number;
		closeLabel?: string;
		children: Snippet;
		class?: string;
	} = $props();

	let visible = $state(true);

	$effect(() => {
		if (!visible || !life) return;
		const id = setTimeout(() => (visible = false), life);
		return () => clearTimeout(id);
	});
</script>

{#if visible}
	<div
		class="twui-message twui-message-{severity} twui-message-{variant} {size ? `twui-message-${size}` : ''} {className}"
		role="alert"
	>
		<span class="twui-message-ind" aria-hidden="true"></span>
		<div class="twui-message-content">
			{@render children()}
		</div>
		{#if closable}
			<button
				type="button"
				class="twui-message-close"
				aria-label={closeLabel}
				onclick={() => (visible = false)}
			>×</button>
		{/if}
	</div>
{/if}

<style>
	.twui-message {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 10px 12px;
		border: 1px solid var(--twui-rule);
		border-left-width: 3px;
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		color: var(--twui-ink);
	}

	.twui-message-small {
		padding: 6px 10px;
		font-size: 12px;
	}

	.twui-message-outlined {
		background: transparent;
	}

	.twui-message-ind {
		flex-shrink: 0;
		width: 8px;
		height: 8px;
		margin-top: 3px;
		border-radius: 9999px;
		background: var(--twui-ink-soft);
	}

	.twui-message-info {
		border-left-color: var(--twui-info, var(--twui-latte-sky, #04a5e5));
	}
	.twui-message-info .twui-message-ind {
		background: var(--twui-info, var(--twui-latte-sky, #04a5e5));
	}

	.twui-message-success {
		border-left-color: var(--twui-signal);
	}
	.twui-message-success .twui-message-ind {
		background: var(--twui-signal);
	}

	.twui-message-warn {
		border-left-color: var(--twui-yellow);
	}
	.twui-message-warn .twui-message-ind {
		background: var(--twui-yellow);
	}

	.twui-message-error {
		border-left-color: var(--twui-danger);
	}
	.twui-message-error .twui-message-ind {
		background: var(--twui-danger);
	}

	.twui-message-content {
		flex: 1;
	}

	.twui-message-close {
		flex-shrink: 0;
		border: none;
		background: transparent;
		font-size: 15px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
	}

	.twui-message-close:hover {
		color: var(--twui-ink);
	}
</style>
