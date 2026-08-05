<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...rest
	}: {
		children: Snippet;
		class?: string;
	} & HTMLAttributes<HTMLLabelElement> = $props();
</script>

<label class="twui-label {className}" {...rest}>
	{@render children()}
</label>

<style>
	.twui-label {
		display: inline-flex;
		align-items: center;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-ink);
	}
</style>
