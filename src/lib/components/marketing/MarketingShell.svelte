<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import ThemeToggle from '../navigation/ThemeToggle.svelte';
	import Wordmark from '../layout/Wordmark.svelte';
	import MarketingShellFooter from './MarketingShellFooter.svelte';

	let {
		prefix = 'Tabela',
		suffix = '',
		brandHref = '/',
		header,
		actions,
		nav,
		children,
		footerLinks = [],
		footerLicense,
		footerRepoUrl,
		class: className = ''
	}: {
		prefix?: string;
		suffix?: string;
		brandHref?: string;
		header?: Snippet;
		actions?: Snippet;
		nav?: { href: string; label: string }[];
		children: Snippet;
		footerLinks?: { href: string; label: string }[];
		footerLicense?: string;
		footerRepoUrl?: string;
		class?: string;
	} = $props();

	const isActive = (href: string) =>
		href === '/'
			? page.url.pathname === '/'
			: page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<div class="twui-ms {className}">
	<header class="twui-ms-header">
		<div class="twui-ms-header-inner">
			<a href={brandHref} class="twui-ms-brand-link">
				<Wordmark {prefix} {suffix} />
			</a>
			{#if header}
				<div class="twui-ms-header-mid">{@render header()}</div>
			{:else if nav}
				<nav class="twui-ms-nav">
					{#each nav as item (item.href)}
						<a
							href={item.href}
							class="twui-ms-nav-link"
							class:twui-ms-nav-link-active={isActive(item.href)}
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					{/each}
				</nav>
			{/if}
			<div class="twui-ms-header-end">
				{#if actions}
					<div class="twui-ms-actions">{@render actions()}</div>
				{/if}
				<ThemeToggle />
			</div>
		</div>
	</header>
	<main class="twui-ms-main">
		{@render children()}
	</main>
	<MarketingShellFooter
		{prefix}
		{suffix}
		license={footerLicense}
		repoUrl={footerRepoUrl}
		links={footerLinks}
	/>
</div>

<style>
	.twui-ms {
		display: flex;
		margin: 0 auto;
		width: 100%;
		max-width: 64rem;
		min-height: 100svh;
		flex-direction: column;
		border-left: 1px solid var(--twui-rule);
		border-right: 1px solid var(--twui-rule);
	}

	.twui-ms-header {
		position: sticky;
		top: 0;
		z-index: 40;
		border-bottom: 1px solid var(--twui-rule);
		background: color-mix(in srgb, var(--twui-paper) 60%, transparent);
		backdrop-filter: blur(8px);
	}

	.twui-ms-header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 0 24px;
		height: 56px;
	}

	.twui-ms-brand-link {
		font-family: var(--twui-font-mono);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: -0.02em;
		text-decoration: none;
		white-space: nowrap;
	}

	.twui-ms-header-mid {
		display: flex;
		flex: 1;
		justify-content: center;
	}

	.twui-ms-nav {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		gap: 16px;
		font-family: var(--twui-font-mono);
		font-size: 14px;
	}

	.twui-ms-nav-link {
		color: var(--twui-ink-soft);
		text-decoration: none;
	}

	.twui-ms-nav-link:hover {
		color: var(--twui-ink);
	}

	.twui-ms-nav-link-active {
		color: var(--twui-accent-ink);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--twui-accent);
	}

	.twui-ms-header-end {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.twui-ms-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.twui-ms-main {
		display: flex;
		flex: 1;
		flex-direction: column;
	}
</style>
