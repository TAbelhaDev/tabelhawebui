<script lang="ts">
	let {
		prefix = 'TAbelha',
		suffix = '',
		class: className = ''
	}: {
		prefix?: string;
		suffix?: string;
		class?: string;
	} = $props();
</script>

<span class="twui-wordmark {className}">
	{prefix}<span class="twui-wordmark-accent">{suffix}</span>
</span>

<style>
	.twui-wordmark {
		color: var(--twui-ink);
		white-space: nowrap;
	}

	.twui-wordmark-accent {
		color: var(--twui-accent);
	}
</style>
