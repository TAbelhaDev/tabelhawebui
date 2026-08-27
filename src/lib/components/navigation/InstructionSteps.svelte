<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';

	let {
		children,
		class: className = ''
	}: {
		children: Snippet;
		class?: string;
	} = $props();

	let count = 0;
	// Each <Instruction.Step> calls this on mount, in document order, so the
	// badges number themselves sequentially without an explicit index prop.
	const register = () => {
		count += 1;
		return count;
	};
	setContext('twui-instruction-step', register);
</script>

<div class="twui-instruction-steps {className}">
	{@render children()}
</div>

<style>
	.twui-instruction-steps {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Header-only step: without the content below, the header's bottom rule
	   would sit right on top of the card's own border. */
	.twui-instruction-step :global(.twui-card-header:last-child) {
		border-bottom: none;
	}
</style>
