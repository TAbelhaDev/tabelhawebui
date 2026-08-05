<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...rest
	}: {
		children: Snippet;
		class?: string;
	} & HTMLAnchorAttributes = $props();
</script>

<a class="twui-bracketlink {className}" {...rest}>
	<span class="twui-bracketlink-bracket" aria-hidden="true">[</span>{@render children()}<span
		class="twui-bracketlink-bracket"
		aria-hidden="true"
		>]</span
	>
</a>

<style>
	.twui-bracketlink {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.twui-bracketlink-bracket {
		color: var(--twui-ink-faint);
		transition: color 0.15s ease;
	}

	.twui-bracketlink:hover,
	.twui-bracketlink:hover .twui-bracketlink-bracket {
		color: var(--twui-accent);
	}
</style>
