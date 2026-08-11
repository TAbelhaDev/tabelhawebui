<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		class: className = '',
		value = $bindable(''),
		rows = 4,
		invalid = false,
		...rest
	}: HTMLTextareaAttributes & {
		value?: string;
		rows?: number;
		invalid?: boolean;
	} = $props();
</script>

<textarea
	{...rest}
	{rows}
	value={value}
	oninput={(e) => (value = e.currentTarget.value)}
	aria-invalid={invalid}
	class="twui-textarea {invalid ? 'twui-textarea-invalid' : ''} {className}"
></textarea>

<style>
	.twui-textarea {
		width: 100%;
		min-height: 96px;
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		line-height: 1.5;
		color: var(--twui-ink);
		outline: none;
		resize: vertical;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-textarea::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-textarea:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-textarea-invalid {
		border-color: var(--twui-danger);
	}

	.twui-textarea-invalid:focus-visible {
		border-color: var(--twui-danger);
	}
</style>
