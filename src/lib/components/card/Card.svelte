<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		children,
		class: className = ''
	}: {
		variant?: 'default' | 'danger';
		children: Snippet;
		class?: string;
	} = $props();
</script>

<section class="twui-card twui-card-{variant} {className}">
	{@render children()}
</section>

<style>
	.twui-card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-card-danger {
		border-color: var(--twui-danger);
		background: color-mix(in oklab, var(--twui-danger) 8%, var(--twui-paper-raised));
	}
</style>
