<script lang="ts">
	let {
		value = $bindable(0),
		max = 5,
		readonly = false,
		cancel = false,
		cancelLabel = 'Cancelar avaliação',
		label = 'Avaliação',
		class: className = ''
	}: {
		value?: number;
		max?: number;
		readonly?: boolean;
		cancel?: boolean;
		cancelLabel?: string;
		label?: string;
		class?: string;
	} = $props();
</script>

<div class="twui-rating {className}" role="radiogroup" aria-label={label}>
	{#if cancel}
		<button
			type="button"
			class="twui-rating-cancel"
			aria-label={cancelLabel}
			onclick={() => (value = 0)}
		>×</button>
	{/if}
	{#each Array(max) as _, i (i)}
		<button
			type="button"
			class="twui-rating-star {i < value ? 'twui-rating-star-on' : ''}"
			role="radio"
			aria-checked={i < value}
			aria-label={`${i + 1} de ${max}`}
			disabled={readonly}
			onclick={() => (value = i + 1)}
		>★</button>
	{/each}
</div>

<style>
	.twui-rating {
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}

	.twui-rating-star,
	.twui-rating-cancel {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: transparent;
		font-size: 16px;
		line-height: 1;
		color: var(--twui-ink-faint);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.twui-rating-star:hover:not(:disabled) {
		color: var(--twui-accent);
	}

	.twui-rating-star-on {
		color: var(--twui-accent);
	}

	.twui-rating-cancel {
		color: var(--twui-ink-faint);
		font-size: 15px;
		margin-right: 4px;
	}

	.twui-rating:has(.twui-rating-star:focus-visible),
	.twui-rating:has(.twui-rating-cancel:focus-visible) {
		outline: 2px solid var(--twui-accent);
		outline-offset: 2px;
	}

	.twui-rating-star:disabled {
		opacity: 0.6;
		cursor: default;
	}
</style>
