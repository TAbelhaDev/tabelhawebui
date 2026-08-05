<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		kind = 'info',
		children,
		class: className = ''
	}: {
		kind?: 'success' | 'warning' | 'error' | 'info';
		children: Snippet;
		class?: string;
	} = $props();
</script>

<span class="twui-status twui-status-{kind} {className}">
	{@render children()}
</span>

<style>
	.twui-status {
		display: inline-flex;
		align-items: center;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
	}

	.twui-status::before {
		content: '●';
		margin-right: 6px;
		font-size: 8px;
	}

	.twui-status-success {
		color: var(--twui-signal);
	}
	.twui-status-success::before {
		color: var(--twui-signal);
	}

	.twui-status-warning {
		color: var(--twui-yellow);
	}
	.twui-status-warning::before {
		color: var(--twui-yellow);
	}

	.twui-status-error {
		color: var(--twui-danger);
	}
	.twui-status-error::before {
		color: var(--twui-danger);
	}

	.twui-status-info {
		color: var(--twui-ink-soft);
	}
	.twui-status-info::before {
		color: var(--twui-ink-soft);
	}
</style>
