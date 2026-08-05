<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		value = $bindable(''),
		...rest
	}: {
		children: Snippet;
		class?: string;
		value?: string;
	} & HTMLSelectAttributes = $props();
</script>

<select class="twui-select {className}" bind:value {...rest}>
	{@render children()}
</select>

<style>
	.twui-select {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
		outline: none;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.twui-select:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
