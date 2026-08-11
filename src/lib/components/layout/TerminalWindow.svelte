<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		children,
		class: className = ''
	}: {
		title: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-terminal {className}">
	<div class="twui-terminal-bar">
		<span class="twui-terminal-dots" aria-hidden="true">
			<span class="twui-terminal-dot twui-terminal-dot-red"></span>
			<span class="twui-terminal-dot twui-terminal-dot-yellow"></span>
			<span class="twui-terminal-dot twui-terminal-dot-green"></span>
		</span>
		<span class="twui-terminal-title">{title}</span>
	</div>
	<div class="twui-terminal-body">
		{@render children()}
	</div>
</div>

<style>
	.twui-terminal {
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		overflow: hidden;
	}

	.twui-terminal-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-terminal-dots {
		display: flex;
		gap: 6px;
	}

	.twui-terminal-dot {
		width: 10px;
		height: 10px;
		border-radius: 9999px;
	}

	.twui-terminal-dot-red {
		background: var(--twui-red, var(--twui-latte-red, #d20f39));
	}

	.twui-terminal-dot-yellow {
		background: var(--twui-yellow, var(--twui-latte-yellow, #df8e1d));
	}

	.twui-terminal-dot-green {
		background: var(--twui-green, var(--twui-latte-green, #40a02b));
	}

	.twui-terminal-title {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-terminal-body {
		padding: 16px;
		background: var(--twui-paper);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		color: var(--twui-ink);
	}
</style>
