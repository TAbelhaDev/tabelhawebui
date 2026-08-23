<script lang="ts">
	import { fade } from 'svelte/transition';
	import { clickOutside } from '../../actions/click-outside';
	import { comboboxKeydown } from '../../actions/combobox-keyboard-nav';

	let {
		options = [],
		value = $bindable([]),
		label,
		name,
		disabled = false,
		placeholder = 'Adicione uma tag…',
		createLabel = 'Criar tag',
		'aria-label': ariaLabel,
		class: className = '',
		...rest
	}: {
		options?: string[];
		value?: string[];
		label?: string;
		name?: string;
		disabled?: boolean;
		placeholder?: string;
		createLabel?: string;
		class?: string;
	} & { 'aria-label'?: string; id?: string } = $props();

	let open = $state(false);
	let query = $state('');
	let activeIndex = $state(-1);
	let rootEl = $state<HTMLDivElement | undefined>();
	let inputEl = $state<HTMLInputElement | undefined>();

	const trimmedQuery = $derived(query.trim());
	const filtered = $derived(
		trimmedQuery
			? options.filter(
					(o) =>
						!value.includes(o) &&
						o.toLowerCase().includes(trimmedQuery.toLowerCase())
				)
			: options.filter((o) => !value.includes(o))
	);
	const canCreate = $derived(
		trimmedQuery !== '' &&
			!options.some((o) => o.toLowerCase() === trimmedQuery.toLowerCase())
	);
	const matches = $derived(canCreate ? [...filtered, trimmedQuery] : filtered);

	function addTag(tag: string) {
		const trimmed = tag.trim();
		if (!trimmed || value.includes(trimmed)) {
			query = '';
			activeIndex = -1;
			return;
		}
		value = [...value, trimmed];
		query = '';
		activeIndex = -1;
	}

	function removeTag(tag: string) {
		value = value.filter((v) => v !== tag);
	}

	const onKeydown = comboboxKeydown({
		get open() { return open; },
		get activeIndex() { return activeIndex; },
		get itemCount() { return matches.length; },
		onActiveIndexChange: (i) => (activeIndex = i),
		onClose: () => (open = false),
		onConfirm: (i) => addTag(matches[i]),
		onOpen: () => { open = true; }
	});

	function handleKeydown(e: KeyboardEvent) {
		if (disabled) return;
		onKeydown(e);
		if (e.key === 'Enter') {
			e.preventDefault();
			if (open && activeIndex >= 0 && matches[activeIndex] !== undefined) {
				addTag(matches[activeIndex]);
			} else {
				addTag(query);
			}
			inputEl?.focus();
			return;
		}
		if (e.key === 'Backspace' && query === '' && value.length > 0) {
			removeTag(value[value.length - 1]);
		}
	}
</script>

<div
	class="twui-tag-input {className}"
	bind:this={rootEl}
	use:clickOutside={() => (open = false)}
>
	{#if label}
		<label class="twui-tag-input-label" for={rest.id}>{label}</label>
	{/if}

	<div class="twui-tag-input-field">
		{#each value as tag (tag)}
			<span class="twui-tag-input-chip">
				{tag}
				<button
					type="button"
					class="twui-tag-input-chip-remove"
					aria-label={`Remover ${tag}`}
					disabled={disabled}
					onclick={() => removeTag(tag)}
				>×</button>
			</span>
		{/each}
		<input
			type="text"
			class="twui-tag-input-text"
			bind:this={inputEl}
			bind:value={query}
			{...rest}
			placeholder={value.length ? '' : placeholder}
			disabled={disabled}
			role="combobox"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-autocomplete="list"
			aria-label={ariaLabel ?? label}
			onkeydown={handleKeydown}
			onfocus={() => (open = true)}
			oninput={() => {
				open = true;
				activeIndex = -1;
			}}
		/>
	</div>

	{#if name}
		<input type="hidden" {name} value={value.join(',')} />
	{/if}

	{#if open && (filtered.length > 0 || canCreate)}
		<ul
			class="twui-tag-input-popover"
			role="listbox"
			aria-multiselectable="true"
			transition:fade={{ duration: 100 }}
		>
			{#each matches as opt, i (opt)}
				{#if canCreate && i === matches.length - 1}
					<li>
						<button
							type="button"
							role="option"
							aria-selected="false"
							class="twui-tag-input-option twui-tag-input-option-create {i ===
							activeIndex
								? 'twui-tag-input-option-active'
								: ''}"
							onclick={() => addTag(opt)}
							onmouseenter={() => (activeIndex = i)}
						>
							<span class="twui-tag-input-create-icon" aria-hidden="true">+</span>
							<span>{createLabel}: {opt}</span>
						</button>
					</li>
				{:else}
					<li>
						<button
							type="button"
							role="option"
							aria-selected="false"
							class="twui-tag-input-option {i === activeIndex
								? 'twui-tag-input-option-active'
								: ''}"
							onclick={() => addTag(opt)}
							onmouseenter={() => (activeIndex = i)}
						>
							{opt}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<style>
	.twui-tag-input {
		position: relative;
		width: 100%;
	}

	.twui-tag-input-label {
		display: inline-flex;
		margin-bottom: 6px;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-ink);
	}

	.twui-tag-input-field {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		padding: 6px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-tag-input-field:focus-within {
		border-color: var(--twui-accent);
	}

	.twui-tag-input-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 2px 4px 2px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink);
	}

	.twui-tag-input-chip-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		padding: 0;
		border: none;
		background: transparent;
		font-size: 14px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-tag-input-chip-remove:hover {
		color: var(--twui-danger);
	}

	.twui-tag-input-chip-remove:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-tag-input-text {
		flex: 1;
		min-width: 8rem;
		padding: 4px;
		border: none;
		background: transparent;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		color: var(--twui-ink);
		outline: none;
	}

	.twui-tag-input-text::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-tag-input-text:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-tag-input-popover {
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		left: 0;
		z-index: 50;
		max-height: 240px;
		overflow-y: auto;
		margin: 0;
		padding: 4px;
		list-style: none;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
	}

	.twui-tag-input-popover li {
		padding: 0;
	}

	.twui-tag-input-option {
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

	.twui-tag-input-option:hover,
	.twui-tag-input-option-active {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}

	.twui-tag-input-option-create {
		color: var(--twui-ink-soft);
	}

	.twui-tag-input-option-create .twui-tag-input-create-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: 1px solid var(--twui-rule);
		border-radius: 2px;
		font-size: 12px;
		line-height: 1;
		color: var(--twui-accent);
	}
</style>
