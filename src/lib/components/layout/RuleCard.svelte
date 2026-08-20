<script lang="ts">
	import type { Snippet, Component } from 'svelte';

	let {
		icon,
		title,
		children,
		class: className = ''
	}: {
		icon?: Component<{ class?: string; strokeWidth?: number }>;
		title: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="twui-rulecard {className}">
	<div class="twui-rulecard-label">
		{#if icon}
			{@const Icon = icon}
			<Icon class="twui-rulecard-icon" strokeWidth={1.75} />
		{/if}
		{title}
	</div>
	<div class="twui-rulecard-prose">
		{@render children()}
	</div>
</div>

<style>
	.twui-rulecard {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		padding: 24px;
	}

	.twui-rulecard-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		letter-spacing: 0.025em;
		text-transform: uppercase;
		color: var(--twui-ink-soft);
	}

	.twui-rulecard-icon {
		width: 16px;
		height: 16px;
		color: var(--twui-accent);
	}

	.twui-rulecard-prose {
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 18px;
		line-height: 1.625;
		color: var(--twui-ink);
	}
</style>
