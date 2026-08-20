<script lang="ts">
	import { isPathActive } from './utils';
	import type { AppShellNavItem } from './types';

	let {
		navItems = [],
		currentPath = '',
		class: className = ''
	}: {
		navItems?: AppShellNavItem[];
		currentPath?: string;
		class?: string;
	} = $props();
</script>

<nav class="twui-appshell-bottomnav {className}" aria-label="Navegação principal">
	{#each navItems as item (item.href)}
		{@const active = isPathActive(currentPath, item.href)}
		<a
			href={item.href}
			class="twui-appshell-bottomnav-item {active ? 'twui-appshell-bottomnav-item-active' : ''}"
			aria-current={active ? 'page' : undefined}
		>
			{#if item.icon}{@render item.icon()}{/if}
			<span>{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.twui-appshell-bottomnav {
		position: fixed;
		inset-inline: 0;
		bottom: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 8px 0;
		border-top: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
	}

	@media (min-width: 1024px) {
		.twui-appshell-bottomnav {
			display: none;
		}
	}

	.twui-appshell-bottomnav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 4px 16px;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		line-height: 1.2;
		color: var(--twui-ink-soft);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.twui-appshell-bottomnav-item-active {
		color: var(--twui-accent);
	}
</style>
