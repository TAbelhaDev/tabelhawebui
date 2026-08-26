<script lang="ts">
	import type { Snippet } from 'svelte';
	import Checkbox from '../forms/Checkbox.svelte';

	let {
		selectAll,
		children,
		class: className = ''
	}: {
		selectAll?: { label: string; checked: boolean; onchange: () => void };
		children: Snippet;
		class?: string;
	} = $props();
</script>

<ul class="twui-list {className}">
	{#if selectAll}
		<li class="twui-list-selectall">
			<Checkbox checked={selectAll.checked} onchange={selectAll.onchange} label={selectAll.label} />
		</li>
	{/if}
	{@render children()}
</ul>

<style>
	.twui-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.twui-list-selectall {
		padding: 4px 12px 8px;
		margin-bottom: 4px;
		border-bottom: 1px solid var(--twui-rule);
	}
</style>
