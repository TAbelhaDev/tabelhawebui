<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		status,
		title,
		description = '',
		homeHref = '/',
		homeLabel = 'Voltar ao início',
		actions,
		class: className = ''
	}: {
		status: number;
		title: string;
		description?: string;
		homeHref?: string;
		homeLabel?: string;
		actions?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-error-page {className}">
	<div class="twui-error-code" aria-hidden="true">{status}</div>
	<h1 class="twui-error-title">{title}</h1>
	{#if description}
		<p class="twui-error-description">{description}</p>
	{/if}
	<div class="twui-error-actions">
		<a class="twui-error-home" href={homeHref}>{homeLabel}</a>
		{#if actions}
			{@render actions()}
		{/if}
	</div>
</div>

<style>
	.twui-error-page {
		display: flex;
		min-height: 100svh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 24px;
		text-align: center;
		background: var(--twui-paper);
	}

	.twui-error-code {
		font-family: var(--twui-font-mono);
		font-size: 88px;
		font-weight: 700;
		line-height: 1;
		color: var(--twui-accent);
	}

	.twui-error-title {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 16px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-error-description {
		margin: 0;
		max-width: 420px;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-soft);
	}

	.twui-error-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 12px;
	}

	.twui-error-home {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--twui-accent);
		background: var(--twui-accent);
		padding: 8px 16px;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-paper);
		text-decoration: none;
		cursor: pointer;
	}

	.twui-error-home:hover {
		opacity: 0.85;
	}
</style>
