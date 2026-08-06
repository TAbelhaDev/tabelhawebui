<script lang="ts">
	import { fade } from 'svelte/transition';

	export type SelectOption = { value: string; label: string; disabled?: boolean };

	let {
		options = [],
		value = $bindable(''),
		label,
		name,
		disabled = false,
		placeholder = 'Selecione...',
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
		class?: string;
	} & { 'aria-label'?: string; id?: string } = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | undefined>();
	let activeIndex = $state(-1);

	const selected = $derived(options.find((o) => o.value === value));

	function clickOutside(node: HTMLElement, callback: () => void) {
		function handler(e: MouseEvent) {
			if (!node.contains(e.target as Node)) callback();
		}
		document.addEventListener('pointerdown', handler);
		return {
			destroy: () => document.removeEventListener('pointerdown', handler)
		};
	}

	function toggle() {
		if (disabled) return;
		open = !open;
		if (open) activeIndex = options.findIndex((o) => o.value === value);
	}

	function selectOption(option: SelectOption) {
		if (option.disabled) return;
		value = option.value;
		open = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (disabled) return;
		if (e.key === 'Escape') open = false;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!open) return toggle();
			activeIndex = Math.min(activeIndex + 1, options.length - 1);
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
		}
		if (e.key === 'Enter' && open && activeIndex >= 0) {
			e.preventDefault();
			selectOption(options[activeIndex]);
		}
	}
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
		>
			{#each options as option, i (option.value)}
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
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
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

	.twui-select-option {
		display: block;
		width: 100%;
		padding: 6px 10px;
		border: none;
		background: transparent;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
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
