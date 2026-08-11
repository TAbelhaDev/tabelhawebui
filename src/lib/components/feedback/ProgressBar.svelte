<script lang="ts">
	let {
		value,
		label = true,
		class: className = ''
	}: {
		value?: number;
		label?: boolean;
		class?: string;
	} = $props();
</script>

<div
	class="twui-progress {className}"
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={100}
>
	<div
		class="twui-progress-fill {value === undefined ? 'twui-progress-indeterminate' : ''}"
		style={value !== undefined ? `width: ${Math.min(100, Math.max(0, value))}%` : undefined}
	>
		{#if label && value !== undefined}
			<span class="twui-progress-label">{Math.round(value)}%</span>
		{/if}
	</div>
</div>

<style>
	.twui-progress {
		position: relative;
		height: 14px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		overflow: hidden;
	}

	.twui-progress-fill {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		background: var(--twui-accent);
		transition: width 0.2s ease;
	}

	.twui-progress-label {
		padding: 0 6px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 10px;
		line-height: 1;
		color: var(--twui-paper);
	}

	.twui-progress-indeterminate {
		width: 40%;
		animation: twui-progress-slide 1.2s ease-in-out infinite;
	}

	@keyframes twui-progress-slide {
		0% {
			margin-left: -40%;
		}
		100% {
			margin-left: 100%;
		}
	}
</style>
