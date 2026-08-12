<script lang="ts">
	import '$lib/theme/theme.css';
	import { page } from '$app/state';
	import { Input, ThemeToggle } from '$lib';
	import { components } from './_docs/registry';

	// The library ships as a package (build = svelte-package), so these routes
	// never reach npm. They host the component showcase: one page per component,
	// sidebar grouped by category, live previews in both themes.

	let { children } = $props();
	let query = $state('');
	let mobileOpen = $state(false);

	const categories = $derived.by(() => {
		const map = new Map<string, typeof components>();
		for (const c of components) {
			if (query && !c.name.toLowerCase().includes(query.toLowerCase())) continue;
			const arr = map.get(c.category) ?? [];
			arr.push(c);
			map.set(c.category, arr);
		}
		return [...map.entries()];
	});

	const currentName = $derived(page.params.name?.toLowerCase());
</script>

<div class="twui-docs-shell">
	<header class="twui-docs-topbar">
		<button
			type="button"
			class="twui-docs-burger"
			aria-label="Abrir navegação"
			aria-expanded={mobileOpen}
			onclick={() => (mobileOpen = !mobileOpen)}
		>
			<span></span><span></span><span></span>
		</button>
		<a href="/" class="twui-docs-brand">
			<span class="twui-docs-brand-name">tabela<span class="twui-docs-brand-accent">web</span>ui</span>
			<span class="twui-docs-brand-sub">componentes</span>
		</a>
		<div class="twui-docs-topbar-spacer"></div>
		<ThemeToggle />
	</header>

	<div class="twui-docs-body">
		<aside class:twui-docs-sidebar-open={mobileOpen} class="twui-docs-sidebar">
			{#if mobileOpen}
				<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
				<div class="twui-docs-sidebar-overlay" onclick={() => (mobileOpen = false)}></div>
			{/if}
			<div class="twui-docs-sidebar-inner">
				<div class="twui-docs-search">
					<Input
						placeholder="Buscar componente…"
						bind:value={query}
						aria-label="Buscar componente"
					/>
				</div>

				<nav class="twui-docs-nav" aria-label="Componentes">
					{#each categories as [category, items]}
						<div class="twui-docs-nav-group">
							<span class="twui-docs-nav-cat">{category}</span>
							<ul>
								{#each items as c}
									<li>
										<a
											href={`/components/${c.name}`}
											class="twui-docs-nav-link {currentName === c.name.toLowerCase() ? 'twui-docs-nav-link-active' : ''}"
											onclick={() => (mobileOpen = false)}
										>
											{c.name}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</nav>
			</div>
		</aside>

		<main class="twui-docs-main">
			{@render children()}
		</main>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: var(--twui-paper);
		color: var(--twui-ink);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
	}

	.twui-docs-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.twui-docs-topbar {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 52px;
		padding: 0 16px;
		border-bottom: 1px solid var(--twui-rule);
		background: var(--twui-paper);
	}

	.twui-docs-burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
		width: 34px;
		height: 34px;
		padding: 0;
		border: 1px solid var(--twui-rule);
		background: transparent;
		cursor: pointer;
	}

	.twui-docs-burger span {
		display: block;
		height: 1px;
		background: var(--twui-ink);
		margin: 0 8px;
	}

	.twui-docs-brand {
		display: flex;
		align-items: baseline;
		gap: 8px;
		text-decoration: none;
	}

	.twui-docs-brand-name {
		font-size: 14px;
		font-weight: 700;
		color: var(--twui-ink);
	}

	.twui-docs-brand-accent {
		color: var(--twui-accent);
	}

	.twui-docs-brand-sub {
		font-size: 11px;
		color: var(--twui-ink-faint);
	}

	.twui-docs-topbar-spacer {
		flex: 1;
	}

	.twui-docs-body {
		display: flex;
		align-items: flex-start;
		flex: 1;
	}

	.twui-docs-sidebar {
		position: sticky;
		top: 52px;
		align-self: flex-start;
		width: 240px;
		flex-shrink: 0;
		height: calc(100vh - 52px);
		overflow-y: auto;
		border-right: 1px solid var(--twui-rule);
		background: var(--twui-paper);
	}

	.twui-docs-sidebar-inner {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.twui-docs-search {
		position: sticky;
		top: 0;
		background: var(--twui-paper);
		padding-bottom: 4px;
		z-index: 1;
	}

	.twui-docs-nav {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.twui-docs-nav-group ul {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.twui-docs-nav-cat {
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--twui-ink-faint);
	}

	.twui-docs-nav-link {
		display: block;
		padding: 4px 8px;
		font-size: 13px;
		color: var(--twui-ink-soft);
		text-decoration: none;
		border-radius: 2px;
	}

	.twui-docs-nav-link:hover {
		color: var(--twui-ink);
		background: var(--twui-paper-raised);
	}

	.twui-docs-nav-link-active {
		color: var(--twui-accent);
		background: var(--twui-accent-soft);
	}

	.twui-docs-main {
		flex: 1;
		min-width: 0;
		padding: 32px 28px 80px;
		max-width: 60rem;
	}

	.twui-docs-sidebar-overlay {
		display: none;
	}

	@media (max-width: 768px) {
		.twui-docs-burger {
			display: flex;
		}

		.twui-docs-sidebar {
			position: fixed;
			top: 52px;
			left: 0;
			bottom: 0;
			z-index: 40;
			height: auto;
			transform: translateX(-100%);
			transition: transform 0.18s ease;
			box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		}

		.twui-docs-sidebar-open {
			transform: translateX(0);
		}

		.twui-docs-sidebar-overlay {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.4);
			z-index: 30;
		}

		.twui-docs-main {
			padding: 20px 16px 60px;
		}
	}
</style>
