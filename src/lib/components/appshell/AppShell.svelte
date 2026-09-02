<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppShellSidebar from './AppShellSidebar.svelte';
	import AppShellBottomNav from './AppShellBottomNav.svelte';
	import AppShellContent from './AppShellContent.svelte';
	import type { AppShellNavItem } from './types';

	let {
		brand = { prefix: 'TAbelha', suffix: '' },
		navItems = [],
		currentPath = '',
		logoutAction = '',
		profile,
		children,
		pad = true,
		class: className = ''
	}: {
		brand?: { prefix?: string; suffix?: string };
		navItems?: AppShellNavItem[];
		currentPath?: string;
		logoutAction?: string;
		profile?: AppShellNavItem;
		children: Snippet;
		/** When false, the content area skips its built-in padding. */
		pad?: boolean;
		class?: string;
	} = $props();
</script>

<div class="twui-appshell {className}">
	<AppShellSidebar {brand} {navItems} {currentPath} {logoutAction} {profile} />
	<div class="twui-appshell-body">
		<AppShellContent {pad}>{@render children()}</AppShellContent>
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
