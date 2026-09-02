<script lang="ts">
	import { Nav, ThemeToggle } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const code = `<Nav
	logo={logo}
	items={[
		{ href: '/', label: 'Home' },
		{ href: '/contas', label: 'Contas', current: true },
		{ href: '/relatorios', label: 'Relatórios' }
	]}
/>`;
</script>

{#snippet logo()}
	<span class="twui-docs-nav-logo">tabelha<span style="color: var(--twui-accent);">fin</span></span>
{/snippet}

{#snippet trailing()}
	<ThemeToggle />
{/snippet}

<ExampleCard label="Logo + breadcrumb de links" code={code}>
	<Nav
		logo={logo}
		items={[
			{ href: '#', label: 'Home' },
			{ href: '#', label: 'Contas', current: true },
			{ href: '#', label: 'Relatórios' }
		]}
		{trailing}
	/>
</ExampleCard>

<style>
	.twui-docs-nav-logo {
		font-family: var(--twui-font-mono);
		font-size: 14px;
		font-weight: 700;
		color: var(--twui-ink);
	}
</style>
