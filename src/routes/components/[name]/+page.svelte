<script lang="ts">
	import { page } from '$app/state';
	import { ErrorPage, Eyebrow } from '$lib';
	import ExampleCard from '../../_docs/ExampleCard.svelte';
	import { propsCatalog } from '../../_docs/catalog';
	import { simpleComponents } from '../../_docs/component-map';
	import { components } from '../../_docs/registry';

	const name = $derived(page.params.name);
	const doc = $derived(
		components.find((c) => c.name.toLowerCase() === (name ?? '').toLowerCase())
	);
	const Component = $derived(doc ? simpleComponents[doc.name] : undefined);
	const propList = $derived(doc ? propsCatalog[doc.name] ?? [] : []);
	const preview = $derived(doc?.preview);
</script>

<svelte:head>
	<title>{doc ? `${doc.name} — TAbelhaWebUI` : 'Componente não encontrado'}</title>
</svelte:head>

{#if !doc}
	<div class="twui-docs-notfound">
		<ErrorPage
			status={404}
			title="Componente não encontrado"
			description={`Não achei "${name}". Confira o nome na barra lateral.`}
			homeHref="/"
			homeLabel="Ver todos os componentes"
		/>
	</div>
{:else}
	<article class="twui-docs-page">
		<header class="twui-docs-page-header">
			<Eyebrow>{doc.category}</Eyebrow>
			<h1 class="twui-docs-title">{doc.name}</h1>
			<p class="twui-docs-desc">{doc.description}</p>

			<div class="twui-docs-import">
				<pre><code>import &#123; {doc.name} &#125; from '@tabelhadev/tabelhawebui';</code></pre>
			</div>
		</header>

		{#if preview}
			{@const Preview = preview}
			<div class="twui-docs-examples">
				<Preview />
			</div>
		{:else if Component && doc.examples}
			<div class="twui-docs-examples">
				{#each doc.examples as example}
					{@const C = Component}
					<ExampleCard label={example.label} code={example.code}>
						{#if example.children}
							<C {...example.props}>{example.children}</C>
						{:else}
							<C {...example.props} />
						{/if}
					</ExampleCard>
				{/each}
			</div>
		{/if}

		{#if propList.length > 0}
			<section class="twui-docs-api">
				<h2 class="twui-docs-section-title">API</h2>
				<div class="twui-docs-table-wrap">
					<table class="twui-docs-table">
						<thead>
							<tr>
								<th>Prop</th>
								<th>Tipo</th>
								<th>Default</th>
								<th>Required</th>
								<th>Bindable</th>
							</tr>
						</thead>
						<tbody>
							{#each propList as prop}
								<tr>
									<td class="twui-docs-prop-name">{prop.name}</td>
									<td class="twui-docs-prop-type">{prop.type}</td>
									<td>{prop.default ?? '—'}</td>
									<td>{prop.required ? '✓' : ''}</td>
									<td>{prop.bindable ? '✓' : ''}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}
	</article>
{/if}

<style>
	.twui-docs-page {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.twui-docs-notfound {
		display: flex;
		justify-content: center;
		padding: 3rem 0;
	}

	.twui-docs-page-header {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.twui-docs-title {
		margin: 0;
		font-size: 2rem;
		line-height: 1.1;
	}

	.twui-docs-desc {
		margin: 0;
		max-width: 42rem;
		color: var(--twui-ink-soft);
		font-size: 14px;
	}

	.twui-docs-import {
		margin-top: 4px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		align-self: flex-start;
	}

	.twui-docs-import pre {
		margin: 0;
		padding: 8px 12px;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
	}

	.twui-docs-examples {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.twui-docs-section-title {
		margin: 0 0 10px;
		font-size: 13px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--twui-ink-faint);
	}

	.twui-docs-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--twui-rule);
	}

	.twui-docs-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--twui-font-mono);
		font-size: 12px;
	}

	.twui-docs-table th,
	.twui-docs-table td {
		padding: 7px 10px;
		text-align: left;
		border-bottom: 1px solid var(--twui-rule);
		vertical-align: top;
	}

	.twui-docs-table th {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--twui-ink-faint);
		background: var(--twui-paper-raised);
	}

	.twui-docs-table tr:last-child td {
		border-bottom: none;
	}

	.twui-docs-prop-name {
		color: var(--twui-accent);
		white-space: nowrap;
	}

	.twui-docs-prop-type {
		color: var(--twui-ink-soft);
	}
</style>
