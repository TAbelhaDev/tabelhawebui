import type { ComponentDoc } from "./types";
import { previewComponents } from "./component-map";

// Descrições extraídas da tabela de componentes do README. Categorias seguem
// as seções do `src/lib/index.ts`. Cada entrada tem exemplos curados (props +
// código) ou um preview custom (componentes compostos/com snippets).

const generic = (
  name: string,
  category: string,
  description: string,
  examples: ComponentDoc["examples"],
): ComponentDoc => ({ name, category, description, examples });

const custom = (
  name: string,
  category: string,
  description: string,
): ComponentDoc => ({
  name,
  category,
  description,
  preview: previewComponents[name],
});

export const components: ComponentDoc[] = [
  // ── Dados ───────────────────────────────────────────────────────────────
  custom(
    "Table",
    "Dados",
    "Tabela com columns/rows, sort, filtro global, seleção, loading e paginação.",
  ),

  // ── Ações ───────────────────────────────────────────────────────────────
  generic(
    "Button",
    "Ações",
    "Botão com variantes default/primary/ghost/danger/outline, size, href e loading.",
    [
      {
        label: "Primary",
        props: { variant: "primary" },
        children: "Salvar",
        code: '<Button variant="primary">Salvar</Button>',
      },
      {
        label: "Default",
        children: "Cancelar",
        code: "<Button>Cancelar</Button>",
      },
      {
        label: "Ghost",
        props: { variant: "ghost" },
        children: "Ações",
        code: '<Button variant="ghost">Ações</Button>',
      },
      {
        label: "Danger",
        props: { variant: "danger" },
        children: "Remover",
        code: '<Button variant="danger">Remover</Button>',
      },
      {
        label: "Outline",
        props: { variant: "outline" },
        children: "Ver mais",
        code: '<Button variant="outline">Ver mais</Button>',
      },
      {
        label: "Loading",
        props: { variant: "primary", loading: true },
        children: "Salvando",
        code: '<Button variant="primary" loading>Salvando</Button>',
      },
      {
        label: "Link",
        props: { href: "#" },
        children: "Como link",
        code: '<Button href="/relatorios">Como link</Button>',
      },
    ],
  ),

  // ── Formulários ─────────────────────────────────────────────────────────
  generic(
    "Input",
    "Formulários",
    "Campo de texto (password, file com bind:files, ...), com invalid.",
    [
      {
        label: "Texto",
        props: { placeholder: "Mercado, Uber…" },
        code: '<Input placeholder="Mercado, Uber…" />',
      },
      {
        label: "Inválido",
        props: { placeholder: "Mercado, Uber…", invalid: true },
        code: '<Input placeholder="Mercado, Uber…" invalid />',
      },
      {
        label: "Desabilitado",
        props: { placeholder: "Mercado, Uber…", disabled: true },
        code: '<Input placeholder="Mercado, Uber…" disabled />',
      },
    ],
  ),
  generic(
    "Textarea",
    "Formulários",
    "Área de texto multi-linha com bind:value, rows e invalid.",
    [
      {
        label: "Padrão",
        props: { placeholder: "Descrição…", rows: 3 },
        code: '<Textarea placeholder="Descrição…" rows={3} />',
      },
    ],
  ),
  generic("Label", "Formulários", "Rótulo mono 13px.", [
    {
      label: "Padrão",
      children: "Preferências",
      code: '<Label for="notificar">Preferências</Label>',
    },
  ]),
  custom(
    "Field",
    "Formulários",
    "Wrapper de form: label + children + mensagem de erro.",
  ),
  generic(
    "Radio",
    "Formulários",
    "Opção única: input oculto + indicador circular.",
    [
      {
        label: "Selecionada",
        props: { checked: true, label: "Mensal" },
        code: '<Radio checked label="Mensal" />',
      },
      {
        label: "Desmarcada",
        props: { label: "Anual" },
        code: '<Radio label="Anual" />',
      },
      {
        label: "Desabilitada",
        props: { label: "Vitalício", disabled: true },
        code: '<Radio label="Vitalício" disabled />',
      },
    ],
  ),
  generic(
    "Checkbox",
    "Formulários",
    "Opção múltipla: input oculto + quadrado com ✓.",
    [
      {
        label: "Marcada",
        props: { checked: true, label: "Receber notificação push" },
        code: '<Checkbox checked label="Receber notificação push" />',
      },
      {
        label: "Desmarcada",
        props: { label: "Aceitar termos" },
        code: '<Checkbox label="Aceitar termos" />',
      },
    ],
  ),
  generic(
    "Select",
    "Formulários",
    "Listbox custom com options, bind:value, navegação por teclado e filter.",
    [
      {
        label: "Com filtro",
        props: {
          options: [
            { value: "mercado", label: "Mercado" },
            { value: "transporte", label: "Transporte" },
            { value: "saude", label: "Saúde" },
          ],
          placeholder: "Escolher categoria",
          filter: true,
        },
        code: '<Select options={options} placeholder="Escolher categoria" filter />',
      },
    ],
  ),
  generic(
    "DatePicker",
    "Formulários",
    "Seletor de data/mês com popover calendário, bind:value, min/max e locale.",
    [
      {
        label: "Data",
        props: { placeholder: "Selecione uma data" },
        code: '<DatePicker placeholder="Selecione uma data" />',
      },
      {
        label: "Mês",
        props: { mode: "month", placeholder: "Selecione um mês" },
        code: '<DatePicker mode="month" placeholder="Selecione um mês" />',
      },
    ],
  ),
  generic(
    "FileUpload",
    "Formulários",
    "Seletor de arquivos com drag-and-drop, validação e customUpload.",
    [
      {
        label: "Basic",
        props: { mode: "basic", chooseLabel: "Escolher arquivo" },
        code: '<FileUpload mode="basic" chooseLabel="Escolher arquivo" />',
      },
      {
        label: "Advanced",
        props: {
          mode: "advanced",
          chooseLabel: "Escolher arquivos",
          multiple: true,
        },
        code: '<FileUpload mode="advanced" multiple />',
      },
    ],
  ),

  generic(
    "TagInput",
    "Formulários",
    "Campo de tags: chips removíveis, autocomplete das opções e criar-na-hora.",
    [
      {
        label: "Padrão",
        props: {
          options: ["Viagem SP", "PC novo", "Aniversário"],
          value: ["Viagem SP"],
          placeholder: "Adicione uma tag…",
        },
        code: '<TagInput options={options} placeholder="Adicione uma tag…" />',
      },
    ],
  ),

  // ── Escolha ─────────────────────────────────────────────────────────────
  generic(
    "Toggle",
    "Escolha",
    "Switch on/off (hidden checkbox + role switch), com invalid.",
    [
      {
        label: "Ligado",
        props: { checked: true, label: "Categorização automática" },
        code: '<Toggle checked label="Categorização automática" />',
      },
      {
        label: "Desligado",
        props: { label: "Modo escuro" },
        code: '<Toggle label="Modo escuro" />',
      },
    ],
  ),
  generic("Rating", "Escolha", "Estrelas com max, readonly e cancel.", [
    {
      label: "3 de 5",
      props: { value: 3, label: "Confiança" },
      code: "<Rating value={3} />",
    },
    {
      label: "Readonly",
      props: { value: 4, readonly: true, label: "Confiança" },
      code: "<Rating value={4} readonly />",
    },
    {
      label: "Com cancel",
      props: { value: 5, cancel: true, label: "Confiança" },
      code: "<Rating value={5} cancel />",
    },
  ]),
  generic(
    "MultiSelect",
    "Escolha",
    "Seleção múltipla em popover com checkboxes e filter.",
    [
      {
        label: "Padrão",
        props: {
          options: [
            { value: "mercado", label: "Mercado" },
            { value: "transporte", label: "Transporte" },
            { value: "saude", label: "Saúde" },
          ],
          placeholder: "Escolher categorias",
          filter: true,
        },
        code: '<MultiSelect options={options} placeholder="Escolher categorias" filter />',
      },
    ],
  ),
  generic(
    "Listbox",
    "Escolha",
    "Lista de opções visível (single/múltipla) com filter e checkmark.",
    [
      {
        label: "Múltiplo",
        props: {
          options: [
            { value: "mercado", label: "Mercado" },
            { value: "transporte", label: "Transporte" },
            { value: "saude", label: "Saúde" },
          ],
          multiple: true,
        },
        code: "<Listbox options={options} multiple />",
      },
    ],
  ),

  // ── Feedback ────────────────────────────────────────────────────────────
  generic(
    "Badge",
    "Feedback",
    "Tag de texto pequena — default, secondary e outline.",
    [
      {
        label: "Default",
        children: "rascunho",
        code: "<Badge>rascunho</Badge>",
      },
      {
        label: "Secondary",
        props: { variant: "secondary" },
        children: "novo",
        code: '<Badge variant="secondary">novo</Badge>',
      },
      {
        label: "Outline",
        props: { variant: "outline" },
        children: "arquivado",
        code: '<Badge variant="outline">arquivado</Badge>',
      },
    ],
  ),
  generic(
    "Status",
    "Feedback",
    "Semântico success/warning/error/info, com ícone opcional.",
    [
      {
        label: "Success",
        props: { kind: "success" },
        children: "configurado",
        code: '<Status kind="success">configurado</Status>',
      },
      {
        label: "Error",
        props: { kind: "error" },
        children: "falhou",
        code: '<Status kind="error">falhou</Status>',
      },
      {
        label: "Warning",
        props: { kind: "warning" },
        children: "expirado",
        code: '<Status kind="warning">expirado</Status>',
      },
      {
        label: "Info",
        props: { kind: "info" },
        children: "sincronizado",
        code: '<Status kind="info">sincronizado</Status>',
      },
    ],
  ),
  generic(
    "StatusPill",
    "Feedback",
    "Pill fixa estilo toast (position, closable, bindable visible).",
    [
      {
        label: "Com fechar",
        props: { closable: true, position: "bottom-right" },
        children: "Atualização disponível.",
        code: '<StatusPill closable position="bottom-right">Atualização disponível.</StatusPill>',
      },
    ],
  ),
  generic(
    "Message",
    "Feedback",
    "Alerta inline info/success/warn/error, closable e life.",
    [
      {
        label: "Info",
        props: { severity: "info" },
        children: "Sincronização diária às 06:00.",
        code: '<Message severity="info">Sincronização diária às 06:00.</Message>',
      },
      {
        label: "Warn outlined",
        props: { severity: "warn", variant: "outlined", closable: true },
        children: "Uma conta está com login expirado.",
        code: '<Message severity="warn" variant="outlined" closable>Uma conta está com login expirado.</Message>',
      },
      {
        label: "Error",
        props: { severity: "error" },
        children: "Falha ao sincronizar.",
        code: '<Message severity="error">Falha ao sincronizar.</Message>',
      },
    ],
  ),
  generic(
    "ProgressBar",
    "Feedback",
    "Barra de progresso determinada/indeterminada com label.",
    [
      {
        label: "62%",
        props: { value: 62 },
        code: "<ProgressBar value={62} />",
      },
      {
        label: "Indeterminada",
        code: "<ProgressBar />",
      },
    ],
  ),
  generic(
    "ErrorPage",
    "Feedback",
    "Página de erro (status em mono/accent, title, description, actions).",
    [
      {
        label: "404",
        props: {
          status: 404,
          title: "Página não encontrada",
          description: "O link pode ter mudado.",
        },
        code: '<ErrorPage status={404} title="Página não encontrada" description="O link pode ter mudado." />',
      },
    ],
  ),
  generic(
    "Skeleton",
    "Feedback",
    "Placeholder shimmer (width/height/rounded).",
    [
      {
        label: "Linha",
        props: { width: "60%", height: "1rem" },
        code: '<Skeleton width="60%" height="1rem" />',
      },
      {
        label: "Avatar",
        props: { width: "40px", height: "40px", rounded: true },
        code: '<Skeleton width="40px" height="40px" rounded />',
      },
    ],
  ),
  generic(
    "Tooltip",
    "Feedback",
    "Tooltip CSS via wrapper (top/bottom/left/right), com aria-describedby.",
    [
      {
        label: "Topo",
        props: { label: "Abre em outra aba" },
        children: "Hover em mim",
        code: '<Tooltip label="Abre em outra aba">Hover em mim</Tooltip>',
      },
    ],
  ),
  custom(
    "Toaster",
    "Feedback",
    "Renderiza toasts + a store toast (success/error/info/warning), position configurável.",
  ),

  // ── Overlay ─────────────────────────────────────────────────────────────
  custom(
    "Dialog",
    "Overlay",
    "Modal com overlay, aria-modal, Esc/fora pra fechar e footer snippet.",
  ),
  custom(
    "Sidebar",
    "Overlay",
    "Painel side/top/bottom, overlay (drawer) ou push, colapsável.",
  ),
  custom(
    "Dropdown",
    "Overlay",
    "Menu com sombra impressa; fecha por fora/Esc.",
  ),
  generic(
    "FloatingActionPill",
    "Overlay",
    "Pill clicável flutuante (position, label, expanded → aria-expanded).",
    [
      {
        label: "Fechada",
        props: { label: "Filtros" },
        children: "Filtros",
        code: '<FloatingActionPill label="Filtros">Filtros</FloatingActionPill>',
      },
    ],
  ),

  // ── Navegação ───────────────────────────────────────────────────────────
  custom(
    "Tabs",
    "Navegação",
    "Barra de abas bindável, disabled e navegação por teclado.",
  ),
  custom(
    "Accordion",
    "Navegação",
    "Painéis colapsáveis (multiple, bindable value).",
  ),
  custom("Stepper", "Navegação", "Indicador de passos (onboarding) bindável."),
  custom("Carousel", "Navegação", "Carrossel bindável com dots e setas."),
  custom(
    "Nav",
    "Navegação",
    "Navbar: logo + links em breadcrumb separados por /.",
  ),
  custom(
    "AppShell",
    "Navegação",
    "Shell do app autenticado: sidebar desktop (brand + nav + tema/logout) e bottom nav mobile; API composta AppShell.Sidebar/BottomNav/Content.",
  ),
  generic(
    "ThemeToggle",
    "Navegação",
    "Alterna data-theme/.dark + localStorage.",
    [
      {
        label: "Padrão",
        code: "<ThemeToggle />",
      },
    ],
  ),
  generic(
    "TabCard",
    "Navegação",
    'Painel "aba de arquivo" (chrome de página).',
    [
      {
        label: "Com nota",
        props: { title: "resumo.svelte", note: "salvo" },
        children: "Conteúdo do painel.",
        code: '<TabCard title="resumo.svelte" note="salvo">Conteúdo do painel.</TabCard>',
      },
    ],
  ),

  // ── Layout ──────────────────────────────────────────────────────────────
  generic(
    "Panel",
    "Layout",
    "Contêiner com focused → borda accent; toggleable colapsável.",
    [
      {
        label: "Simples",
        props: { title: "Detalhes" },
        children: "Conteúdo.",
        code: '<Panel title="Detalhes">Conteúdo.</Panel>',
      },
      {
        label: "Toggleable",
        props: { title: "Filtros", toggleable: true },
        children: "Conteúdo colapsável.",
        code: '<Panel title="Filtros" toggleable>Conteúdo colapsável.</Panel>',
      },
      {
        label: "Focused",
        props: { title: "Atenção", focused: true },
        children: "Borda accent.",
        code: '<Panel title="Atenção" focused>Borda accent.</Panel>',
      },
    ],
  ),
  generic(
    "RuleCard",
    "Layout",
    "Card com borda-superior, ícone e prosa serif.",
    [
      {
        label: "Sem ícone",
        props: { title: "Regra" },
        children: "Card com top border e texto serif.",
        code: '<RuleCard title="Regra">Card com top border e texto serif.</RuleCard>',
      },
    ],
  ),
  generic(
    "Divider",
    "Layout",
    "Linha horizontal/vertical, solid/dashed, label central.",
    [
      {
        label: "Horizontal",
        code: "<Divider />",
      },
      {
        label: "Com label",
        props: { label: "ou" },
        code: '<Divider label="ou" />',
      },
      {
        label: "Dashed",
        props: { type: "dashed" },
        code: '<Divider type="dashed" />',
      },
    ],
  ),
  generic("Eyebrow", "Layout", "Rótulo de seção mono uppercase.", [
    {
      label: "Padrão",
      children: "tabelawebui",
      code: "<Eyebrow>tabelawebui</Eyebrow>",
    },
  ]),
  generic(
    "BracketLink",
    "Layout",
    "Link mono [ label ], colchetes acendem no hover.",
    [
      {
        label: "Padrão",
        props: { href: "#" },
        children: "repositório",
        code: '<BracketLink href="https://github.com/TabelaDev/tabelawebui">repositório</BracketLink>',
      },
    ],
  ),
  generic("SectionHeading", "Layout", "Título de seção: eyebrow + h2 + lead.", [
    {
      label: "Padrão",
      props: {
        eyebrow: "Recursos",
        title: "O que ele faz.",
        lead: "Um resumo curto.",
      },
      code: '<SectionHeading eyebrow="Recursos" title="O que ele faz." lead="Um resumo curto." />',
    },
  ]),
  generic(
    "TerminalWindow",
    "Layout",
    "Janela de terminal: barra de dots + title + conteúdo.",
    [
      {
        label: "Padrão",
        props: { title: "bun run dev" },
        children: "$ bun run dev\n  VITE v7 ready",
        code: '<TerminalWindow title="bun run dev">$ bun run dev</TerminalWindow>',
      },
    ],
  ),
  generic(
    "Wordmark",
    "Layout",
    "Wordmark Tabela + sufixo em accent; herda fonte/tamanho do contexto.",
    [
      {
        label: "Padrão",
        code: '<Wordmark prefix="Tabela" suffix="Fin" />',
      },
    ],
  ),

  // ── Card ────────────────────────────────────────────────────────────────
  custom(
    "Card",
    "Card",
    "Painel com header e conteúdo; API composta Card.Header/Title/Description/Content/Footer.",
  ),

  // ── Timeline ────────────────────────────────────────────────────────────
  custom(
    "Timeline",
    "Timeline",
    "Linha do tempo (Timeline.Item com trilho, dot e skills).",
  ),

  // ── Chat ────────────────────────────────────────────────────────────────
  generic(
    "ChatMessage",
    "Chat",
    "Bolha de chat (role user/assistant, streaming → ellipsis pulsante).",
    [
      {
        label: "Usuário",
        props: { role: "user", content: "Categoriza minhas compras?" },
        code: '<ChatMessage role="user" content="Categoriza minhas compras?" />',
      },
      {
        label: "Assistente",
        props: {
          role: "assistant",
          content: "Pronto — 42 lançamentos categorizados.",
        },
        code: '<ChatMessage role="assistant" content="Pronto — 42 lançamentos categorizados." />',
      },
      {
        label: "Streaming",
        props: { role: "assistant", streaming: true },
        code: '<ChatMessage role="assistant" streaming />',
      },
    ],
  ),

  // ── Landing ─────────────────────────────────────────────────────────────
  custom(
    "Landing",
    "Landing",
    "Seções de landing compostas: Landing.Hero, Landing.Steps, Landing.Features, Landing.Roadmap, Landing.Footer.",
  ),
];
