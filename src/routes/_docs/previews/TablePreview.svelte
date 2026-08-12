<script lang="ts">
	import { Table } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const rows = [
		{ id: '1', Data: '01/08', Descrição: 'Mercado', Valor: 'R$ 120,00' },
		{ id: '2', Data: '02/08', Descrição: 'Uber', Valor: 'R$ 25,58' },
		{ id: '3', Data: '03/08', Descrição: 'Farmácia', Valor: 'R$ 80,10' },
		{ id: '4', Data: '04/08', Descrição: 'Padaria', Valor: 'R$ 18,40' }
	];

	const code = `<Table columns={['Data', 'Descrição', 'Valor']} {rows} sortable filterable />`;
</script>

<ExampleCard label="Colunas, sort, filtro e paginação" code={code}>
	<div class="twui-docs-table-wrap">
		<Table columns={['Data', 'Descrição', 'Valor']} {rows} sortable filterable pageSize={2} />
	</div>
</ExampleCard>

<style>
	.twui-docs-table-wrap {
		width: 100%;
		max-width: 30rem;
	}
</style>
