<script lang="ts">
	import { Dropdown } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const code = `<Dropdown trigger={trigger} align="right">
	{#snippet children()}
		<a href="#">Editar</a>
		<a href="#">Excluir</a>
	{/snippet}
</Dropdown>`;
</script>

{#snippet trigger()}
	<button type="button" class="twui-docs-drop-trigger">Ações ▾</button>
{/snippet}

{#snippet menu()}
	<div class="twui-docs-drop-menu">
		<button type="button">Editar</button>
		<button type="button">Duplicar</button>
		<button type="button" class="twui-docs-drop-danger">Excluir</button>
	</div>
{/snippet}

<ExampleCard label="Menu que fecha por fora/Esc" code={code}>
	<Dropdown {trigger}>{@render menu()}</Dropdown>
</ExampleCard>

<style>
	.twui-docs-drop-trigger {
		padding: 6px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-docs-drop-trigger:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-docs-drop-menu {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 9rem;
	}

	.twui-docs-drop-menu button {
		border: none;
		background: transparent;
		padding: 6px 8px;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
		text-align: left;
		cursor: pointer;
	}

	.twui-docs-drop-menu button:hover {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}

	.twui-docs-drop-danger:hover {
		background: color-mix(in srgb, var(--twui-danger) 12%, transparent);
		color: var(--twui-danger);
	}
</style>
