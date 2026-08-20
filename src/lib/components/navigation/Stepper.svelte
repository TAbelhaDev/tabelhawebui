<script lang="ts">
	let {
		items,
		value = $bindable(''),
		class: className = ''
	}: {
		items: { value: string; label: string; disabled?: boolean }[];
		value?: string;
		class?: string;
	} = $props();

	const currentIndex = $derived(items.findIndex((s) => s.value === value));
</script>

<ol class="twui-stepper {className}">
	{#each items as step, i (step.value)}
		<li
			class="twui-stepper-item {i <= currentIndex ? 'twui-stepper-item-active' : ''} {step.disabled ? 'twui-stepper-item-disabled' : ''}"
			aria-current={i === currentIndex ? 'step' : undefined}
		>
			<button
				type="button"
				class="twui-stepper-btn"
				disabled={step.disabled}
				onclick={() => (value = step.value)}
				aria-label={`Passo ${i + 1} de ${items.length}: ${step.label}`}
			>
				<span class="twui-stepper-num" aria-hidden="true">
					{i < currentIndex ? '✓' : String(i + 1).padStart(2, '0')}
				</span>
				<span class="twui-stepper-label">{step.label}</span>
			</button>
		</li>
	{/each}
</ol>

<style>
	.twui-stepper {
		display: flex;
		flex-wrap: wrap;
		gap: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.twui-stepper-item {
		position: relative;
		flex: 1;
		min-width: 0;
	}

	.twui-stepper-item::after {
		content: '';
		position: absolute;
		top: 13px;
		right: 0;
		left: calc(50% + 18px);
		height: 1px;
		background: var(--twui-rule);
	}

	.twui-stepper-item:last-child::after {
		display: none;
	}

	.twui-stepper-item-active::after {
		background: var(--twui-accent);
	}

	.twui-stepper-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 100%;
		padding: 0;
		border: none;
		background: transparent;
		font-family: var(--twui-font-mono);
		cursor: pointer;
	}

	.twui-stepper-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border: 1px solid var(--twui-rule);
		border-radius: 9999px;
		background: var(--twui-paper-raised);
		font-size: 11px;
		color: var(--twui-ink-soft);
	}

	.twui-stepper-item-active .twui-stepper-num {
		border-color: var(--twui-accent);
		background: var(--twui-accent);
		color: var(--twui-paper);
	}

	.twui-stepper-label {
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-stepper-item-disabled .twui-stepper-btn {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
