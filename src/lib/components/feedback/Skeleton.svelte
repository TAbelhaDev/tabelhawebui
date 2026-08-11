<script lang="ts">
	let {
		width = '100%',
		height = '16px',
		rounded = false,
		class: className = ''
	}: {
		width?: string;
		height?: string;
		rounded?: boolean;
		class?: string;
	} = $props();
</script>

<div
	class="twui-skeleton {rounded ? 'twui-skeleton-rounded' : ''} {className}"
	style={`width: ${width}; height: ${height}`}
	aria-hidden="true"
></div>

<style>
	.twui-skeleton {
		border-radius: 2px;
		background: var(--twui-paper-raised);
		background-image: linear-gradient(
			90deg,
			var(--twui-paper-raised) 0%,
			var(--twui-rule) 50%,
			var(--twui-paper-raised) 100%
		);
		background-size: 200% 100%;
		animation: twui-skeleton-shimmer 1.2s ease-in-out infinite;
	}

	.twui-skeleton-rounded {
		border-radius: 9999px;
	}

	@keyframes twui-skeleton-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
</style>
