<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../actions/Button.svelte';

	let {
		title,
		subtitle,
		prefix,
		action,
		back,
		class: className = ''
	}: {
		title: string;
		subtitle?: Snippet | string;
		prefix?: Snippet;
		action?: Snippet;
		back?: { label: string; href: string };
		class?: string;
	} = $props();

	const subtitleSnippet = $derived(typeof subtitle === 'function' ? (subtitle as Snippet) : null);
</script>

<header class="twui-page-header {className}">
	<div class="twui-page-header-text">
		<h1 class="twui-page-header-title">{title}</h1>
		{#if subtitle}
			<p class="twui-page-header-subtitle">
				{#if prefix}
					{@render prefix()}
				{:else}
					<span class="twui-page-header-prefix">//</span>
				{/if}
				{#if subtitleSnippet}
					{@render subtitleSnippet()}
				{:else}
					{subtitle}
				{/if}
			</p>
		{/if}
	</div>
	{#if action || back}
		<div class="twui-page-header-action">
			{#if action}
				{@render action()}
			{/if}
			{#if back}
				<Button href={back.href} variant="ghost" size="sm" class="-ml-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-4"
						aria-hidden="true"
					>
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
					{back.label}
				</Button>
			{/if}
		</div>
	{/if}
</header>

<style>
	.twui-page-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	.twui-page-header-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.twui-page-header-title {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--twui-ink);
	}

	.twui-page-header-subtitle {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 0.875rem;
		color: var(--twui-ink-soft);
	}

	.twui-page-header-prefix {
		color: var(--twui-ink-faint);
	}

	.twui-page-header-action {
		flex-shrink: 0;
	}
</style>
