<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		items,
		page = $bindable(0),
		item,
		prevLabel = 'Anterior',
		nextLabel = 'Próxima',
		class: className = ''
	}: {
		items: unknown[];
		page?: number;
		item: Snippet<[value: unknown]>;
		prevLabel?: string;
		nextLabel?: string;
		class?: string;
	} = $props();
</script>

<div class="twui-carousel {className}">
	<div class="twui-carousel-viewport">
		{@render item(items[page])}
	</div>
	<div class="twui-carousel-nav">
		<button
			type="button"
			class="twui-carousel-btn"
			disabled={page <= 0}
			onclick={() => (page -= 1)}
			aria-label={prevLabel}
		>‹</button>
		<div class="twui-carousel-dots">
			{#each items as _, i (i)}
				<button
					type="button"
					class="twui-carousel-dot {i === page ? 'twui-carousel-dot-active' : ''}"
					aria-label={`Página ${i + 1}`}
					onclick={() => (page = i)}
				></button>
			{/each}
		</div>
		<button
			type="button"
			class="twui-carousel-btn"
			disabled={page >= items.length - 1}
			onclick={() => (page += 1)}
			aria-label={nextLabel}
		>›</button>
	</div>
</div>

<style>
	.twui-carousel {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.twui-carousel-viewport {
		min-height: 0;
	}

	.twui-carousel-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.twui-carousel-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		border: 1px solid var(--twui-rule);
		background: transparent;
		font-size: 15px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-carousel-btn:hover:not(:disabled) {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-carousel-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.twui-carousel-dots {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.twui-carousel-dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border: 1px solid var(--twui-rule);
		border-radius: 9999px;
		background: transparent;
		cursor: pointer;
	}

	.twui-carousel-dot-active {
		border-color: var(--twui-accent);
		background: var(--twui-accent);
	}
</style>
