<script lang="ts">
	import { Timeline } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const items = [
		{
			title: 'Conta criada',
			subtitle: 'signup',
			date: '01/08',
			details: ['Confirmou o e-mail', 'Primeiro login']
		},
		{
			title: 'Open Finance conectado',
			subtitle: 'banco',
			start: '02/08',
			end: '05/08'
		},
		{
			title: 'Primeira categorização',
			subtitle: 'IA local',
			location: 'mercado'
		}
	];

	const code = `<Timeline items={[
	{ title: 'Conta criada', subtitle: 'signup', date: '01/08' },
	{ title: 'Open Finance conectado', subtitle: 'banco', start: '02/08', end: '05/08' },
	{ title: 'Primeira categorização', subtitle: 'IA local', location: 'mercado' }
]} />`;
</script>

<ExampleCard label="Item com trilho, dot e datas" code={code}>
	<div class="twui-docs-timeline-wrap">
		<Timeline {items} />
	</div>
</ExampleCard>

<style>
	.twui-docs-timeline-wrap {
		width: 100%;
		max-width: 20rem;
	}
</style>
