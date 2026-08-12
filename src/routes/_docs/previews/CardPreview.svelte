<script lang="ts">
	import { Card } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const code = `<Card>
	<Card.Header>
		<Card.Title>Resumo</Card.Title>
		<Card.Description>agosto/2026</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>R$ 3.180,42 em 42 lançamentos.</p>
	</Card.Content>
	<Card.Footer>
		<Button variant="primary">Nova transação</Button>
	</Card.Footer>
</Card>`;
</script>

<ExampleCard label="Composta (Header / Title / Content / Footer)" code={code}>
	<div class="twui-docs-card-stack">
		<Card>
			<Card.Header>
				<Card.Title>Resumo</Card.Title>
				<Card.Description>agosto/2026</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="twui-docs-muted">R$ 3.180,42 em 42 lançamentos.</p>
			</Card.Content>
			<Card.Footer>
				<button type="button" class="twui-docs-btn">Nova transação</button>
			</Card.Footer>
		</Card>
	</div>
</ExampleCard>

<style>
	.twui-docs-card-stack {
		width: 100%;
		max-width: 22rem;
	}

	.twui-docs-muted {
		margin: 0;
		color: var(--twui-ink-soft);
		font-size: 14px;
	}

	.twui-docs-btn {
		padding: 6px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-docs-btn:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}
</style>
