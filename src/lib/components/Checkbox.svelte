<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: className = '',
		checked = $bindable(false),
		name,
		value,
		disabled = false,
		label,
		...rest
	}: HTMLInputAttributes & {
		checked?: boolean;
		name?: string;
		value?: string;
		disabled?: boolean;
		label?: string;
	} = $props();
</script>

<label class="twui-choice {disabled ? 'twui-choice-disabled' : ''} {className}">
	<input
		{...rest}
		type="checkbox"
		{name}
		{value}
		{disabled}
		checked={checked}
		onchange={(e) => (checked = e.currentTarget.checked)}
		class="twui-choice-input"
	/>
	<span class="twui-choice-box" aria-hidden="true"></span>
	{#if label}
		<span class="twui-choice-label">{label}</span>
	{/if}
</label>

<style>
	.twui-choice {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
	}

	.twui-choice-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.twui-choice-box {
		position: relative;
		width: 14px;
		height: 14px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		border-radius: 2px;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
	}

	.twui-choice-input:checked + .twui-choice-box {
		border-color: var(--twui-accent);
		background: var(--twui-accent);
	}

	.twui-choice-input:checked + .twui-choice-box::after {
		content: '✓';
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		line-height: 1;
		color: var(--twui-paper);
	}

	.twui-choice:has(.twui-choice-input:focus-visible) .twui-choice-box {
		box-shadow: 0 0 0 2px var(--twui-accent-soft);
	}

	.twui-choice-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
