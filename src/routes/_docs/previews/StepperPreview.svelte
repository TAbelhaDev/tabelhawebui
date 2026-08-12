<script lang="ts">
	import { Stepper } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	let value = $state('banco');

	const items = [
		{ value: 'conta', label: 'Conta' },
		{ value: 'banco', label: 'Banco' },
		{ value: 'pronto', label: 'Pronto' }
	];

	const code = `<Stepper
	items={[
		{ value: 'conta', label: 'Conta' },
		{ value: 'banco', label: 'Banco' },
		{ value: 'pronto', label: 'Pronto' }
	]}
	bind:value
/>`;
</script>

<ExampleCard label="Indicador de passos bindável" code={code}>
	<Stepper {items} bind:value />
</ExampleCard>
