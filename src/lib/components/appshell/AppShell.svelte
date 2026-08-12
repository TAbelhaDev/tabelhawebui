<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppShellSidebar from './AppShellSidebar.svelte';
	import AppShellBottomNav from './AppShellBottomNav.svelte';
	import AppShellContent from './AppShellContent.svelte';
	import type { AppShellNavItem } from './types';

	let {
		brand = { prefix: 'Tabela', suffix: '' },
		navItems = [],
		currentPath = '',
		logoutAction = '',
		profile,
		children,
		class: className = ''
	}: {
		brand?: { prefix: string; suffix: string };
		navItems?: AppShellNavItem[];
		currentPath?: string;
		logoutAction?: string;
		profile?: Snippet;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-appshell {className}">
	<AppShellSidebar {brand} {navItems} {currentPath} {logoutAction} {profile} />
	<div class="twui-appshell-body">
		<AppShellContent>{@render children()}</AppShellContent>
	</div>
	<AppShellBottomNav {navItems} {currentPath} />
</div>

<style>
	.twui-appshell {
		display: flex;
		min-height: 100svh;
	}

	.twui-appshell-body {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
	}
</style>
