<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		items,
		value = $bindable([]),
		multiple = false,
		class: className = ''
	}: {
		items: { value: string; title: string; disabled?: boolean; content?: Snippet }[];
		value?: string[];
		multiple?: boolean;
		class?: string;
	} = $props();

	function toggle(itemValue: string) {
		if (multiple) {
			value = value.includes(itemValue)
				? value.filter((v) => v !== itemValue)
				: [...value, itemValue];
		} else {
			value = value.includes(itemValue) ? [] : [itemValue];
		}
	}
</script>

<div class="twui-accordion {className}">
	{#each items as item (item.value)}
		{@const open = value.includes(item.value)}
		<div class="twui-accordion-item {open ? 'twui-accordion-item-open' : ''}">
			<button
				type="button"
				class="twui-accordion-header"
				disabled={item.disabled}
				aria-expanded={open}
				onclick={() => toggle(item.value)}
			>
				<span class="twui-accordion-title">{item.title}</span>
				<svg
					class="twui-accordion-chevron {open ? 'twui-accordion-chevron-open' : ''}"
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
			{#if open && item.content}
				<div class="twui-accordion-content">
					{@render item.content()}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.twui-accordion {
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-accordion-item + .twui-accordion-item {
		border-top: 1px solid var(--twui-rule);
	}

	.twui-accordion-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding: 12px 16px;
		border: none;
		background: transparent;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		font-weight: 500;
		text-align: left;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-accordion-header:hover:not(:disabled) {
		color: var(--twui-accent);
	}

	.twui-accordion-header:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.twui-accordion-chevron {
		flex-shrink: 0;
		color: var(--twui-ink-soft);
		transition: transform 0.15s ease;
	}

	.twui-accordion-chevron-open {
		transform: rotate(180deg);
	}

	.twui-accordion-content {
		padding: 4px 16px 16px;
	}
</style>
