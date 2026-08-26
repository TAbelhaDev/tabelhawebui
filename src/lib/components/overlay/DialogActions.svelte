<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		start,
		end,
		class: className = ''
	}: {
		start?: Snippet;
		end?: Snippet;
		class?: string;
	} = $props();
</script>

<!-- Standard modal footer-actions row: secondary action on the left, primary
     on the right. The end block is pushed right by itself, so a dialog with
     only a primary button still aligns it correctly. -->
<div class="twui-dialog-actions {className}">
	{#if start}
		<div class="twui-dialog-actions-start">
			{@render start()}
		</div>
	{/if}
	{#if end}
		<div class="twui-dialog-actions-end">
			{@render end()}
		</div>
	{/if}
</div>

<style>
	.twui-dialog-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.twui-dialog-actions-start {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.twui-dialog-actions-end {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
	}
</style>
