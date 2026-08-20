<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		for: forAttr,
		class: className = '',
		...rest
	}: {
		children: Snippet;
		for?: string;
		class?: string;
	} & HTMLAttributes<HTMLLabelElement> = $props();
</script>

<label class="twui-label {className}" for={forAttr} {...rest}>
	{@render children()}
</label>

<style>
	.twui-label {
		display: inline-flex;
		align-items: center;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-ink);
	}
</style>
