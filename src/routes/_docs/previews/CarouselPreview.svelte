<script lang="ts">
	import { Carousel } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const items = [
		{ title: 'Mercado', body: 'R$ 120,00' },
		{ title: 'Uber', body: 'R$ 25,58' },
		{ title: 'Farmácia', body: 'R$ 80,10' }
	];

	const code = `<Carousel items={[{ title: 'Mercado' }, { title: 'Uber' }]} item={(item) => <p>{item.title}</p>} />`;
</script>

{#snippet carouselItem(item: unknown)}
	{@const it = item as { title: string; body: string }}
	<div class="twui-docs-carousel-card">
		<span class="twui-docs-carousel-title">{it.title}</span>
		<span class="twui-docs-carousel-body">{it.body}</span>
	</div>
{/snippet}

<ExampleCard label="Página com dots e setas" code={code}>
	<div class="twui-docs-carousel-wrap">
		<Carousel {items} item={carouselItem} />
	</div>
</ExampleCard>

<style>
	.twui-docs-carousel-wrap {
		width: 100%;
		max-width: 18rem;
	}

	.twui-docs-carousel-card {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	.twui-docs-carousel-title {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
	}

	.twui-docs-carousel-body {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}
</style>
