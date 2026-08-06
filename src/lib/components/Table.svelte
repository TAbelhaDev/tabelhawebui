<script lang="ts">
	import type { Snippet } from 'svelte';

	// Coluna: ou string simples (key == label) ou { key, label } — permite
	// header em PT e chave real no objeto/row pro snippet `cell`.
	type Column = string | { key: string; label?: string };

	function colKey(col: Column): string {
		return typeof col === 'string' ? col : col.key;
	}
	function colLabel(col: Column): string {
		return typeof col === 'string' ? col : (col.label ?? col.key);
	}

	let {
		columns,
		rows,
		cell,
		children,
		class: className = ''
	}: {
		columns?: Column[];
		rows?: Array<Record<string, unknown>>;
		cell?: Snippet<[row: Record<string, unknown>, key: string]>;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<table class="twui-table {className}">
	{#if columns}
		<thead>
			<tr>
				{#each columns as col}
					<th>{colLabel(col)}</th>
				{/each}
			</tr>
		</thead>
	{/if}
	{#if rows && columns}
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					{#each columns as col}
						<td>
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
