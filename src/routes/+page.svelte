<script lang="ts">
	import {
		Accordion,
		Badge,
		BracketLink,
		Button,
		Card,
		Checkbox,
		Divider,
		Eyebrow,
		Field,
		Input,
		Label,
		Message,
		Panel,
		ProgressBar,
		Rating,
		Select,
		Skeleton,
		Status,
		Stepper,
		Table,
		Tabs,
		ThemeToggle,
		Toggle,
		Tooltip
	} from '$lib';

	// Visual bench for the library: every component on one page, in whichever
	// theme the toggle is set to. It is the fastest way to catch a token that
	// only works on one ground, and the surface a visual regression run would
	// point at.

	let checked = $state(true);
	let toggled = $state(false);
	let rating = $state(3);
	let tab = $state('todas');
	let step = $state('conta');
	let categoria = $state('mercado');
	let busca = $state('');

	const categorias = [
		{ value: 'mercado', label: 'Mercado' },
		{ value: 'transporte', label: 'Transporte' },
		{ value: 'saude', label: 'Saúde', disabled: true }
	];

	const rows = [
		{ id: '1', Data: '01/08', Descrição: 'Mercado', Valor: 'R$ 120,00' },
		{ id: '2', Data: '02/08', Descrição: 'Uber', Valor: 'R$ 25,58' },
		{ id: '3', Data: '03/08', Descrição: 'Farmácia', Valor: 'R$ 80,10' }
	];
</script>

<svelte:head>
	<title>tabelawebui — showcase</title>
</svelte:head>

<main>
	<header>
		<div>
			<Eyebrow>tabelawebui</Eyebrow>
			<h1>Showcase</h1>
			<p>Todos os componentes, nos dois temas. Use o toggle para conferir cada um no claro e no escuro.</p>
		</div>
		<ThemeToggle />
	</header>

	<Divider />

	<section>
		<h2>Ações</h2>
		<div class="row">
			<Button variant="primary">Salvar</Button>
			<Button>Cancelar</Button>
			<Button variant="primary" loading>Salvando</Button>
			<Tooltip label="Abre a transação em outra aba">
				<Button>Com tooltip</Button>
			</Tooltip>
			<BracketLink href="https://github.com/TabelaDev/tabelawebui">repositório</BracketLink>
		</div>
	</section>

	<section>
		<h2>Estado</h2>
		<div class="row">
			<Badge>rascunho</Badge>
			<Badge variant="secondary">novo</Badge>
			<Badge variant="outline">arquivado</Badge>
			<Status kind="success">configurado</Status>
			<Status kind="error">falhou</Status>
		</div>
		<div class="col">
			<Message severity="info">Sincronização diária às 06:00.</Message>
			<Message severity="warn" variant="outlined">Uma conta está com login expirado.</Message>
			<ProgressBar value={62} label />
			<Skeleton width="60%" height="1rem" />
		</div>
	</section>

	<section>
		<h2>Formulário</h2>
		<div class="col narrow">
			<Field label="Descrição">
				<Input bind:value={busca} placeholder="Mercado, Uber…" />
			</Field>
			<Field label="Categoria">
				<Select options={categorias} bind:value={categoria} filter />
			</Field>
			<Label for="notificar">Preferências</Label>
			<Checkbox bind:checked label="Receber notificação push" />
			<Toggle bind:checked={toggled} label="Categorização automática" />
			<Rating bind:value={rating} label="Confiança na categorização" />
		</div>
	</section>

	<section>
		<h2>Navegação</h2>
		<Tabs items={[
			{ value: 'todas', label: 'Todas' },
			{ value: 'receitas', label: 'Receitas' },
			{ value: 'despesas', label: 'Despesas' }
		]} bind:value={tab} />
		<p class="muted">aba ativa: {tab}</p>

		<Stepper items={[
			{ value: 'conta', label: 'Conta' },
			{ value: 'banco', label: 'Banco' },
			{ value: 'pronto', label: 'Pronto' }
		]} bind:value={step} />
		<p class="muted">passo: {step}</p>

		<Accordion items={[
			{ value: 'sync', title: 'Com que frequência sincroniza?' },
			{ value: 'byok', title: 'Preciso de chave de IA própria?' }
		]} />
	</section>

	<section>
		<h2>Dados</h2>
		<Table columns={['Data', 'Descrição', 'Valor']} rows={rows} sortable filterable />
	</section>

	<section>
		<h2>Contêineres</h2>
		<div class="row wrap">
			<Card title="Resumo" description="agosto/2026">
				<p class="muted">R$ 3.180,42 em 42 lançamentos.</p>
			</Card>
			<Panel title="Detalhes" toggleable defaultOpen>
				<p class="muted">Conteúdo colapsável.</p>
			</Panel>
		</div>
	</section>
</main>

<style>
	main {
		max-width: 60rem;
		margin: 0 auto;
		padding: 2rem 1.5rem 6rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
	}

	h1 {
		margin: 0.25rem 0 0.5rem;
		font-size: 1.75rem;
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--twui-ink-faint, var(--twui-ink));
	}

	p {
		margin: 0;
		max-width: 46rem;
	}

	.muted {
		color: var(--twui-ink-soft, var(--twui-ink));
		font-size: 0.875rem;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.row.wrap {
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.narrow {
		max-width: 26rem;
	}
</style>
