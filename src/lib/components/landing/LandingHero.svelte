<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow,
		title,
		lead,
		actions,
		note,
		class: className = ''
	}: {
		eyebrow?: string;
		title?: string | Snippet;
		lead?: string;
		actions?: Snippet;
		note?: string;
		class?: string;
	} = $props();
</script>

<section class="twui-landing-hero {className}">
	{#if eyebrow}
		<div class="twui-landing-eyebrow">{eyebrow}</div>
	{/if}
	<h1 class="twui-landing-hero-title">
		{#if typeof title === 'function'}
			{@render title()}
		{:else}
			{title}
		{/if}
	</h1>
	{#if lead}
		<p class="twui-landing-hero-lead">{lead}</p>
	{/if}
	{#if actions}
		<div class="twui-landing-hero-actions">{@render actions()}</div>
	{/if}
	{#if note}
		<p class="twui-landing-hero-note">{note}</p>
	{/if}
</section>

<style>
	.twui-landing-eyebrow {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--twui-accent);
	}

	.twui-landing-hero-title {
		margin: 16px 0 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 40px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-wrap: balance;
		color: var(--twui-ink);
	}

	.twui-landing-hero-lead {
		margin: 16px 0 0;
		max-width: 36rem;
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 18px;
		line-height: 1.6;
		color: var(--twui-ink-soft);
	}

	.twui-landing-hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 24px;
	}

	.twui-landing-hero-note {
		margin: 16px 0 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-faint);
	}
</style>
