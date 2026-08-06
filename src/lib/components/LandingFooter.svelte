<script lang="ts">
	let {
		name,
		license,
		repoUrl,
		class: className = ''
	}: {
		name: string;
		license?: string;
		repoUrl: string;
		class?: string;
	} = $props();
</script>

<footer class="twui-landing-footer {className}">
	<div class="twui-landing-footer-left">
		<span class="twui-landing-footer-name">{name}</span>
		{#if license}
			<span class="twui-landing-footer-license">{license}</span>
		{/if}
	</div>
	<a class="twui-landing-footer-link" href={repoUrl} target="_blank" rel="noreferrer">
		<svg
			class="twui-landing-footer-icon"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
		Ver o código
	</a>
</footer>

<style>
	.twui-landing-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding-top: 24px;
		border-top: 1px solid var(--twui-rule);
	}

	.twui-landing-footer-left {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 8px;
	}

	.twui-landing-footer-name {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-ink);
	}

	.twui-landing-footer-license {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-landing-footer-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border: 1px solid var(--twui-rule);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
		text-decoration: none;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.twui-landing-footer-link:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-landing-footer-icon {
		color: var(--twui-accent);
	}
</style>
