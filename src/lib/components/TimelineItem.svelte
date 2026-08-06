<script module lang="ts">
	export type TimelineItemProps = {
		title: string;
		subtitle?: string;
		date?: string;
		start?: string;
		end?: string;
		location?: string;
		link?: string;
		details?: string[];
		skills?: string[];
		isLast?: boolean;
		nowLabel?: string;
	};
</script>

<script lang="ts">
	let {
		title,
		subtitle,
		date,
		start,
		end,
		location,
		link,
		details = [],
		skills = [],
		isLast = false,
		nowLabel = 'agora'
	}: TimelineItemProps = $props();

	const current = $derived(!date && !!start && !end);
	const meta = $derived(date ?? (start ? `${start} — ${end || nowLabel}` : ''));
</script>

<li class="twui-timeline-item">
	<div class="twui-timeline-col">
		{#if !isLast}
			<span class="twui-timeline-rail" aria-hidden="true"></span>
		{/if}
		<span
			class="twui-timeline-dot {current ? 'twui-timeline-dot-current' : ''}"
			aria-hidden="true"
		></span>
	</div>
	<div class="twui-timeline-body">
		{#if meta || location}
			<div class="twui-timeline-meta">
				{#if meta}
					<span class="twui-timeline-date {current ? 'twui-timeline-date-current' : ''}"
						>{meta}</span
					>
				{/if}
				{#if location}
					<span class="twui-timeline-location">· {location}</span>
				{/if}
			</div>
		{/if}
		<h3 class="twui-timeline-title">
			{#if link}
				<a href={link} target="_blank" rel="noreferrer">{title}</a>
			{:else}
				{title}
			{/if}
		</h3>
		{#if subtitle}
			<p class="twui-timeline-subtitle">{subtitle}</p>
		{/if}
		{#if details.length > 0}
			<ul class="twui-timeline-details">
				{#each details as detail (detail)}
					<li>{detail}</li>
				{/each}
			</ul>
		{/if}
		{#if skills.length > 0}
			<div class="twui-timeline-skills">
				{#each skills as skill (skill)}
					<span class="twui-timeline-skill"
						><span class="twui-timeline-skill-bracket">[</span>{skill}<span
							class="twui-timeline-skill-bracket"
							>]</span
						></span
					>
				{/each}
			</div>
		{/if}
	</div>
</li>

<style>
	.twui-timeline-item {
		display: grid;
		grid-template-columns: 1.5rem 1fr;
		column-gap: 16px;
	}

	.twui-timeline-col {
		position: relative;
	}

	.twui-timeline-rail {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
		transform: translateX(-50%);
		background: var(--twui-rule);
	}

	.twui-timeline-dot {
		position: relative;
		z-index: 10;
		margin-top: 6px;
		margin-left: auto;
		margin-right: auto;
		width: 10px;
		height: 10px;
		border: 2px solid var(--twui-accent);
		border-radius: 9999px;
		background: var(--twui-paper);
	}

	.twui-timeline-dot-current {
		border-color: var(--twui-signal);
		background: var(--twui-signal-soft);
	}

	.twui-timeline-body {
		min-width: 0;
		padding-bottom: 40px;
	}

	.twui-timeline-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 12px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-faint);
	}

	.twui-timeline-date-current {
		color: var(--twui-signal);
	}

	.twui-timeline-title {
		margin: 6px 0 0;
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 20px;
		font-weight: 500;
		color: var(--twui-ink);
	}

	.twui-timeline-title a {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--twui-rule);
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
		transition:
			color 0.15s ease,
			text-decoration-color 0.15s ease;
	}

	.twui-timeline-title a:hover {
		color: var(--twui-accent);
		text-decoration-color: var(--twui-accent);
	}

	.twui-timeline-subtitle {
		margin: 2px 0 0;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-timeline-details {
		margin: 12px 0 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: var(--twui-font-serif, 'Newsreader', Georgia, serif);
		font-size: 16px;
		color: var(--twui-ink-soft);
		list-style: none;
		padding: 0;
	}

	.twui-timeline-details li {
		position: relative;
		padding-left: 16px;
	}

	.twui-timeline-details li::before {
		content: '—';
		position: absolute;
		left: 0;
		color: var(--twui-ink-faint);
	}

	.twui-timeline-skills {
		margin-top: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		font-family: var(--twui-font-mono, 'JetBrains Mono', monospace);
		font-size: 12px;
		color: var(--twui-ink-soft);
	}

	.twui-timeline-skill-bracket {
		color: var(--twui-ink-faint);
	}
</style>
