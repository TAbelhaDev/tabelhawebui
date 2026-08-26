<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardRoot from '../card/Card.svelte';
	import CardHeader from '../card/CardHeader.svelte';
	import CardContent from '../card/CardContent.svelte';

	export interface InstructionStep {
		title?: string;
		content?: Snippet;
		action?: Snippet;
	}

	let {
		steps = [],
		class: className = ''
	}: {
		steps: InstructionStep[];
		class?: string;
	} = $props();
</script>

<div class="twui-instruction-steps {className}">
	{#each steps as step, i}
		<CardRoot class="twui-instruction-step" variant="base">
			<CardHeader class="twui-instruction-step-header">
				{#snippet title()}
					<span class="twui-instruction-step-head">
						<span class="twui-instruction-step-badge">{i + 1}</span>
						{#if step.title}
							<span class="twui-instruction-step-title">{step.title}</span>
						{/if}
					</span>
				{/snippet}
				<!-- Must be a DIRECT child of <CardHeader>: a snippet declared
				     inside an {#if} block is scoped to that block and never
				     reaches the component as its `children` prop. -->
				{#snippet children()}
					{#if step.action}
						{@render step.action()}
					{/if}
				{/snippet}
			</CardHeader>
			{#if step.content}
				<CardContent>
					<div class="twui-instruction-step-content">
						{@render step.content()}
					</div>
				</CardContent>
			{/if}
		</CardRoot>
	{/each}
</div>

<style>
	.twui-instruction-steps {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Header-only step: without the content below, the header's bottom rule
	   would sit right on top of the card's own border. */
	.twui-instruction-step :global(.twui-card-header:last-child) {
		border-bottom: none;
	}

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

	.twui-instruction-step-content {
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-soft);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
