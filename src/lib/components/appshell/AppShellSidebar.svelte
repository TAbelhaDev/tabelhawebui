<script lang="ts">
	import Wordmark from '../layout/Wordmark.svelte';
	import ThemeToggle from '../navigation/ThemeToggle.svelte';
	import { isPathActive } from './utils';
	import type { AppShellNavItem } from './types';

		let {
		brand = { prefix: 'TAbelha', suffix: '' },
		navItems = [],
		currentPath = '',
		logoutAction = '',
		profile,
		class: className = ''
	}: {
		brand?: { prefix?: string; suffix?: string };
		navItems?: AppShellNavItem[];
		currentPath?: string;
		logoutAction?: string;
		profile?: AppShellNavItem;
		class?: string;
	} = $props();
</script>

<aside class="twui-appshell-sidebar {className}">
	<div class="twui-appshell-sidebar-brand">
		<a href="/" class="twui-appshell-sidebar-brand-link" aria-label="Ir para o início">
			<Wordmark prefix={brand.prefix} suffix={brand.suffix} />
		</a>
	</div>
	<div class="twui-appshell-sidebar-sep" role="presentation"></div>
	<nav class="twui-appshell-sidebar-nav" aria-label="Navegação principal">
		{#each navItems as item (item.href)}
			{@const active = isPathActive(currentPath, item.href)}
			<a
				href={item.href}
				class="twui-appshell-nav-item {active ? 'twui-appshell-nav-item-active' : ''}"
				aria-current={active ? 'page' : undefined}
			>
				{#if item.icon}{@render item.icon()}{/if}
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
	<div class="twui-appshell-sidebar-sep" role="presentation"></div>
	<div class="twui-appshell-sidebar-footer">
		{#if profile}
			{@const active = isPathActive(currentPath, profile.href)}
			<a
				href={profile.href}
				class="twui-appshell-nav-item twui-appshell-sidebar-profile {active
					? 'twui-appshell-nav-item-active'
					: ''}"
				aria-current={active ? 'page' : undefined}
			>
				{#if profile.icon}{@render profile.icon()}{/if}
				<span>{profile.label}</span>
			</a>
		{/if}
		<ThemeToggle showLabel class="twui-appshell-sidebar-theme" />
		{#if logoutAction}
			<form method="POST" action={logoutAction} class="twui-appshell-sidebar-logout-form">
				<button type="submit" class="twui-appshell-sidebar-logout">
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
					>
						<path d="M12 2v10" />
						<path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
					</svg>
					<span>Sair</span>
				</button>
			</form>
		{/if}
	</div>
</aside>

<style>
	.twui-appshell-sidebar {
		display: none;
		flex-direction: column;
		position: sticky;
		top: 0;
		height: 100svh;
		width: 15rem;
		flex-shrink: 0;
		border-right: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	@media (min-width: 1024px) {
		.twui-appshell-sidebar {
			display: flex;
		}
	}

	.twui-appshell-sidebar-brand {
		padding: 20px 20px 16px;
	}

	.twui-appshell-sidebar-brand-link {
		text-decoration: none;
	}

	.twui-appshell-sidebar-sep {
		border-top: 1px solid var(--twui-rule);
	}

	.twui-appshell-sidebar-nav {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
		padding: 16px 12px;
		overflow-y: auto;
	}

	.twui-appshell-nav-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 6px 8px;
		border-left: 2px solid transparent;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		line-height: 1.4;
		color: var(--twui-ink-soft);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.twui-appshell-nav-item:hover {
		color: var(--twui-ink);
	}

	.twui-appshell-nav-item-active {
		border-left-color: var(--twui-accent);
		color: var(--twui-accent);
		font-weight: 500;
	}

	.twui-appshell-nav-item-active:hover {
		color: var(--twui-accent);
	}

	.twui-appshell-sidebar-footer {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px 12px;
	}

	.twui-appshell-sidebar-profile {
		display: flex;
	}

	.twui-appshell-sidebar-logout-form {
		margin: 0;
	}

	.twui-appshell-sidebar-logout {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 6px 8px;
		border: none;
		border-left: 2px solid transparent;
		background: transparent;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		line-height: 1.4;
		color: var(--twui-danger);
		text-align: left;
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-appshell-sidebar-logout:hover {
		color: var(--twui-ink);
	}

	:global(.twui-appshell-sidebar .twui-appshell-sidebar-footer .twui-appshell-sidebar-theme) {
		width: 100%;
		justify-content: flex-start;
		gap: 12px;
		padding: 6px 8px;
		border-left: 2px solid transparent;
	}
</style>
