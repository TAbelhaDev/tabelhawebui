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

	const firstEnabled = $derived(items.find((t) => !t.disabled));

	function onKeydown(e: KeyboardEvent, index: number) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		e.preventDefault();
		const dir = e.key === 'ArrowRight' ? 1 : -1;
		let i = index + dir;
		for (let steps = 0; steps < items.length; steps++, i += dir) {
			const wrap = (i + items.length * Math.abs(dir)) % items.length;
			const candidate = items[wrap];
			if (!candidate.disabled) {
				value = candidate.value;
				return;
			}
			i = wrap;
		}
	}
</script>

<div class="twui-tabs {className}" role="tablist">
	{#each items as tab, i (tab.value)}
		<button
			type="button"
			role="tab"
			aria-selected={tab.value === value}
			tabindex={tab.value === value ? 0 : -1}
			disabled={tab.disabled}
			class="twui-tabs-item {tab.value === value ? 'twui-tabs-item-active' : ''}"
			onclick={() => (value = tab.value)}
			onkeydown={(e) => onKeydown(e, i)}
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.twui-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 0;
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-tabs-item {
		padding: 8px 16px;
		border: none;
		border-bottom: 2px solid transparent;
		background: transparent;
		font-family: var(--twui-font-mono);
		font-size: 13px;
		color: var(--twui-ink-soft);
		cursor: pointer;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.twui-tabs-item:hover:not(:disabled) {
		color: var(--twui-accent);
	}

	.twui-tabs-item-active {
		border-bottom-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-tabs-item:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
