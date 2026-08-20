<script lang="ts">
	import SectionHeading from '../layout/SectionHeading.svelte';

	let {
		eyebrow,
		title,
		lead,
		justify = false,
		class: className = ''
	}: {
		eyebrow: string;
		title: string;
		lead?: string;
		justify?: boolean;
		class?: string;
	} = $props();
</script>

<SectionHeading {eyebrow} {title} {lead} {justify} class={className} />
