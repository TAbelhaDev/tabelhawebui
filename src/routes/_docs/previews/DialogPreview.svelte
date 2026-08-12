<script lang="ts">
	import { Button, Dialog } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	let open = $state(false);

	const code = `<Button onclick={() => (open = true)}>Abrir</Button>

<Dialog bind:open title="Confirmar exclusão" closeLabel="Fechar">
	<p>Tem certeza? Essa ação não pode ser desfeita.</p>
	{#snippet footer()}
		<Button variant="danger" onclick={() => (open = false)}>Excluir</Button>
	{/snippet}
</Dialog>`;
</script>

<ExampleCard label="Modal com overlay, Esc e footer" code={code}>
	<Button onclick={() => (open = true)}>Abrir diálogo</Button>
	<Dialog bind:open title="Confirmar exclusão" closeLabel="Fechar">
		<p class="twui-docs-dialog-text">Tem certeza? Essa ação não pode ser desfeita.</p>
		{#snippet footer()}
			<Button variant="danger" onclick={() => (open = false)}>Excluir</Button>
			<Button onclick={() => (open = false)}>Cancelar</Button>
		{/snippet}
	</Dialog>
</ExampleCard>

<style>
	.twui-docs-dialog-text {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		color: var(--twui-ink);
	}
</style>
