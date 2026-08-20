<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '../card/Card.svelte';
	import CardContent from '../card/CardContent.svelte';

	let {
		features,
		justify = false,
		class: className = ''
	}: {
		// icon é um Snippet (ex. `icon: () => <Icon class="..." />`). Não usar
		// Component direto: não há como distinguir snippet de componente em
		// runtime no Svelte 5 (quebraria no SSR).
		features: Array<{
			icon: Snippet;
			iconBg?: string;
			iconColor?: string;
			title: string;
			body: string;
		}>;
		justify?: boolean;
		class?: string;
	} = $props();
</script>

<div class="twui-landing-features {className}">
	{#each features as feature (feature.title)}
		<Card>
			<CardContent>
				<div
					class="twui-landing-feature-icon"
					style="background:{feature.iconBg ?? 'var(--twui-accent-soft)'}; color:{feature.iconColor ?? 'var(--twui-accent)'}"
				>
					{@render feature.icon()}
				</div>
				<h3 class="twui-landing-feature-title">{feature.title}</h3>
				<p class="twui-landing-feature-body {justify ? 'twui-landing-feature-body-justify' : ''}">{feature.body}</p>
			</CardContent>
		</Card>
	{/each}
</div>

<style>
	.twui-landing-features {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	.twui-landing-feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		margin-bottom: 12px;
		border-radius: 8px;
	}

	.twui-landing-feature-title {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--twui-ink);
	}

	.twui-landing-feature-body {
		margin: 6px 0 0;
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 15px;
		line-height: 1.55;
		color: var(--twui-ink-soft);
	}

	.twui-landing-feature-body-justify {
		text-align: justify;
		text-justify: inter-word;
	}

	@media (min-width: 640px) {
		.twui-landing-features {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.twui-landing-features {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
