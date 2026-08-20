<script lang="ts">
	let {
		code,
		class: className = ''
	}: {
		code: string;
		class?: string;
	} = $props();

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			/* clipboard indisponível (ex. contexto sem permissão) */
		}
	}
</script>

<div class="twui-docs-code {className}">
	<pre><code>{code}</code></pre>
	<button
		type="button"
		class="twui-docs-code-copy"
		aria-label="Copiar código"
		onclick={copy}
	>
		{copied ? 'Copiado' : 'Copiar'}
	</button>
</div>

<style>
	.twui-docs-code {
		position: relative;
		margin-top: 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		overflow: hidden;
	}

	.twui-docs-code pre {
		margin: 0;
		padding: 12px 84px 12px 12px;
		overflow-x: auto;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		line-height: 1.6;
		color: var(--twui-ink);
		white-space: pre;
	}

	.twui-docs-code-copy {
		position: absolute;
		top: 6px;
		right: 6px;
		padding: 3px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 11px;
		color: var(--twui-ink-soft);
		cursor: pointer;
	}

	.twui-docs-code-copy:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}
</style>
