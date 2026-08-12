<script lang="ts">
	import { Button, Sidebar } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	let open = $state(false);

	const code = `<Button onclick={() => (open = true)}>Abrir painel</Button>

<Sidebar bind:open title="Filtros" closeLabel="Fechar">
	<p>Conteúdo do painel lateral.</p>
</Sidebar>`;
</script>

<ExampleCard label="Drawer lateral (overlay)" code={code}>
	<Button onclick={() => (open = true)}>Abrir painel</Button>
	<Sidebar bind:open title="Filtros" closeLabel="Fechar">
		<p class="twui-docs-side-text">Filtre por data, categoria e conta.</p>
	</Sidebar>
</ExampleCard>

<style>
	.twui-docs-side-text {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		color: var(--twui-ink);
	}
</style>
