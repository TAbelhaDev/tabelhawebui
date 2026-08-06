<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import Card from './Card.svelte';
	import CardContent from './CardContent.svelte';

	let {
		features,
		class: className = ''
	}: {
		features: Array<{
			icon: Component<{ class?: string }> | Snippet;
			iconBg?: string;
			iconColor?: string;
			title: string;
			body: string;
		}>;
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
					{#if typeof feature.icon === 'function'}
						{@const icon = feature.icon as Snippet}
						{@render icon()}
					{:else}
						{@const Icon = feature.icon as Component<{ class?: string }>}
						<Icon class="twui-landing-feature-svg" />
					{/if}
				</div>
				<h3 class="twui-landing-feature-title">{feature.title}</h3>
				<p class="twui-landing-feature-body">{feature.body}</p>
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

	.twui-landing-feature-svg {
		width: 18px;
		height: 18px;
	}

	.twui-landing-feature-title {
		margin: 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
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
