<script lang="ts">
	import Wordmark from '../layout/Wordmark.svelte';

	let {
		prefix = 'TAbelha',
		suffix = '',
		license,
		repoUrl,
		links = [],
		class: className = ''
	}: {
		prefix?: string;
		suffix?: string;
		license?: string;
		repoUrl?: string;
		links?: { href: string; label: string }[];
		class?: string;
	} = $props();
</script>

<footer class="twui-ms-footer {className}">
	<p class="twui-ms-footer-brand">
		<Wordmark {prefix} {suffix} />
	</p>
	{#if license}
		<p class="twui-ms-footer-license">{license}</p>
	{/if}
	{#if links.length > 0 || repoUrl}
		<nav class="twui-ms-footer-nav">
			{#each links as link, i}
				{#if i > 0}<span class="twui-ms-footer-sep" aria-hidden="true">&middot;</span>{/if}
				<a class="twui-ms-footer-link" href={link.href}>{link.label}</a>
			{/each}
			{#if repoUrl}
				{#if links.length > 0}<span class="twui-ms-footer-sep" aria-hidden="true">&middot;</span>{/if}
				<a class="twui-ms-footer-link" href={repoUrl} target="_blank" rel="noreferrer">C&oacute;digo-fonte</a>
			{/if}
		</nav>
	{/if}
</footer>

<style>
	.twui-ms-footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 24px 24px;
		border-top: 1px solid var(--twui-rule);
		text-align: center;
	}

	.twui-ms-footer-brand {
		font-family: var(--twui-font-mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.twui-ms-footer-license {
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink-faint);
	}

	.twui-ms-footer-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		column-gap: 4px;
		row-gap: 4px;
		font-family: var(--twui-font-mono);
		font-size: 12px;
	}

	.twui-ms-footer-link {
		color: var(--twui-ink-soft);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.twui-ms-footer-link:hover {
		color: var(--twui-ink);
	}

	.twui-ms-footer-sep {
		padding: 0 4px;
		color: var(--twui-ink-faint);
		user-select: none;
	}
</style>
