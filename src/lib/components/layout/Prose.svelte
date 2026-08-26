<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="twui-prose">
	{@render children()}
</div>

<style>
	.twui-prose {
		max-width: none;
		color: var(--twui-ink);
		font-family: var(--twui-font-serif, 'Newsreader', serif);
		font-size: 1.05rem;
		line-height: 1.625;
		text-align: justify;
		hyphens: auto;
	}

	.twui-prose :global(h1),
	.twui-prose :global(h2),
	.twui-prose :global(h3),
	.twui-prose :global(h4) {
		color: var(--twui-ink);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		letter-spacing: -0.02em;
		line-height: 1.2;
		margin: 1.6em 0 0.5em;
	}

	.twui-prose :global(h2)::before {
		content: '// ';
		color: var(--twui-ink-faint);
	}

	.twui-prose :global(p) {
		margin: 0 0 1em;
	}

	.twui-prose :global(a) {
		color: var(--twui-accent-ink);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--twui-accent);
	}

	.twui-prose :global(ul),
	.twui-prose :global(ol) {
		margin: 0 0 1em;
		padding-left: 1.4em;
	}

	.twui-prose :global(li) {
		margin: 0.3em 0;
	}

	.twui-prose :global(code) {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 0.9em;
		color: var(--twui-accent-ink);
		background: color-mix(in oklab, var(--twui-accent) 10%, transparent);
		padding: 0.1em 0.35em;
		border-radius: 4px;
	}

	.twui-prose :global(pre) {
		background: color-mix(in oklab, var(--twui-ink) 6%, var(--twui-paper));
		border: 1px solid var(--twui-rule);
		border-radius: 8px;
		padding: 1em;
		overflow: auto;
		margin: 0 0 1em;
	}

	.twui-prose :global(pre code) {
		background: none;
		padding: 0;
		color: var(--twui-ink);
		font-size: 0.85em;
	}

	.twui-prose :global(blockquote) {
		margin: 0 0 1em;
		padding-left: 1em;
		border-left: 2px solid var(--twui-rule);
		color: var(--twui-ink-soft);
	}

	.twui-prose :global(strong) {
		color: var(--twui-ink);
		font-weight: 700;
	}

	.twui-prose :global(hr) {
		border: none;
		border-top: 1px solid var(--twui-rule);
		margin: 1.5em 0;
	}
</style>
