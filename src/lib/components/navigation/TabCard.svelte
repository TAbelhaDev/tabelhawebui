<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		note,
		children,
		class: className = ''
	}: {
		title: string;
		note?: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-tabcard {className}">
	<span class="twui-tabcard-tab">{title}</span>
	<div class="twui-tabcard-body">
		{@render children()}
		{#if note}
			<span class="twui-tabcard-note">{note}</span>
		{/if}
	</div>
</div>

<style>
	.twui-tabcard {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
	}

	.twui-tabcard-tab {
		display: inline-flex;
		width: fit-content;
		border: 1px solid var(--twui-rule);
		border-bottom: 0;
		background: var(--twui-paper-raised);
		padding: 6px 16px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-tabcard-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		border: 1px solid var(--twui-rule);
		padding: 24px;
	}

	.twui-tabcard-note {
		margin-top: auto;
		margin-left: auto;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-faint);
	}
</style>
