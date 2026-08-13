<script lang="ts">
	import TimelineItem, { type TimelineItemProps } from './TimelineItem.svelte';

	let {
		items,
		class: className = ''
	}: {
		items: TimelineItemProps[];
		class?: string;
	} = $props();
</script>

<ul class="twui-timeline {className}">
	{#each items as item, i (item.key ?? i)}
		<TimelineItem {...item} isLast={i === items.length - 1} />
	{/each}
</ul>

<style>
	.twui-timeline {
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
