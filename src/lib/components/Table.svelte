<script lang="ts">
	import type { Snippet } from 'svelte';

	// Coluna: ou string simples (key == label) ou { key, label, width } —
	// permite header em PT, chave real no objeto/row pro snippet `cell` e
	// largura opcional (ex. `width: '9rem'` pra uma coluna maior).
	type Column = string | { key: string; label?: string; width?: string };

	function colKey(col: Column): string {
		return typeof col === 'string' ? col : col.key;
	}
	function colLabel(col: Column): string {
		return typeof col === 'string' ? col : (col.label ?? col.key);
	}
	function colWidth(col: Column): string | undefined {
		return typeof col === 'string' ? undefined : col.width;
	}

	let {
		columns,
		rows,
		cell,
		children,
		widths,
		class: className = ''
	}: {
		columns?: Column[];
		rows?: Array<Record<string, unknown>>;
		cell?: Snippet<[row: Record<string, unknown>, key: string]>;
		children?: Snippet;
		// Proporções relativas de largura por coluna, ex. [4, 1, 2, 3] — a soma
		// não precisa dar 100; cada coluna fica com total * (n / soma).
		widths?: number[];
		class?: string;
	} = $props();

	// Percentual de cada coluna a partir do array de proporções.
	const total = $derived(widths?.reduce((a, b) => a + b, 0) ?? 0);
	function colWidthPercent(i: number): string | undefined {
		if (!widths || total === 0) return undefined;
		return `${(widths[i] / total) * 100}%`;
	}
	function colStyle(col: Column, i: number): string | undefined {
		const w = colWidth(col) ?? colWidthPercent(i);
		return w ? `width: ${w}` : undefined;
	}
</script>

<table class="twui-table {widths ? 'twui-table-fixed' : ''} {className}">
	{#if columns}
		<thead>
			<tr>
				{#each columns as col, i (colKey(col))}
					<th style={colStyle(col, i)}>
						{colLabel(col)}
					</th>
				{/each}
			</tr>
		</thead>
	{/if}
	{#if rows && columns}
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					{#each columns as col, j (colKey(col))}
						<td style={colStyle(col, j)}>
							{#if cell}
								{@render cell(row, colKey(col))}
							{:else}
								{String(row[colKey(col)] ?? '')}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	{:else if children}
		{@render children()}
	{/if}
</table>

<style>
	.twui-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
	}

	.twui-table-fixed {
		table-layout: fixed;
	}

	.twui-table th {
		padding: 8px 16px;
		text-align: left;
		font-size: 12px;
		font-weight: 500;
		color: var(--twui-ink-faint);
		border-bottom: 1px solid var(--twui-rule);
	}

	.twui-table th:last-child,
	.twui-table td:last-child {
		text-align: right;
	}

	.twui-table td {
		padding: 8px 16px;
		border-bottom: 1px solid var(--twui-rule);
		vertical-align: middle;
	}

	.twui-table tbody tr:last-child td {
		border-bottom: none;
	}

	.twui-table tbody tr:hover td {
		background: var(--twui-paper);
	}
</style>
