<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = ''
	}: {
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-landing {className}">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-150"
		style="background-image: var(--gradient-hero)"
	></div>

	<div class="twui-landing-inner">
		{@render children?.()}
	</div>
</div>

<style>
	.twui-landing {
		position: relative;
		display: flex;
		width: 100%;
		flex: 1;
		flex-direction: column;
	}

	.twui-landing-inner {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6rem;
		padding: 4rem 1.5rem 2rem;
	}

	@media (min-width: 768px) {
		.twui-landing-inner {
			padding-top: 6rem;
		}
	}
</style>
