<script lang="ts">
	import { AppShell } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const code = `<AppShell
	brand={{ prefix: 'TAbelha', suffix: 'RPGDK' }}
	navItems={[
		{ href: '/campaigns', label: 'Campanhas', icon: SwordsIcon },
		{ href: '/community', label: 'Comunidade', icon: UsersIcon },
		{ href: '/downloads', label: 'Downloads', icon: ScrollIcon }
	]}
	currentPath="/campaigns"
	logoutAction="/auth/signout"
>
	{#snippet profile()}
		<a href="/profile">avatar + nome</a>
	{/snippet}
	<!-- conteúdo da página -->
</AppShell>`;

	const navItems = [
		{ href: '#', label: 'Campanhas', icon: campaignsIcon },
		{ href: '#', label: 'Comunidade', icon: communityIcon },
		{ href: '#', label: 'Downloads', icon: downloadsIcon }
	];
</script>

{#snippet campaignsIcon()}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	><path d="M14.5 17.5 3 6V3h3l11.5 11.5" /><path d="M13 19l6-6" /><path d="M16 16l4 4" /><path d="M19 21l2-2" /></svg
	>
{/snippet}

{#snippet communityIcon()}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg
	>
{/snippet}

{#snippet downloadsIcon()}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg
	>
{/snippet}

{#snippet profileIcon()}
	<span class="twui-docs-appshell-avatar">I</span>
{/snippet}

<ExampleCard
	label="Shell autenticado (sidebar ≥ lg, bottom nav < lg)"
	code={code}
	class="twui-docs-appshell-card"
>
	<div class="twui-docs-appshell-frame">
		<AppShell
			brand={{ prefix: 'TAbelha', suffix: 'RPGDK' }}
			{navItems}
			currentPath="/campaigns"
			logoutAction="/auth/signout"
			profile={{ href: '/profile', label: 'Ian', icon: profileIcon }}
		>
			<div class="twui-docs-appshell-page">
				<h3 class="twui-docs-appshell-title">Campanhas</h3>
				<p class="twui-docs-appshell-text">
					Conteúdo da página dentro do container max-w-6xl. A sidebar aparece em
					desktop (≥ 1024px); em telas menores vira bottom nav fixa.
				</p>
			</div>
		</AppShell>
	</div>
</ExampleCard>

<style>
	:global(.twui-docs-appshell-card .twui-docs-example-preview) {
		display: block;
		padding: 0;
	}

	:global(.twui-docs-appshell-frame) {
		position: relative;
		height: 440px;
		overflow: hidden;
	}

	:global(.twui-docs-appshell-frame .twui-appshell) {
		height: 100%;
	}

	:global(.twui-docs-appshell-frame .twui-appshell-sidebar) {
		position: static;
		height: 100%;
	}

	:global(.twui-docs-appshell-frame .twui-appshell-bottomnav) {
		position: absolute;
	}

	.twui-docs-appshell-page {
		padding: 24px;
	}

	.twui-docs-appshell-title {
		margin: 0 0 8px;
		font-size: 20px;
		line-height: 1.2;
	}

	.twui-docs-appshell-text {
		margin: 0;
		max-width: 40rem;
		font-size: 13px;
		line-height: 1.6;
		color: var(--twui-ink-soft);
	}

	.twui-docs-appshell-profile {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.twui-docs-appshell-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--twui-accent);
		color: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 12px;
		font-weight: 700;
	}

	.twui-docs-appshell-name {
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-soft);
	}
</style>
