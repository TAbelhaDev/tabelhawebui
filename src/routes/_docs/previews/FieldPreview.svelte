<script lang="ts">
	import { Field, Input, Select } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const options = [
		{ value: 'mercado', label: 'Mercado' },
		{ value: 'transporte', label: 'Transporte' },
		{ value: 'saude', label: 'Saúde' }
	];

	const code = `<Field label="Descrição" error="Campo obrigatório">
	<Input placeholder="Mercado, Uber…" invalid />
</Field>

<Field label="Categoria">
	<Select options={options} placeholder="Escolher categoria" />
</Field>`;
</script>

<ExampleCard label="Label + controle + erro" code={code}>
	<div class="twui-docs-field-wrap">
		<Field label="Descrição" error="Campo obrigatório">
			<Input placeholder="Mercado, Uber…" invalid />
		</Field>
		<Field label="Categoria">
			<Select {options} placeholder="Escolher categoria" />
		</Field>
	</div>
</ExampleCard>

<style>
	.twui-docs-field-wrap {
		display: flex;
		flex-direction: column;
		gap: 14px;
		width: 100%;
		max-width: 20rem;
	}
</style>
