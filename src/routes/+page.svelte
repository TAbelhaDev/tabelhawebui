<script lang="ts">
	import { Eyebrow } from '$lib';
	import { components } from './_docs/registry';

	const categories = $derived.by(() => {
		const map = new Map<string, typeof components>();
		for (const c of components) {
			const arr = map.get(c.category) ?? [];
			arr.push(c);
			map.set(c.category, arr);
		}
		return [...map.entries()];
	});

	const total = components.length;
</script>

<svelte:head>
	<title>TabelaWebUI — componentes</title>
</svelte:head>

<div class="twui-docs-home">
	<header class="twui-docs-home-header">
		<Eyebrow>tabelawebui</Eyebrow>
		<h1>Componentes</h1>
		<p>
			{total} componentes do design system, cada um com preview interativo,
			exemplo de uso e API. Alterna o tema no canto superior direito pra ver
			cada um no claro e no escuro.
		</p>
	</header>

	{#each categories as [category, items]}
		<section class="twui-docs-home-group">
			<h2 class="twui-docs-home-cat">{category}</h2>
			<div class="twui-docs-home-grid">
				{#each items as c}
					<a href={`/components/${c.name}`} class="twui-docs-home-card">
						<span class="twui-docs-home-card-name">{c.name}</span>
						<span class="twui-docs-home-card-desc">{c.description}</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.twui-docs-home {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.twui-docs-home-header {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.twui-docs-home-header h1 {
		margin: 0;
		font-size: 2.25rem;
		line-height: 1.1;
	}

	.twui-docs-home-header p {
		margin: 0;
		max-width: 42rem;
		color: var(--twui-ink-soft);
		font-size: 14px;
		line-height: 1.6;
	}

	.twui-docs-home-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.twui-docs-home-cat {
		margin: 0;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--twui-ink-faint);
	}

	.twui-docs-home-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 10px;
	}

	.twui-docs-home-card {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 14px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		text-decoration: none;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-docs-home-card:hover {
		border-color: var(--twui-accent);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
	}

	.twui-docs-home-card-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-docs-home-card:hover .twui-docs-home-card-name {
		color: var(--twui-accent);
	}

	.twui-docs-home-card-desc {
		font-size: 11px;
		line-height: 1.5;
		color: var(--twui-ink-faint);
	}
</style>
