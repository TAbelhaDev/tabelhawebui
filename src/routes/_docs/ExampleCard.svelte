<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from './CodeBlock.svelte';

	let {
		label,
		code,
		children,
		class: className = ''
	}: {
		label: string;
		code: string;
		children: Snippet;
		class?: string;
	} = $props();

	let showCode = $state(false);
</script>

<div class="twui-docs-example {className}">
	<div class="twui-docs-example-preview">{@render children()}</div>
	<div class="twui-docs-example-bar">
		<span class="twui-docs-example-label">{label}</span>
		<button
			type="button"
			class="twui-docs-example-toggle"
			onclick={() => (showCode = !showCode)}
		>
			{showCode ? 'Esconder código' : 'Ver código'}
		</button>
	</div>
	{#if showCode}
		<CodeBlock {code} />
	{/if}
</div>

<style>
	.twui-docs-example {
		display: flex;
		flex-direction: column;
		margin: 0;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
	}

	.twui-docs-example-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 12px;
		min-height: 96px;
		padding: 20px;
	}

	.twui-docs-example-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 6px 8px;
		border-top: 1px solid var(--twui-rule);
	}

	.twui-docs-example-label {
		font-family: var(--twui-font-mono);
		font-size: 11px;
		color: var(--twui-ink-faint);
	}

	.twui-docs-example-toggle {
		border: none;
		background: transparent;
		padding: 2px 4px;
		font-family: var(--twui-font-mono);
		font-size: 11px;
		color: var(--twui-accent);
		cursor: pointer;
	}

	.twui-docs-example-toggle:hover {
		text-decoration: underline;
	}
</style>
