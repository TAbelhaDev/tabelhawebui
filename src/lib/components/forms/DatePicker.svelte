<script lang="ts">
	import { fade } from 'svelte/transition';
	import { clickOutside } from '../../actions/click-outside';

	let {
		value = $bindable(''),
		label,
		name,
		mode = 'date',
		min,
		max,
		disabled = false,
		required = false,
		placeholder = 'Selecione uma data',
		locale = 'pt-BR',
		prevLabel = 'Anterior',
		nextLabel = 'Próximo',
		class: className = '',
		...rest
	}: {
		value?: string;
		label?: string;
		name?: string;
		mode?: 'date' | 'month';
		min?: string;
		max?: string;
		disabled?: boolean;
		required?: boolean;
		placeholder?: string;
		locale?: string;
		prevLabel?: string;
		nextLabel?: string;
		class?: string;
	} & { 'aria-label'?: string; id?: string } = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | undefined>();
	const today = new Date();
	let viewYear = $state(today.getFullYear());
	let viewMonth = $state(today.getMonth()); // 0-11

	function toggle() {
		if (disabled) return;
		open = !open;
		if (open) {
			const ref = value
				? new Date(`${value}T00:00:00`)
				: null;
			viewYear = ref ? ref.getFullYear() : today.getFullYear();
			viewMonth = ref ? ref.getMonth() : today.getMonth();
		}
	}

	function pick(iso: string) {
		// In month mode the value is YYYY-MM: the clicked day only indicates the month.
		value = mode === 'month' ? iso.slice(0, 7) : iso;
		open = false;
	}

	// Navigation always month by month (in both modes).
	function prev() {
		viewMonth -= 1;
		if (viewMonth < 0) {
			viewMonth = 11;
			viewYear -= 1;
		}
	}

	function next() {
		viewMonth += 1;
		if (viewMonth > 11) {
			viewMonth = 0;
			viewYear += 1;
		}
	}

	const monthLabel = $derived(
		new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, {
			month: 'long',
			year: 'numeric'
		})
	);

	// Grid headers aligned to getDay() (0=Sunday): Jan 7, 2024 is a Sunday.
	const weekdays = $derived(
		Array.from({ length: 7 }, (_, i) =>
			new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 7 + i))
		)
	);

	const days = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const startDow = first.getDay(); // 0=Sunday
		const count = new Date(viewYear, viewMonth + 1, 0).getDate();
		const cells: Array<{ iso: string; day: number; inMonth: boolean }> = [];
		for (let i = 0; i < startDow; i++) {
			const d = new Date(viewYear, viewMonth, i - startDow + 1);
			cells.push({ iso: isoOf(d), day: d.getDate(), inMonth: false });
		}
		for (let day = 1; day <= count; day++) {
			const d = new Date(viewYear, viewMonth, day);
			cells.push({ iso: isoOf(d), day, inMonth: true });
		}
		while (cells.length % 7 !== 0) {
			const last = cells[cells.length - 1];
			const d = new Date(`${last.iso}T00:00:00`);
			d.setDate(d.getDate() + 1);
			cells.push({ iso: isoOf(d), day: d.getDate(), inMonth: false });
		}
		return cells;
	});

	function isoOf(d: Date): string {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	function isToday(iso: string): boolean {
		return iso === isoOf(today);
	}

	// Seleção: date compara o dia; month compara o mês (destaca o mês inteiro).
	function isSelected(iso: string): boolean {
		if (!value) return false;
		return mode === 'month' ? iso.slice(0, 7) === value : iso === value;
	}

	function inRange(iso: string): boolean {
		if (min && iso.slice(0, 7) < min.slice(0, 7)) return false;
		if (max && iso.slice(0, 7) > max.slice(0, 7)) return false;
		return true;
	}

	function displayValue(): string {
		if (!value) return '';
		const [y, m] = value.split('-').map(Number);
		if (mode === 'month') {
			return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
		}
		return new Date(y, m - 1, 1).toLocaleDateString(locale, {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div
	class="twui-date-wrap {className}"
	bind:this={rootEl}
	use:clickOutside={() => (open = false)}
>
	<button
		type="button"
		class="twui-date-trigger"
		id={rest.id}
		{...rest}
		disabled={disabled}
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={toggle}
	>
		<svg
			class="twui-date-calendar-icon"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
		<span class="twui-date-value {value ? '' : 'twui-date-placeholder'}">
			{value ? displayValue() : placeholder}
		</span>
	</button>

	{#if name}
		<input type="hidden" {name} value={value} {required} />
	{/if}

	{#if open}
		<div
			class="twui-date-popover"
			role="dialog"
			transition:fade={{ duration: 100 }}
		>
			<div class="twui-date-nav">
				<button type="button" class="twui-date-nav-btn" onclick={prev} aria-label={prevLabel}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
				</button>
				<span class="twui-date-nav-label">{monthLabel}</span>
				<button type="button" class="twui-date-nav-btn" onclick={next} aria-label={nextLabel}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
				</button>
			</div>

			<div class="twui-date-weekdays">
				{#each weekdays as w, i (i)}<span>{w}</span>{/each}
			</div>
			<div class="twui-date-grid">
				{#each days as cell, i (i)}
					<button
						type="button"
						class="twui-date-cell {cell.inMonth ? '' : 'twui-date-cell-out'} {isToday(cell.iso)
							? 'twui-date-cell-today'
							: ''} {isSelected(cell.iso) ? 'twui-date-cell-selected' : ''}"
						disabled={!inRange(cell.iso)}
						onclick={() => pick(cell.iso)}
					>
						{cell.day}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.twui-date-wrap {
		position: relative;
		display: block;
		width: 100%;
	}

	.twui-date-trigger {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 14px;
		text-align: left;
		color: var(--twui-ink);
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-date-trigger:focus-visible {
		border-color: var(--twui-accent);
	}

	.twui-date-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-date-calendar-icon {
		flex-shrink: 0;
		color: var(--twui-ink-soft);
	}

	.twui-date-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twui-date-placeholder {
		color: var(--twui-ink-faint);
	}

	.twui-date-popover {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		z-index: 50;
		width: 264px;
		padding: 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
	}

	.twui-date-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.twui-date-nav-label {
		font-family: var(--twui-font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--twui-ink);
		text-transform: capitalize;
	}

	.twui-date-nav-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border: 1px solid var(--twui-rule);
		background: transparent;
		color: var(--twui-ink-soft);
		cursor: pointer;
	}

	.twui-date-nav-btn:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-date-weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-bottom: 4px;
	}

	.twui-date-weekdays span {
		font-family: var(--twui-font-mono);
		font-size: 11px;
		text-align: center;
		color: var(--twui-ink-faint);
	}

	.twui-date-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.twui-date-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30px;
		border: 1px solid transparent;
		background: transparent;
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-date-cell:hover:not(:disabled):not(.twui-date-cell-selected) {
		border-color: var(--twui-rule);
		background: var(--twui-paper);
		color: var(--twui-accent);
	}

	.twui-date-cell:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.twui-date-cell-out {
		color: var(--twui-ink-faint);
	}

	.twui-date-cell-today {
		border-color: var(--twui-accent);
	}

	.twui-date-cell-selected {
		background: var(--twui-accent);
		color: var(--twui-paper);
		font-weight: 500;
	}
</style>
