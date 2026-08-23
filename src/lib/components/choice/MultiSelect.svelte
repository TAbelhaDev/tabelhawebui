<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { SelectOption } from '../forms/Select.svelte';
	import { clickOutside } from '../../actions/click-outside';

	let {
		options = [],
		value = $bindable([]),
		label,
		name,
		disabled = false,
		placeholder = 'Selecione...',
		filter = false,
		filterPlaceholder = 'Buscar...',
		'aria-label': ariaLabel,
		class: className = '',
		...rest
	}: {
		options?: SelectOption[];
		value?: string[];
		label?: string;
		name?: string;
		disabled?: boolean;
		placeholder?: string;
		filter?: boolean;
		filterPlaceholder?: string;
		class?: string;
	} & { 'aria-label'?: string; id?: string } = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | undefined>();
	let query = $state('');

	const selected = $derived(options.filter((o) => value.includes(o.value)));
	const visibleOptions = $derived(
		filter && query.trim()
			? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
			: options
	);

	function toggle() {
		if (disabled) return;
		open = !open;
		if (open) query = '';
	}

	function toggleOption(option: SelectOption) {
		if (option.disabled) return;
		value = value.includes(option.value)
			? value.filter((v) => v !== option.value)
			: [...value, option.value];
	}
</script>

<div
	class="twui-multiselect {className}"
	bind:this={rootEl}
	use:clickOutside={() => (open = false)}
>
	<button
		type="button"
		class="twui-multiselect-trigger"
		{...rest}
		aria-label={ariaLabel ?? label}
		disabled={disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggle}
	>
		<span class="twui-multiselect-value {selected.length ? '' : 'twui-multiselect-placeholder'}">
			{selected.length ? selected.map((o) => o.label).join(', ') : placeholder}
		</span>
		<svg
			class="twui-multiselect-chevron {open ? 'twui-multiselect-chevron-open' : ''}"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		><path d="m6 9 6 6 6-6" /></svg>
	</button>

	{#if name}
		<input type="hidden" {name} value={value.join(',')} />
	{/if}

	{#if open}
		<div
			class="twui-multiselect-popover"
			role="listbox"
			aria-multiselectable="true"
			transition:fade={{ duration: 100 }}
		>
			{#if filter}
				<div class="twui-multiselect-filter">
					<input
						type="text"
						class="twui-multiselect-filter-input"
						placeholder={filterPlaceholder}
						bind:value={query}
						aria-label={filterPlaceholder}
					/>
				</div>
			{/if}
			{#if visibleOptions.length > 0}
				{#each visibleOptions as option (option.value)}
					<button
						type="button"
						role="option"
						aria-selected={value.includes(option.value)}
						class="twui-multiselect-option {value.includes(option.value) ? 'twui-multiselect-option-selected' : ''}"
						disabled={option.disabled}
						onclick={() => toggleOption(option)}
					>
						<span class="twui-multiselect-check" aria-hidden="true">{value.includes(option.value) ? '✓' : ''}</span>
						{option.label}
					</button>
				{/each}
			{:else}
				<div class="twui-multiselect-empty">Nenhum resultado</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.twui-multiselect {
		position: relative;
		width: 100%;
	}

	.twui-multiselect-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 14px;
		text-align: left;
		color: var(--twui-ink);
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-multiselect-trigger:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-multiselect-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-multiselect-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twui-multiselect-placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-multiselect-chevron {
		flex-shrink: 0;
		color: var(--twui-ink-soft);
		transition: transform 0.15s ease;
	}

	.twui-multiselect-chevron-open {
		transform: rotate(180deg);
	}

	.twui-multiselect-popover {
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		left: 0;
		z-index: 50;
		max-height: 240px;
		overflow-y: auto;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		padding: 4px;
	}

	.twui-multiselect-filter {
		padding: 4px 4px 8px;
		border-bottom: 1px solid var(--twui-rule);
		margin-bottom: 4px;
	}

	.twui-multiselect-filter-input {
		width: 100%;
		padding: 6px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink);
		outline: none;
	}

	.twui-multiselect-filter-input::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-multiselect-filter-input:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-multiselect-option {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 6px 10px;
		border: none;
		background: transparent;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		text-align: left;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-multiselect-option:hover {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}

	.twui-multiselect-option-selected {
		color: var(--twui-accent);
		font-weight: 500;
	}

	.twui-multiselect-option:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.twui-multiselect-check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		flex-shrink: 0;
		border: 1px solid var(--twui-rule);
		border-radius: 2px;
		font-size: 10px;
		line-height: 1;
	}

	.twui-multiselect-option-selected .twui-multiselect-check {
		border-color: var(--twui-accent);
		background: var(--twui-accent);
		color: var(--twui-paper);
	}

	.twui-multiselect-empty {
		padding: 8px 10px;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-faint);
	}
</style>
