<script lang="ts">
	import type { Snippet } from 'svelte';
	import Checkbox from '../forms/Checkbox.svelte';

	let {
		selectable = false,
		checked = $bindable(false),
		href,
		start,
		content,
		end,
		class: className = ''
	}: {
		selectable?: boolean;
		checked?: boolean;
		href?: string;
		start?: Snippet;
		content?: Snippet;
		end?: Snippet;
		class?: string;
	} = $props();
</script>

{#if href}
	<a href={href} class="twui-list-item twui-list-item-link {className}">
		{#if selectable}
			<span class="twui-list-item-select" onclick={(e) => e.stopPropagation()} role="presentation">
				<Checkbox bind:checked />
			</span>
		{/if}
		{#if start}{@render start()}{/if}
		<span class="twui-list-item-content">{#if content}{@render content()}{/if}</span>
		{#if end}<span class="twui-list-item-end">{@render end()}</span>{/if}
	</a>
{:else}
	<div class="twui-list-item {className}">
		{#if selectable}
			<span class="twui-list-item-select"><Checkbox bind:checked /></span>
		{/if}
		{#if start}{@render start()}{/if}
		<span class="twui-list-item-content">{#if content}{@render content()}{/if}</span>
		{#if end}<span class="twui-list-item-end">{@render end()}</span>{/if}
	</div>
{/if}

<style>
	.twui-list-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 12px;
		border-radius: 6px;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		line-height: 1.4;
		color: var(--twui-ink);
		text-decoration: none;
		transition: background 0.15s ease;
	}

	.twui-list-item-link:hover {
		background: var(--twui-paper-raised);
		color: var(--twui-ink);
	}

	.twui-list-item-select {
		display: inline-flex;
		flex-shrink: 0;
	}

	.twui-list-item-content {
		flex: 1;
		min-width: 0;
	}

	.twui-list-item-end {
		flex-shrink: 0;
		color: var(--twui-ink-faint);
		font-size: 12px;
	}
</style>
