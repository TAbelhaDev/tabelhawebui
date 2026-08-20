<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface InstructionStep {
		title?: string;
		content?: Snippet;
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
		<div class="twui-instruction-step">
			<span class="twui-instruction-step-badge">{i + 1}</span>
			<div class="twui-instruction-step-body">
				{#if step.title}
					<h3 class="twui-instruction-step-title">{step.title}</h3>
				{/if}
				{#if step.content}
					<div class="twui-instruction-step-content">
						{@render step.content()}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.twui-instruction-steps {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.twui-instruction-step {
		display: flex;
		gap: 12px;
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

	.twui-instruction-step-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
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
	}
</style>
