<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		action,
		class: className = ''
	}: {
		title: string;
		subtitle?: string;
		action?: Snippet;
		class?: string;
	} = $props();
</script>

<header class="twui-page-header {className}">
	<div class="twui-page-header-text">
		<h1 class="twui-page-header-title">{title}</h1>
		{#if subtitle}
			<p class="twui-page-header-subtitle">
				<span class="twui-page-header-prefix">//</span>
				{subtitle}
			</p>
		{/if}
	</div>
	{#if action}
		<div class="twui-page-header-action">
			{@render action()}
		</div>
	{/if}
</header>

<style>
	.twui-page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.twui-page-header-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.twui-page-header-title {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--twui-ink);
	}

	.twui-page-header-subtitle {
		margin: 0;
		font-family: var(--twui-font-mono);
		font-size: 0.875rem;
		color: var(--twui-ink-soft);
	}

	.twui-page-header-prefix {
		color: var(--twui-ink-faint);
	}

	.twui-page-header-action {
		flex-shrink: 0;
	}
</style>
