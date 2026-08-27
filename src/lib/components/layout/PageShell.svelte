<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = ''
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-page-shell {className}">
	{@render children()}
</div>

<style>
	.twui-page-shell {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 56px 24px 32px;
		width: 100%;
	}
</style>
