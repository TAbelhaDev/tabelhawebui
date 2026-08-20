<script lang="ts">
	import { Tabs } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	let value = $state('todas');

	const items = [
		{ value: 'todas', label: 'Todas' },
		{ value: 'receitas', label: 'Receitas' },
		{ value: 'despesas', label: 'Despesas' },
		{ value: 'arquivadas', label: 'Arquivadas', disabled: true }
	];

	const code = `<Tabs
	items={[
		{ value: 'todas', label: 'Todas' },
		{ value: 'receitas', label: 'Receitas' },
		{ value: 'despesas', label: 'Despesas' }
	]}
	bind:value
/>`;
</script>

<ExampleCard label="Abas bindável com navegação por teclado" code={code}>
	<Tabs {items} bind:value />
	<span class="twui-docs-tabs-value">aba ativa: {value}</span>
</ExampleCard>

<style>
	.twui-docs-tabs-value {
		font-family: var(--twui-font-mono);
		font-size: 11px;
		color: var(--twui-ink-faint);
	}
</style>
