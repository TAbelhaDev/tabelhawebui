<script lang="ts">
	let {
		steps,
		class: className = ''
	}: {
		steps: Array<{ number: string; color: string; title: string; body: string }>;
		class?: string;
	} = $props();
</script>

<ol class="twui-landing-steps {className}">
	{#each steps as step (step.number)}
		<li class="twui-landing-step">
			<div class="twui-landing-step-number" style={`color: ${step.color}`}>{step.number}</div>
			<h3 class="twui-landing-step-title">{step.title}</h3>
			<p class="twui-landing-step-body">{step.body}</p>
		</li>
	{/each}
</ol>

<style>
	.twui-landing-steps {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.twui-landing-step-number {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 32px;
		font-weight: 700;
		line-height: 1;
	}

	.twui-landing-step-title {
		margin: 12px 0 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 15px;
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
