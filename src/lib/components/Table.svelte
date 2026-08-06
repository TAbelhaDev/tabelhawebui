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
		pageSize,
		labels = {
			records: 'registros',
			page: 'página',
			prev: 'Anterior',
			next: 'Próxima'
		},
		class: className = ''
	}: {
		columns?: Column[];
		rows?: Array<Record<string, unknown>>;
		cell?: Snippet<[row: Record<string, unknown>, key: string]>;
		children?: Snippet;
		// Proporções relativas de largura por coluna, ex. [4, 1, 2, 3] — a soma
		// não precisa dar 100; cada coluna fica com total * (n / soma).
		widths?: number[];
		// Paginação client-side: quando definido, limita as linhas renderizadas
		// e mostra controles de página no rodapé.
		pageSize?: number;
		// Rótulos visíveis (i18n é do app).
		labels?: { records?: string; page?: string; prev?: string; next?: string };
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

	// Paginação client-side.
	const allRows = $derived(rows ?? []);
	const totalPages = $derived(
		pageSize ? Math.max(1, Math.ceil(allRows.length / pageSize)) : 1
	);
	let currentPage = $state(1);
	const pageRows = $derived(
		pageSize
			? allRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
			: allRows
	);
	$effect(() => {
		if (currentPage > totalPages) currentPage = totalPages;
	});

	function pageRange(): number[] {
		if (!pageSize) return [];
		const max = totalPages;
		const start = Math.max(1, Math.min(currentPage - 2, max - 4));
		const end = Math.min(max, start + 4);
		const range: number[] = [];
		for (let i = start; i <= end; i++) range.push(i);
		return range;
	}

	function setPage(p: number) {
		currentPage = Math.min(Math.max(1, p), totalPages);
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
	{#if pageRows.length > 0 && columns}
		<tbody>
			{#each pageRows as row, i (i)}
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

{#if pageSize && allRows.length > pageSize}
	<div class="twui-table-pagination">
		<span class="twui-table-pagination-info">
			{allRows.length} {labels.records ?? 'registros'} · {labels.page ?? 'página'} {currentPage} de
			{totalPages}
		</span>
		<div class="twui-table-pagination-buttons">
			<button
				type="button"
				class="twui-table-page-btn"
				disabled={currentPage <= 1}
				onclick={() => setPage(currentPage - 1)}
				aria-label={labels.prev ?? 'Anterior'}
			>‹</button>
			{#each pageRange() as p (p)}
				<button
					type="button"
					class="twui-table-page-btn {p === currentPage ? 'twui-table-page-btn-active' : ''}"
					aria-current={p === currentPage ? 'page' : undefined}
					onclick={() => setPage(p)}
				>{p}</button>
			{/each}
			<button
				type="button"
				class="twui-table-page-btn"
				disabled={currentPage >= totalPages}
				onclick={() => setPage(currentPage + 1)}
				aria-label={labels.next ?? 'Próxima'}
			>›</button>
		</div>
	</div>
{/if}

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

	.twui-table-pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 10px 16px;
		border-top: 1px solid var(--twui-rule);
	}

	.twui-table-pagination-info {
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-table-pagination-buttons {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.twui-table-page-btn {
		min-width: 28px;
		height: 28px;
		padding: 0 6px;
		border: 1px solid var(--twui-rule);
		background: transparent;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-table-page-btn:hover:not(:disabled):not(.twui-table-page-btn-active) {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-table-page-btn-active {
		border-color: var(--twui-accent);
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
		font-weight: 500;
	}

	.twui-table-page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
