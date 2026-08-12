<script lang="ts">
	import { Button, Landing } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const steps = [
		{ number: '01', color: 'var(--twui-accent)', title: 'Escolha', body: 'Pegue só o que o seu app precisa.' },
		{ number: '02', color: 'var(--twui-signal)', title: 'Monte', body: 'Combine módulos e temas do seu jeito.' }
	];

	const code = `<Landing.Hero
	eyebrow="Sistema modular"
	title={heroTitle}
	lead="Um componente, várias combinações."
	actions={heroActions}
/>
<Landing.Steps {steps} />
<Landing.Features {features} />
<Landing.Roadmap {items} />
<Landing.Footer name="TabelaWebUI" tagline="Design system" />`;
</script>

{#snippet heroTitle()}
	Tabela<span style="color: var(--twui-accent);">Web</span>UI
{/snippet}

{#snippet sparkles()}
	<span aria-hidden="true">✦</span>
{/snippet}

<ExampleCard label="Hero + Steps + Features + Roadmap + Footer" code={code}>
	<div class="twui-docs-landing-wrap">
		<Landing.Hero
			eyebrow="Sistema modular"
			title={heroTitle}
			lead="Um design system modular: pegue só o que o seu app precisa."
			note="Tema Catppuccin · Mono + serif"
		>
			{#snippet actions()}
				<Button variant="primary" size="sm">Começar</Button>
			{/snippet}
		</Landing.Hero>
		<Landing.Steps {steps} />
		<Landing.Features
			features={[
				{
					icon: sparkles,
					iconBg: 'color-mix(in srgb, var(--twui-accent) 12%, transparent)',
					iconColor: 'var(--twui-accent)',
					title: 'Componentes',
					body: 'Formulários, feedback, overlays e navegação prontos.'
				}
			]}
		/>
		<Landing.Roadmap items={[{ icon: sparkles, label: 'Mais componentes' }]} />
		<Landing.Footer name="TabelaWebUI" tagline="Design system" license="AGPL-3.0" />
	</div>
</ExampleCard>

<style>
	.twui-docs-landing-wrap {
		width: 100%;
		max-width: 26rem;
		display: flex;
		flex-direction: column;
	}
</style>
