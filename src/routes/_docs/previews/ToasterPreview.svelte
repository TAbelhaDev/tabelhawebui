<script lang="ts">
	import { Button, Toaster, toast } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const code = `<Toaster position="top-right" />

<Button onclick={() => toast.success('Salvo com sucesso')}>Sucesso</Button>
<Button onclick={() => toast.error('Falhou')}>Erro</Button>
<Button onclick={() => toast.info('Aviso')}>Info</Button>`;
</script>

<ExampleCard label="Store toast + <Toaster>" code={code}>
	<div class="twui-docs-toast-row">
		<Button variant="primary" onclick={() => toast.success('Salvo com sucesso')}>Sucesso</Button>
		<Button onclick={() => toast.error('Falhou ao sincronizar')}>Erro</Button>
		<Button variant="outline" onclick={() => toast.info('Rodando em segundo plano')}>Info</Button>
	</div>
	<Toaster position="top-right" />
</ExampleCard>

<style>
	.twui-docs-toast-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}
</style>
