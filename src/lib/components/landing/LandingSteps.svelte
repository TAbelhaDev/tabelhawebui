<script lang="ts">
	import Card from '../card/Card.svelte';
	import CardContent from '../card/CardContent.svelte';

	let {
		steps,
		justify = false,
		class: className = ''
	}: {
		steps: Array<{ number: string; color: string; title: string; body: string }>;
		justify?: boolean;
		class?: string;
	} = $props();
</script>

<ol class="twui-landing-steps {className}">
	{#each steps as step (step.number)}
		<li class="twui-landing-step">
			<Card>
				<CardContent>
					<div
						class="twui-landing-step-number"
						style="background:color-mix(in srgb, {step.color} 12%, transparent); color:{step.color}"
					>
						{step.number}
					</div>
					<h3 class="twui-landing-step-title">{step.title}</h3>
					<p class="twui-landing-step-body {justify ? 'twui-landing-step-body-justify' : ''}">{step.body}</p>
				</CardContent>
			</Card>
		</li>
	{/each}
</ol>

<style>
	.twui-landing-steps {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.twui-landing-step {
		display: flex;
		min-width: 0;
	}

	.twui-landing-step > :global(.twui-card) {
		flex: 1;
	}

	.twui-landing-step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		margin-bottom: 12px;
		border-radius: 8px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 16px;
		font-weight: 700;
		line-height: 1;
	}

	.twui-landing-step-title {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-landing-step-body {
		margin: 6px 0 0;
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 15px;
		line-height: 1.55;
		color: var(--twui-ink-soft);
	}

	.twui-landing-step-body-justify {
		text-align: justify;
		text-justify: inter-word;
	}

	@media (min-width: 640px) {
		.twui-landing-steps {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.twui-landing-steps {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
