<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<div class="twui-divider {className}" aria-hidden="true">// ---</div>

<style>
	.twui-divider {
		display: block;
		margin: 24px 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-faint);
	}
</style>
