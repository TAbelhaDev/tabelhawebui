<script lang="ts">
	import type { Snippet } from 'svelte';

	// Coluna: string simples (key == label) ou { key, label, width, sortable }.
	type Column = string | { key: string; label?: string; width?: string; sortable?: boolean };

	function colKey(col: Column): string {
		return typeof col === 'string' ? col : col.key;
	}
	function colLabel(col: Column): string {
		return typeof col === 'string' ? col : (col.label ?? col.key);
	}
	function colWidth(col: Column): string | undefined {
		return typeof col === 'string' ? undefined : col.width;
	}
	function colSortable(col: Column, sortable: boolean): boolean {
		return typeof col === 'string' ? sortable : (col.sortable ?? sortable);
	}

	let {
		columns,
		rows = [],
		cell,
		children,
		widths,
		// Ordenação
		sortable = false,
		// Filtro global
		filterable = false,
		filterFields = [],
		// Seleção de linha
		selection,
		selected = $bindable([]),
		rowKey,
		// Estados
		loading = false,
		skeletonRows = 5,
		empty,
		// Paginação
		pageSize = $bindable(10),
		pageSizeOptions,
		pageReport = '{currentPage} de {totalPages}',
		showFirstLast = true,
		labels = {
			records: 'registros',
			page: 'página',
			prev: 'Anterior',
			next: 'Próxima',
			first: 'Primeira página',
			last: 'Última página',
			rowsPerPage: 'Linhas por página',
			search: 'Buscar...',
			empty: 'Nenhum registro'
		},
		class: className = ''
	}: {
		columns?: Column[];
		rows?: Array<Record<string, unknown>>;
		cell?: Snippet<[row: Record<string, unknown>, key: string]>;
		children?: Snippet;
		// Proporções relativas de largura por coluna, ex. [4, 1, 2, 3].
		widths?: number[];
		// Ordenação: clicar no header cicla nenhum → asc → desc.
		sortable?: boolean;
		// Filtro global: caixa de busca acima da tabela.
		filterable?: boolean;
		filterFields?: string[];
		// Seleção de linha: 'single' | 'multiple'.
		selection?: 'single' | 'multiple';
		selected?: Array<Record<string, unknown>>;
		rowKey?: string;
		loading?: boolean;
		skeletonRows?: number;
		empty?: Snippet;
		pageSize?: number;
		pageSizeOptions?: number[];
		pageReport?: string;
		showFirstLast?: boolean;
		labels?: {
			records?: string;
			page?: string;
			prev?: string;
			next?: string;
			first?: string;
			last?: string;
			rowsPerPage?: string;
			search?: string;
			empty?: string;
		};
		class?: string;
	} = $props();

	// --- largura das colunas ---
	const total = $derived(widths?.reduce((a, b) => a + b, 0) ?? 0);
	function colWidthPercent(i: number): string | undefined {
		if (!widths || total === 0) return undefined;
		return `${(widths[i] / total) * 100}%`;
	}
	function colStyle(col: Column, i: number): string | undefined {
		const w = colWidth(col) ?? colWidthPercent(i);
		return w ? `width: ${w}` : undefined;
	}

	// --- ordenação ---
	let sortField = $state<string | undefined>(undefined);
	let sortOrder = $state<'asc' | 'desc'>('asc');

	function cycleSort(key: string) {
		if (sortField !== key) {
			sortField = key;
			sortOrder = 'asc';
		} else if (sortOrder === 'asc') {
			sortOrder = 'desc';
		} else {
			sortField = undefined;
		}
	}

	function compare(a: unknown, b: unknown): number {
		if (typeof a === 'number' && typeof b === 'number') return a - b;
		return String(a ?? '').localeCompare(String(b ?? ''));
	}

	// --- filtro global ---
	let query = $state('');
	const filterableKeys = $derived(
		filterable && filterFields.length > 0 ? filterFields : columns?.map(colKey) ?? []
	);
	const filteredRows = $derived(
		filterable && query.trim() && filterableKeys.length > 0
			? rows.filter((row) =>
					filterableKeys.some((k) =>
						String(row[k] ?? '').toLowerCase().includes(query.trim().toLowerCase())
					)
				)
			: rows
	);
	const sortedRows = $derived(
		sortField ? [...filteredRows].sort((a, b) => compare(a[sortField!], b[sortField!]) * (sortOrder === 'asc' ? 1 : -1)) : filteredRows
	);

	// --- paginação ---
	const totalRecords = $derived(sortedRows.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalRecords / pageSize)));
	let currentPage = $state(1);
	const pageRows = $derived(
		sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	$effect(() => {
		if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
	});
	$effect(() => {
		if (query) currentPage = 1;
	});
	$effect(() => {
		if (pageSize) currentPage = 1;
	});

	function pageRange(): number[] {
		const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
		const end = Math.min(totalPages, start + 4);
		const range: number[] = [];
		for (let i = start; i <= end; i++) range.push(i);
		return range;
	}
	function setPage(p: number) {
		currentPage = Math.min(Math.max(1, p), totalPages);
	}
	function renderReport(): string {
		const first = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
		const last = Math.min(currentPage * pageSize, totalRecords);
		return pageReport
			.replace('{first}', String(first))
			.replace('{last}', String(last))
			.replace('{totalRecords}', String(totalRecords))
			.replace('{currentPage}', String(currentPage))
			.replace('{totalPages}', String(totalPages));
	}

	// --- seleção ---
	function isSelected(row: Record<string, unknown>): boolean {
		return selected.some((s) => (rowKey ? s[rowKey] === row[rowKey] : s === row));
	}
	function toggleRow(row: Record<string, unknown>) {
		if (!selection) return;
		if (selection === 'single') {
			selected = isSelected(row) ? [] : [row];
			return;
		}
		selected = isSelected(row) ? selected.filter((s) => (rowKey ? s[rowKey] !== row[rowKey] : s !== row)) : [...selected, row];
	}
</script>

{#if filterable}
	<input
		type="text"
		class="twui-table-filter"
		placeholder={labels.search ?? 'Buscar...'}
		bind:value={query}
		aria-label={labels.search ?? 'Buscar...'}
	/>
{/if}

<table class="twui-table {widths ? 'twui-table-fixed' : ''} {className}">
	{#if columns}
		<thead>
			<tr>
				{#each columns as col, i (colKey(col))}
					<th
						style={colStyle(col, i)}
						class:twui-table-sortable={colSortable(col, sortable)}
						aria-sort={colKey(col) === sortField ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
					>
						{#if colSortable(col, sortable)}
							<button type="button" class="twui-table-sort-btn" onclick={() => cycleSort(colKey(col))}>
								{colLabel(col)}
								{#if colKey(col) === sortField}
									<span class="twui-table-sort-ind" aria-hidden="true">{sortOrder === 'asc' ? '▲' : '▼'}</span>
								{/if}
							</button>
						{:else}
							{colLabel(col)}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
	{/if}
	{#if loading}
		<tbody aria-hidden="true">
			{#each Array(skeletonRows) as _, i (i)}
				<tr>
					{#each columns ?? [] as col, j (colKey(col))}
						<td class="twui-table-skeleton-cell">
							<span class="twui-table-skeleton"></span>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	{:else if pageRows.length > 0 && columns}
		<tbody>
			{#each pageRows as row, i (i)}
				<tr
					class:twui-table-row-selected={isSelected(row)}
					class:twui-table-row-clickable={!!selection}
					aria-selected={selection ? isSelected(row) : undefined}
					onclick={selection ? () => toggleRow(row) : undefined}
				>
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
	{:else if empty}
		<tbody>
			<tr>
				<td colspan={columns?.length ?? 1} class="twui-table-empty">
					{@render empty()}
				</td>
			</tr>
		</tbody>
	{:else if columns && !children}
		<tbody>
			<tr>
				<td colspan={columns.length} class="twui-table-empty">{labels.empty ?? 'Nenhum registro'}</td>
			</tr>
		</tbody>
	{:else if children}
		{@render children()}
	{/if}
</table>

{#if pageSize && totalRecords > pageSize}
	<div class="twui-table-pagination">
		<div class="twui-table-pagination-left">
			{#if pageSizeOptions && pageSizeOptions.length > 0}
				<label class="twui-table-rows-label">
					{labels.rowsPerPage ?? 'Linhas por página'}
					<select class="twui-table-rows-select" bind:value={pageSize}>
						{#each pageSizeOptions as size (size)}
							<option value={size}>{size}</option>
						{/each}
					</select>
				</label>
			{/if}
			<span class="twui-table-pagination-info" aria-live="polite">{renderReport()}</span>
		</div>
		<div class="twui-table-pagination-buttons">
			{#if showFirstLast}
				<button
					type="button"
					class="twui-table-page-btn"
					disabled={currentPage <= 1}
					onclick={() => setPage(1)}
					aria-label={labels.first ?? 'Primeira página'}
				>«</button>
			{/if}
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
			{#if showFirstLast}
				<button
					type="button"
					class="twui-table-page-btn"
					disabled={currentPage >= totalPages}
					onclick={() => setPage(totalPages)}
					aria-label={labels.last ?? 'Última página'}
				>»</button>
			{/if}
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

	.twui-table-sort-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 0;
		border: none;
		background: transparent;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		color: inherit;
		cursor: pointer;
	}

	.twui-table-sort-btn:hover {
		color: var(--twui-accent);
	}

	.twui-table-sort-ind {
		font-size: 9px;
		color: var(--twui-accent);
	}

	.twui-table-row-clickable {
		cursor: pointer;
	}

	.twui-table-row-selected td {
		background: var(--twui-accent-soft);
	}

	.twui-table-empty {
		padding: 24px 16px;
		text-align: center;
		font-size: 13px;
		color: var(--twui-ink-faint);
	}

	.twui-table-skeleton-cell {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.twui-table-skeleton {
		display: block;
		height: 12px;
		border-radius: 2px;
		background: var(--twui-paper-raised);
		background-image: linear-gradient(
			90deg,
			var(--twui-paper-raised) 0%,
			var(--twui-rule) 50%,
			var(--twui-paper-raised) 100%
		);
		background-size: 200% 100%;
		animation: twui-table-shimmer 1.2s ease-in-out infinite;
	}

	@keyframes twui-table-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	.twui-table-filter {
		width: 100%;
		max-width: 240px;
		margin-bottom: 12px;
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 14px;
		color: var(--twui-ink);
		outline: none;
	}

	.twui-table-filter::placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-table-filter:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-table-pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px 16px;
		padding: 10px 16px;
		border-top: 1px solid var(--twui-rule);
	}

	.twui-table-pagination-left {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 16px;
	}

	.twui-table-rows-label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-table-rows-select {
		padding: 4px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-table-pagination-info {
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
