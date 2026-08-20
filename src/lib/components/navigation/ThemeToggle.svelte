<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	let {
		labels = { light: 'Usar tema claro', dark: 'Usar tema escuro' },
		icons,
		showLabel = false,
		label = { light: 'Tema claro', dark: 'Tema escuro' },
		class: className = ''
	}: {
		labels?: { light: string; dark: string };
		icons?: { sun: Snippet; moon: Snippet };
		showLabel?: boolean;
		label?: { light: string; dark: string };
		class?: string;
	} = $props();

	let dark = $state(false);

	onMount(() => {
		const el = document.documentElement;
		dark = el.getAttribute('data-theme') === 'dark' || el.classList.contains('dark');
	});

	function toggle() {
		dark = !dark;
		const el = document.documentElement;
		el.setAttribute('data-theme', dark ? 'dark' : 'light');
		el.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
</script>

<button
	type="button"
	class="twui-theme-toggle {showLabel ? 'twui-theme-toggle-labeled' : ''} {className}"
	aria-label={dark ? labels.light : labels.dark}
	onclick={toggle}
>
	{#if dark}
		{#if icons?.sun}
			{@render icons.sun()}
		{:else}
			<svg
				class="twui-theme-toggle-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4"></circle>
				<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
			</svg>
		{/if}
	{:else}
		{#if icons?.moon}
			{@render icons.moon()}
		{:else}
			<svg
				class="twui-theme-toggle-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
			</svg>
		{/if}
	{/if}
	{#if showLabel}
		<span class="twui-theme-toggle-label-text">{dark ? label.light : label.dark}</span>
	{/if}
</button>

<style>
	.twui-theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		color: var(--twui-ink-soft);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-theme-toggle:hover {
		color: var(--twui-accent);
	}

	.twui-theme-toggle-labeled {
		width: auto;
		height: auto;
		gap: 8px;
		padding: 6px 10px;
	}

	.twui-theme-toggle-label-text {
		font-family: var(--twui-font-mono);
		font-size: 14px;
		line-height: 1;
		white-space: nowrap;
	}

	.twui-theme-toggle-icon {
		width: 16px;
		height: 16px;
	}
</style>
