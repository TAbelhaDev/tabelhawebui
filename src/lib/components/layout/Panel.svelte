<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		focused = false,
		toggleable = false,
		title,
		defaultOpen = true,
		children,
		class: className = ''
	}: {
		focused?: boolean;
		toggleable?: boolean;
		title?: string;
		defaultOpen?: boolean;
		children: Snippet;
		class?: string;
	} = $props();

	let open = $state(true);
	$effect(() => {
		if (toggleable) open = defaultOpen;
	});
</script>

<div class="twui-panel {focused ? 'twui-panel-focused' : ''} {className}">
	{#if toggleable}
		<button
			type="button"
			class="twui-panel-header"
			aria-expanded={open}
			onclick={() => (open = !open)}
		>
			<span class="twui-panel-title">{title}</span>
			<svg
				class="twui-panel-chevron {open ? 'twui-panel-chevron-open' : ''}"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			><path d="m6 9 6 6 6-6" /></svg>
		</button>
		{#if open}
			<div class="twui-panel-body">
				{@render children()}
			</div>
		{/if}
	{:else}
		{@render children()}
	{/if}
</div>

<style>
	.twui-panel {
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-panel-focused {
		border-color: var(--twui-accent);
	}

	.twui-panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding: 12px 16px;
		border: none;
		border-bottom: 1px solid var(--twui-rule);
		background: transparent;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 500;
		text-align: left;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-panel-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twui-panel-chevron {
		flex-shrink: 0;
		color: var(--twui-ink-soft);
		transition: transform 0.15s ease;
	}

	.twui-panel-chevron-open {
		transform: rotate(180deg);
	}

	.twui-panel-body {
		padding: 16px;
	}
</style>
