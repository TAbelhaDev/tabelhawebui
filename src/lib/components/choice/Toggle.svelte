<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: className = '',
		checked = $bindable(false),
		name,
		value,
		disabled = false,
		invalid = false,
		label,
		'aria-label': ariaLabel,
		...rest
	}: HTMLInputAttributes & {
		checked?: boolean;
		name?: string;
		value?: string;
		disabled?: boolean;
		invalid?: boolean;
		label?: string;
	} = $props();
</script>

<label class="twui-toggle {disabled ? 'twui-toggle-disabled' : ''} {className}">
	<input
		{...rest}
		type="checkbox"
		{name}
		{value}
		{disabled}
		checked={checked}
		onchange={(e) => (checked = e.currentTarget.checked)}
		class="twui-toggle-input"
		role="switch"
		aria-checked={checked}
		aria-invalid={invalid}
		aria-label={ariaLabel ?? label}
	/>
	<span class="twui-toggle-track {invalid ? 'twui-toggle-invalid' : ''}" aria-hidden="true">
		<span class="twui-toggle-knob"></span>
	</span>
	{#if label}
		<span class="twui-toggle-label">{label}</span>
	{/if}
</label>

<style>
	.twui-toggle {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		color: var(--twui-ink);
	}

	.twui-toggle-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.twui-toggle-track {
		position: relative;
		width: 34px;
		height: 18px;
		flex-shrink: 0;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		border-radius: 9999px;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
	}

	.twui-toggle-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 12px;
		height: 12px;
		border-radius: 9999px;
		background: var(--twui-ink-soft);
		transition:
			transform 0.15s ease,
			background 0.15s ease;
	}

	.twui-toggle-input:checked + .twui-toggle-track {
		border-color: var(--twui-accent);
		background: var(--twui-accent);
	}

	.twui-toggle-input:checked + .twui-toggle-track .twui-toggle-knob {
		transform: translateX(16px);
		background: var(--twui-paper);
	}

	.twui-toggle:has(.twui-toggle-input:focus-visible) .twui-toggle-track {
		box-shadow: 0 0 0 2px var(--twui-accent-soft);
	}

	.twui-toggle-invalid {
		border-color: var(--twui-danger);
	}

	.twui-toggle-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
