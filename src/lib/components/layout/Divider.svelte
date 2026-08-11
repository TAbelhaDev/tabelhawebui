<script lang="ts">
	let {
		layout = 'horizontal',
		type = 'solid',
		label,
		class: className = ''
	}: {
		layout?: 'horizontal' | 'vertical';
		type?: 'solid' | 'dashed';
		label?: string;
		class?: string;
	} = $props();
</script>

{#if layout === 'vertical'}
	<div class="twui-divider twui-divider-vertical twui-divider-{type} {className}" aria-hidden="true"></div>
{:else if label}
	<div class="twui-divider twui-divider-with-label {className}" role="separator">
		<span class="twui-divider-line twui-divider-{type}" aria-hidden="true"></span>
		<span class="twui-divider-label-text">{label}</span>
		<span class="twui-divider-line twui-divider-{type}" aria-hidden="true"></span>
	</div>
{:else}
	<div class="twui-divider twui-divider-{type} {className}" role="separator" aria-hidden="true"></div>
{/if}

<style>
	.twui-divider {
		margin: 24px 0;
		border-top: 1px solid var(--twui-rule);
	}

	.twui-divider-dashed {
		border-top-style: dashed;
	}

	.twui-divider-vertical {
		display: inline-block;
		height: 1em;
		margin: 0 8px;
		border-top: none;
		border-left: 1px solid var(--twui-rule);
		vertical-align: middle;
	}

	.twui-divider-vertical.twui-divider-dashed {
		border-left-style: dashed;
	}

	.twui-divider-with-label {
		display: flex;
		align-items: center;
		gap: 12px;
		border-top: none;
	}

	.twui-divider-line {
		flex: 1;
		border-top: 1px solid var(--twui-rule);
	}

	.twui-divider-line.twui-divider-dashed {
		border-top-style: dashed;
	}

	.twui-divider-label-text {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-faint);
	}
</style>
