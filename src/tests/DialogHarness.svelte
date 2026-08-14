<script lang="ts">
	import Dialog from "$lib/components/overlay/Dialog.svelte";

	let { nested = false }: { nested?: boolean } = $props();
	let a = $state(false);
	let b = $state(false);
</script>

<button type="button" data-testid="open" onclick={() => (a = true)}>abrir</button>
<button type="button" data-testid="close" onclick={() => (a = false)}>fechar</button>

{#if nested}
	<button type="button" data-testid="open-b" onclick={() => (b = true)}>abrir-b</button>
	<button type="button" data-testid="close-b" onclick={() => (b = false)}>fechar-b</button>
{/if}

<Dialog bind:open={a}>
	<p>dialog a</p>
	{#snippet footer()}
		<button type="button" data-testid="footer-close" onclick={() => (a = false)}>fechar</button>
	{/snippet}
</Dialog>

{#if nested}
	<Dialog bind:open={b}>
		<p>dialog b</p>
	</Dialog>
{/if}
