<script lang="ts">
	import type { SelectOption } from '../forms/Select.svelte';

	let {
		options = [],
		multiple = false,
		value = $bindable(multiple ? ([] as string[]) : ''),
		disabled = false,
		filter = false,
		filterPlaceholder = 'Buscar...',
		checkmark = true,
		'aria-label': ariaLabel,
		class: className = ''
	}: {
		options?: SelectOption[];
		multiple?: boolean;
		value?: string | string[];
		disabled?: boolean;
		filter?: boolean;
		filterPlaceholder?: string;
		checkmark?: boolean;
		'aria-label'?: string;
		class?: string;
	} = $props();

	let query = $state('');

	const visibleOptions = $derived(
		filter && query.trim()
			? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
			: options
	);

	function isSelected(option: SelectOption): boolean {
		return multiple ? (value as string[]).includes(option.value) : value === option.value;
	}

	function select(option: SelectOption) {
		if (option.disabled || disabled) return;
		if (multiple) {
			const arr = value as string[];
			value = arr.includes(option.value)
				? arr.filter((v) => v !== option.value)
				: [...arr, option.value];
		} else {
			value = option.value;
		}
	}
</script>

<div class="twui-listbox {className}">
	{#if filter}
		<div class="twui-listbox-filter">
			<input
				type="text"
				class="twui-listbox-filter-input"
				placeholder={filterPlaceholder}
				bind:value={query}
				aria-label={filterPlaceholder}
			/>
		</div>
	{/if}
	<div
		class="twui-listbox-list"
		role="listbox"
		aria-label={ariaLabel}
		aria-multiselectable={multiple || undefined}
	>
		{#if visibleOptions.length > 0}
			{#each visibleOptions as option (option.value)}
				<button
					type="button"
					role="option"
					aria-selected={isSelected(option)}
					disabled={option.disabled || disabled}
					class="twui-listbox-option {isSelected(option) ? 'twui-listbox-option-selected' : ''}"
					onclick={() => select(option)}
				>
					{#if checkmark && multiple}
						<span class="twui-listbox-check" aria-hidden="true">{isSelected(option) ? '✓' : ''}</span>
					{/if}
					{option.label}
				</button>
			{/each}
		{:else}
			<div class="twui-listbox-empty">Nenhum resultado</div>
		{/if}
	</div>
</div>

<style>
	.twui-listbox {
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-listbox-filter {
		padding: 8px;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-listbox-filter-input {
		width: 100%;
		padding: 6px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink);
		outline: none;
	}

	.twui-listbox-filter-input::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-listbox-filter-input:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-listbox-list {
		max-height: 240px;
		overflow-y: auto;
		padding: 4px;
	}

	.twui-listbox-option {
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

	.twui-listbox-option:hover:not(:disabled) {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}

	.twui-listbox-option-selected {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
		font-weight: 500;
	}

	.twui-listbox-option:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.twui-listbox-check {
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

	.twui-listbox-option-selected .twui-listbox-check {
		border-color: var(--twui-accent);
		background: var(--twui-accent);
		color: var(--twui-paper);
	}

	.twui-listbox-empty {
		padding: 12px 10px;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-faint);
	}
</style>
