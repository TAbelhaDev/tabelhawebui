<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardRoot from '../card/Card.svelte';
	import CardContent from '../card/CardContent.svelte';

	let {
		label,
		value,
		href,
		valueClass = '',
		footer,
		class: className = ''
	}: {
		label: string;
		value: string;
		href?: string;
		valueClass?: string;
		footer?: Snippet;
		class?: string;
	} = $props();
</script>

<CardRoot class="twui-stat-tile {className}">
	<CardContent>
		<p class="twui-stat-tile-label">
			{#if href}
				<a href={href} class="twui-stat-tile-label-link">{label}</a>
			{:else}
				{label}
			{/if}
		</p>
		<p class="twui-stat-tile-value {valueClass}">
			{value}
		</p>
		{#if footer}
			<div class="twui-stat-tile-footer">
				{@render footer()}
			</div>
		{/if}
	</CardContent>
</CardRoot>

<style>
	.twui-stat-tile-label {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 0.75rem;
		color: var(--twui-ink-soft);
	}

	.twui-stat-tile-label-link {
		color: inherit;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.twui-stat-tile-label-link:hover {
		color: var(--twui-accent);
	}

	.twui-stat-tile-value {
		margin-top: 4px;
		margin-bottom: 0;
		font-family: var(--twui-font-mono);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--twui-ink);
	}

	.twui-stat-tile-footer {
		margin-top: 4px;
		font-family: var(--twui-font-mono);
		font-size: 0.75rem;
		color: var(--twui-ink-faint);
	}
</style>
