<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import CardRoot from '../card/Card.svelte';
	import CardHeader from '../card/CardHeader.svelte';
	import CardContent from '../card/CardContent.svelte';

	let {
		title,
		action,
		n,
		children
	}: {
		title?: string;
		action?: Snippet;
		n?: number;
		children: Snippet;
	} = $props();

	const register = getContext<(() => number) | undefined>('twui-instruction-step');
	const stepNumber = n ?? (register ? register() : 1);
</script>

<CardRoot class="twui-instruction-step" variant="base">
	<CardHeader class="twui-instruction-step-header">
		{#snippet title()}
			<span class="twui-instruction-step-head">
				<span class="twui-instruction-step-badge">{stepNumber}</span>
				{#if title}
					<span class="twui-instruction-step-title">{title}</span>
				{/if}
			</span>
		{/snippet}
		<!-- Must be a DIRECT child of <CardHeader>: a snippet declared
		     inside an {#if} block is scoped to that block and never
		     reaches the component as its `children` prop. -->
		{#snippet children()}
			{#if action}
				{@render action()}
			{/if}
		{/snippet}
	</CardHeader>
	<CardContent>
		<div class="twui-instruction-step-content">
			{@render children()}
		</div>
	</CardContent>
</CardRoot>

<style>
	.twui-instruction-step-head {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.twui-instruction-step-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		border: 1px solid var(--twui-accent);
		background: color-mix(in oklab, var(--twui-accent) 10%, transparent);
		font-family: var(--twui-font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--twui-accent);
	}

	.twui-instruction-step-title {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	/* Block (not flex column) so inline <code>/<kbd>/<a> flow normally
	   instead of each becoming its own full-width line. */
	.twui-instruction-step-content {
		font-size: 13px;
		color: var(--twui-ink-soft);
	}

	.twui-instruction-step-content > * + * {
		margin-top: 8px;
	}

	/* Only bare <code>/<kbd>/<a> (no class) get auto-styled, so callers
	   can still opt out with their own classes (e.g. the token display box). */
	.twui-instruction-step-content :global(code:not([class])),
	.twui-instruction-step-content :global(kbd:not([class])) {
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		padding: 1px 4px;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		border-radius: 4px;
		color: var(--twui-ink);
	}

	.twui-instruction-step-content :global(a:not([class])) {
		color: var(--twui-accent);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.twui-instruction-step-content :global(a:not([class])):hover {
		opacity: 0.8;
	}

	.twui-instruction-step-content :global(strong) {
		color: var(--twui-ink);
		font-weight: 600;
	}
</style>
