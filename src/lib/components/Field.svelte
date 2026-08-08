<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		label,
		error,
		children,
		class: className = '',
		...rest
	}: {
		label: string;
		error?: string;
		children: Snippet;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="twui-field {className}" {...rest}>
	<span class="twui-field-label">{label}</span>
	{@render children()}
	{#if error}
		<p class="twui-field-error" role="alert">{error}</p>
	{/if}
</div>

<style>
	.twui-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.twui-field-label {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-ink);
	}

	.twui-field-error {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-danger);
	}
</style>