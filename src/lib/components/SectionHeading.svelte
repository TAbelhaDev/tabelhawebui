<script lang="ts">
	let {
		eyebrow,
		title,
		lead,
		class: className = ''
	}: {
		eyebrow: string;
		title: string;
		lead?: string;
		class?: string;
	} = $props();
</script>

<div class="twui-section-heading {className}">
	<div class="twui-landing-eyebrow">{eyebrow}</div>
	<h2 class="twui-section-heading-title">{title}</h2>
	{#if lead}
		<p class="twui-section-heading-lead">{lead}</p>
	{/if}
</div>

<style>
	.twui-landing-eyebrow {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--twui-accent);
	}

	.twui-section-heading-title {
		margin: 12px 0 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.01em;
		text-wrap: balance;
		color: var(--twui-ink);
	}

	.twui-section-heading-lead {
		margin: 12px 0 0;
		max-width: 36rem;
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 17px;
		line-height: 1.6;
		color: var(--twui-ink-soft);
	}
</style>
