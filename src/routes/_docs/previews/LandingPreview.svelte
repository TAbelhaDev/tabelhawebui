<script lang="ts">
	import { Button, Landing } from '$lib';
	import ExampleCard from '../ExampleCard.svelte';

	const steps = [
		{ number: '01', color: 'var(--twui-accent)', title: 'Escolha', body: 'Pegue só o que o seu app precisa.' },
		{ number: '02', color: 'var(--twui-signal)', title: 'Monte', body: 'Combine módulos e temas do seu jeito.' }
	];

	const code = `<Landing>
	<Landing.Hero
		eyebrow="Sistema modular"
		title={heroTitle}
		lead="Um componente, várias combinações."
	>
		{#snippet actions()}...{/snippet}
	</Landing.Hero>

	<Landing.Section>
		<Landing.Section.Heading eyebrow="Como funciona" title="Dois passos." />
		<Landing.Steps {steps} />
	</Landing.Section>

	<Landing.Section>
		<Landing.Section.Heading eyebrow="Recursos" title="O que tem." />
		<Landing.Features {features} />
	</Landing.Section>
</Landing>`;
</script>

{#snippet heroTitle()}
	Tabela<span style="color: var(--twui-accent);">Web</span>UI
{/snippet}

{#snippet sparkles()}
	<span aria-hidden="true">✦</span>
{/snippet}

<ExampleCard label="Landing compound" code={code}>
	<Landing>
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
		<Landing.Section>
			<Landing.Section.Heading eyebrow="Como funciona" title="Dois passos." />
			<Landing.Steps {steps} />
		</Landing.Section>
		<Landing.Section>
			<Landing.Section.Heading eyebrow="Recursos" title="O que tem." />
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
		</Landing.Section>
	</Landing>
</ExampleCard>
