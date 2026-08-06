<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		trigger,
		children,
		align = 'right',
		class: className = ''
	}: {
		trigger: Snippet;
		children: Snippet;
		align?: 'left' | 'right';
		class?: string;
	} = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | undefined>();

	// Fecha com pointerdown fora do componente ou com Esc.
	function closeOnOutside(node: HTMLElement, callback: () => void) {
		function onPointer(e: PointerEvent) {
			if (!node.contains(e.target as Node)) callback();
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') callback();
		}
		document.addEventListener('pointerdown', onPointer);
		document.addEventListener('keydown', onKey);
		return {
			destroy() {
				document.removeEventListener('pointerdown', onPointer);
				document.removeEventListener('keydown', onKey);
			}
		};
	}
</script>

<div class="twui-dropdown {className}" bind:this={rootEl} use:closeOnOutside={() => (open = false)}>
	<button
		type="button"
		class="twui-dropdown-trigger"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		{@render trigger()}
	</button>
	{#if open}
		<ul
			class="twui-dropdown-menu {align === 'left' ? 'twui-dropdown-menu-left' : 'twui-dropdown-menu-right'}"
			role="menu"
		>
			{@render children()}
		</ul>
	{/if}
</div>

<style>
	.twui-dropdown {
		position: relative;
	}

	.twui-dropdown-trigger {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0;
		border: none;
		background: transparent;
		font-family: inherit;
		font-size: 14px;
		color: var(--twui-ink-soft);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-dropdown-trigger:hover {
		color: var(--twui-accent);
	}

	.twui-dropdown-menu {
		position: absolute;
		top: 100%;
		z-index: 10;
		margin-top: 8px;
		min-width: 10rem;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		padding: 4px 0;
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		list-style: none;
	}

	.twui-dropdown-menu-right {
		right: 0;
	}

	.twui-dropdown-menu-left {
		left: 0;
	}

	.twui-dropdown-menu > :global(li),
	.twui-dropdown-menu > :global(a),
	.twui-dropdown-menu > :global(button) {
		display: block;
		width: 100%;
		border: none;
		background: transparent;
		padding: 6px 12px;
		text-align: left;
		font-family: inherit;
		font-size: 14px;
		white-space: nowrap;
		color: var(--twui-ink);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.twui-dropdown-menu > :global(li:hover),
	.twui-dropdown-menu > :global(a:hover),
	.twui-dropdown-menu > :global(button:hover) {
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}
</style>
