<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		children,
		class: className = ''
	}: {
		id?: string;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<section {id} class="twui-landing-section {className}">
	{@render children?.()}
</section>

<style>
	.twui-landing-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
