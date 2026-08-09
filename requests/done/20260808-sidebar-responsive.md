# Sidebar responsiva + colapsável + overlay + animação

> Sidebar v2: vira layout push (desktop) / drawer overlay (mobile), ganha colapso, prop pra desligar o backdrop e transições de abrir/fechar.

- **autor**: ianptkcs
- **data**: 2026-08-08
- **prioridade**: medium

## O que

Evoluir `Sidebar` de "drawer overlay fixo" para um componente que:

- **Push (desktop)**: entra no fluxo do layout (estático), empurra o conteúdo do app
  num flex container montado pelo consumer; rail colapsável via botão no header.
- **Overlay (mobile)**: torna-se drawer fixo full-width por cima, com overlay —
  em qualquer `mode`, quando a viewport é mobile (< 768px).
- **Animação** de abrir/fechar (fade no overlay + slide no painel), respeitando
  `prefers-reduced-motion`.
- **Prop `overlay`** para desligar o backdrop (use caso não queira máscara).

## Por que / contexto

O tabelafin/portfolio que usa `Sidebar` hoje só tem o modelo drawer fixo, sem
animação e sem comportamento responsivo; apps que querem sidebar persistente em
desktop acabam duplicando margens/CSS. Centraliza na lib: breakpoint,
colapsar, animação e a11y dos botões.

## API proposta

Propriedades novas (todas opcionais; defaults preservam o comportamento atual):

- `mode: 'overlay' | 'push'` (default `'overlay'`) — `push` entra no fluxo do layout
  no desktop (≥ 769px); em mobile (< 768px) vira drawer overlay como o `overlay`
- `overlay?: boolean` (default `true`) — desliga o backdrop (em qualquer viewport)
- `collapsible?: boolean` (default `false`) + `collapsed` bindable (rail no desktop)
- breakpoint responsivo **fixo em 768px** (hardcoded no componente, sem prop);
  mobile = drawer full-width (`--twui-sidebar-width-mobile`, default `100vw`)

Forma de uso (push + colapsável, desktop):

```svelte
<div class="flex min-h-screen"> <!-- consumer empurra o conteúdo com flexbox -->
	<Sidebar mode="push" collapsible bind:collapsed bind:open title="Menu">
		<nav>nav items / logo ...</nav>
	</Sidebar>
	<main class="flex-1">conteúdo da página</main>
</div>
```

## Escopo / fora de escopo

- dentro: `mode` push/overlay, `overlay` prop, colapsar (botão + `collapsed` bindable),
  responsivo entre push/overlay por breakpoint 768px fixo, animações com
  reduced-motion, a11y dos botões, largura custom por CSS vars
  (`--twui-sidebar-width`, `--twui-sidebar-width-collapsed`, `--twui-sidebar-width-mobile`)
- fora: estado de colapso por viewport (quem decide é o app), snippet de conteúdo,
  margem automática do corpo (o consumer compõe com flexbox), drag/resize,
  breakpoint configurável por prop

## Critérios de aceite

- [ ] Responsivo: em < 768px vira drawer overlay full-width; em ≥ 768px mantém
      overlay ou troca pra push estático conforme `mode`
- [ ] `collapsible` no desktop reduz para rail (`--twui-sidebar-width-collapsed`), botão com `aria-expanded`
- [ ] `overlay={false}` remove o backdrop (em qualquer viewport)
- [ ] `open` bindable continua; `<Escape>` fecha; `aria-modal`/`role="dialog"` seguem
- [ ] Animação fade+slide no abrir/fechar respeitando `prefers-reduced-motion`
- [ ] `bun run check`, `bun run lint` e `bun run build` passam

## Docs a atualizar

- [ ] README (tabela de componentes, linha `Sidebar`)
- [ ] CHANGELOG (entry `0.9.0`)
