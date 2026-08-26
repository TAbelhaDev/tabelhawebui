<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		navigate = false,
		class: className = ''
	}: {
		children?: Snippet;
		/** When true (and no children), render a default right-arrow affordance. */
		navigate?: boolean;
		class?: string;
	} = $props();
</script>

<div class="twui-card-action {className}">
	{#if navigate && !children}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="twui-card-action-nav"
			aria-hidden="true"
		>
			<path d="M5 12h14" />
			<path d="m13 5 7 7-7 7" />
		</svg>
	{:else if children}
		{@render children()}
	{/if}
</div>

<style>
	.twui-card-action {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px;
	}

	:global(.twui-card-header) > .twui-card-action {
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		padding: 0;
	}

	.twui-card-action-nav {
		width: 16px;
		height: 16px;
		color: var(--twui-accent);
	}
</style>
