<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: className = '',
		value = $bindable(''),
		files = $bindable(undefined),
		type = 'text',
		...rest
	}: HTMLInputAttributes & {
		value?: string;
		files?: FileList | undefined;
	} = $props();
</script>

{#if type === 'file'}
	<input
		{...rest}
		type="file"
		bind:files
		class="twui-input twui-input-file {className}"
	/>
{:else}
	<input
		{...rest}
		{type}
		value={value}
		oninput={(e) => (value = e.currentTarget.value)}
		class="twui-input {className}"
	/>
{/if}

<style>
	.twui-input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
		outline: none;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-input::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-input:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-input-file {
		display: inline-flex;
		align-items: center;
	}

	.twui-input-file::file-selector-button {
		margin-right: 8px;
		padding: 4px 10px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-input-file::file-selector-button:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}
</style>
