<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		logo,
		items = [],
		trailing,
		class: className = ''
	}: {
		logo?: Snippet;
		items?: { href: string; label: string; current?: boolean }[];
		trailing?: Snippet;
		class?: string;
	} = $props();
</script>

<header class="twui-nav {className}">
	<div class="twui-nav-top">
		{#if logo}
			<div class="twui-nav-logo">{@render logo()}</div>
		{/if}
		{#if trailing}
			<div class="twui-nav-trailing">{@render trailing()}</div>
		{/if}
	</div>
	{#if items.length > 0}
		<nav class="twui-nav-links">
			{#each items as item, i (item.href)}
				{#if i > 0}
					<span class="twui-nav-sep" aria-hidden="true">/</span>
				{/if}
				<a
					href={item.href}
					class="twui-nav-link {item.current ? 'twui-nav-link-current' : ''}"
					aria-current={item.current ? 'page' : undefined}
					>{item.label}</a
				>
			{/each}
		</nav>
	{/if}
</header>

<style>
	.twui-nav {
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-nav-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 20px;
	}

	.twui-nav-logo {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		color: var(--twui-ink);
	}

	.twui-nav-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 4px;
		row-gap: 8px;
		padding: 0 20px 16px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
	}

	.twui-nav-sep {
		padding: 0 8px;
		color: var(--twui-ink-faint);
		user-select: none;
	}

	.twui-nav-link {
		color: var(--twui-ink-soft);
		transition: color 0.15s ease;
	}

	.twui-nav-link:hover {
		color: var(--twui-accent);
	}

	.twui-nav-link-current {
		color: var(--twui-accent);
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
	}
</style>
