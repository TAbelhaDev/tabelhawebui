<script lang="ts">
	import Tooltip from '$lib/components/Tooltip.svelte';

	// Tooltip takes its trigger as a snippet, so exercising it needs a host
	// component. Lives under src/tests so svelte-package does not ship it.
	let { label = 'Copiar link' }: { label?: string } = $props();
</script>

<Tooltip {label}>
	<button type="button">Copiar</button>
</Tooltip>
