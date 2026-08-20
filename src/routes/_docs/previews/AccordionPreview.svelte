<script lang="ts">
	import { Accordion } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const code = `<Accordion
	items={[
		{ value: 'sync', title: 'Com que frequência sincroniza?' },
		{ value: 'byok', title: 'Preciso de chave de IA própria?' }
	]}
	multiple
/>`;
</script>

{#snippet syncContent()}
	<p class="twui-docs-acc-text">A sincronização diária roda às 06:00.</p>
{/snippet}

{#snippet byokContent()}
	<p class="twui-docs-acc-text">Sim — traga a sua chave de IA e processe localmente.</p>
{/snippet}

<ExampleCard label="Colapsáveis com título e conteúdo" code={code}>
	<div class="twui-docs-acc-wrap">
		<Accordion
			items={[
				{ value: 'sync', title: 'Com que frequência sincroniza?', content: syncContent },
				{ value: 'byok', title: 'Preciso de chave de IA própria?', content: byokContent },
				{ value: 'gratis', title: 'Tem plano gratuito?' }
			]}
			multiple
		/>
	</div>
</ExampleCard>

<style>
	.twui-docs-acc-wrap {
		width: 100%;
		max-width: 24rem;
	}

	.twui-docs-acc-text {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-soft);
	}
</style>
