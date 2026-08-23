<script lang="ts">
	import { fade } from 'svelte/transition';
	import { clickOutside } from '../../actions/click-outside';
	import { comboboxKeydown } from '../../actions/combobox-keyboard-nav';

	export type SelectOption = { value: string; label: string; disabled?: boolean };

	let {
		options = [],
		value = $bindable(''),
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
		value?: string;
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
	let popoverEl = $state<HTMLDivElement | undefined>();
	let popoverRect = $state<{ top: number; left: number; width: number } | null>(null);
	let activeIndex = $state(-1);
	let query = $state('');

	const selected = $derived(options.find((o) => o.value === value));
	const visibleOptions = $derived(
		filter && query.trim()
			? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
			: options
	);

	// Fixed positioning: the popover escapes any `overflow` ancestor (a dialog
	// body with `overflow-y: auto` would otherwise clip the list), so the
	// dropdown floats on top of the modal instead of being contained in it.
	const popoverStyle = $derived(
		popoverRect
			? `position: fixed; top: ${popoverRect.top}px; left: ${popoverRect.left}px; width: ${popoverRect.width}px;`
			: 'position: fixed;'
	);

	function positionPopover() {
		if (!rootEl) return;
		const rect = rootEl.getBoundingClientRect();
		const height = popoverEl?.offsetHeight ?? 0;
		// Flip above the trigger when there is not enough room below (the
		// popover opens down by default).
		const spaceBelow = window.innerHeight - rect.bottom - 4;
		const openUp = height > 0 && spaceBelow < height && rect.top > height;
		const top = openUp ? rect.top - height - 4 : rect.bottom + 4;
		popoverRect = { top, left: rect.left, width: rect.width };
	}

	// While open, follow the trigger: reposition on any scroll (capture — the
	// dialog body scrolls too) and on resize, so the list stays glued to the
	// select instead of drifting.
	$effect(() => {
		if (!open) return;
		positionPopover();
		const onReposition = () => positionPopover();
		window.addEventListener('scroll', onReposition, true);
		window.addEventListener('resize', onReposition);
		return () => {
			window.removeEventListener('scroll', onReposition, true);
			window.removeEventListener('resize', onReposition);
		};
	});

	function toggle() {
		if (disabled) return;
		open = !open;
		if (open) {
			query = '';
			activeIndex = visibleOptions.findIndex((o) => o.value === value);
		}
	}

	function selectOption(option: SelectOption) {
		if (option.disabled) return;
		value = option.value;
		open = false;
	}

	const onKeydown = comboboxKeydown({
		get open() { return open; },
		get activeIndex() { return activeIndex; },
		get itemCount() { return visibleOptions.length; },
		onActiveIndexChange: (i) => (activeIndex = i),
		onClose: () => (open = false),
		onConfirm: (i) => selectOption(visibleOptions[i]),
		onOpen: () => toggle()
	});
</script>

<div
	class="twui-select-wrap {className}"
	bind:this={rootEl}
	use:clickOutside={() => (open = false)}
>
	<button
		type="button"
		class="twui-select-trigger"
		{...rest}
		aria-label={ariaLabel ?? label}
		disabled={disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggle}
		onkeydown={onKeydown}
	>
		<span class="twui-select-value {selected ? '' : 'twui-select-placeholder'}">
			{selected?.label ?? placeholder}
		</span>
		<svg
			class="twui-select-chevron {open ? 'twui-select-chevron-open' : ''}"
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
		<input type="hidden" {name} value={value} />
	{/if}

	{#if open}
		<div
			class="twui-select-popover"
			role="listbox"
			transition:fade={{ duration: 100 }}
			bind:this={popoverEl}
			style={popoverStyle}
		>
			{#if filter}
				<div class="twui-select-filter">
					<input
						type="text"
						class="twui-select-filter-input"
						placeholder={filterPlaceholder}
						bind:value={query}
						aria-label={filterPlaceholder}
					/>
				</div>
			{/if}
			{#if visibleOptions.length > 0}
				{#each visibleOptions as option, i (option.value)}
					<button
						type="button"
						role="option"
						aria-selected={option.value === value}
						class="twui-select-option {i === activeIndex ? 'twui-select-option-active' : ''} {option.value ===
						value
							? 'twui-select-option-selected'
							: ''}"
						disabled={option.disabled}
						onclick={() => selectOption(option)}
						onmouseenter={() => (activeIndex = i)}
					>
						{option.label}
					</button>
				{/each}
			{:else}
				<div class="twui-select-empty">Nenhum resultado</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.twui-select-wrap {
		position: relative;
		display: block;
		width: 100%;
		color: var(--twui-ink-soft);
	}

	.twui-select-trigger {
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

	.twui-select-trigger:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-select-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-select-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twui-select-placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-select-chevron {
		flex-shrink: 0;
		transition: transform 0.15s ease;
	}

	.twui-select-chevron-open {
		transform: rotate(180deg);
	}

	.twui-select-popover {
		/* position/coordinates come inline (fixed, computed from the trigger's
		   rect) so the list escapes any overflow ancestor — see popoverStyle. */
		z-index: 60;
		max-height: 240px;
		overflow-y: auto;
		/* Hide the native scrollbar (ugly in mono) while keeping keyboard/wheel
		   scroll — the list is short and the indicator adds nothing. */
		scrollbar-width: none;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		padding: 4px;
	}

	.twui-select-popover::-webkit-scrollbar {
		display: none;
	}

	.twui-select-filter {
		padding: 4px 4px 8px;
		border-bottom: 1px solid var(--twui-rule);
		margin-bottom: 4px;
	}

	.twui-select-filter-input {
		width: 100%;
		padding: 6px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink);
		outline: none;
	}

	.twui-select-filter-input::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-select-filter-input:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-select-empty {
		padding: 8px 10px;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-faint);
	}

	.twui-select-option {
		display: block;
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

	.twui-select-option:hover,
	.twui-select-option-active {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}

	.twui-select-option-selected {
		color: var(--twui-accent);
		font-weight: 500;
	}

	.twui-select-option:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
