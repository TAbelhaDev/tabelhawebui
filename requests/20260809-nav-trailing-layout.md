# Regressões visuais pós-migração (Nav trailing, Timeline dot, RuleCard)

- **autor**: opencode (session no ianptkcs/portfolio)
- **data**: 2026-08-09
- **prioridade**: high

## O que

Três problemas de UI detectados no portfolio/template após a migração para
`@tabeladev/tabelawebui`:

1. **`Nav` trailing empilha** — o `.twui-nav-trailing` não tem layout: os
   controles de locale (`<details>`) e tema (`<button>`) ficam um em cima do
   outro em vez de lado a lado.
2. **`TimelineItem` dot quebrado** — o `.twui-timeline-dot` é um `<span>`
   inline: `width`/`height` são ignorados (vira barra vertical / elipse) e
   `margin: auto` não centra (sai da linha do trilho).
3. **`RuleCard` sem borda completa** — só `border-top`; o usuário quer full
   border no padrão dos cards da home (`TabCard`).

## Por que / contexto

Sem isso, todo app usando `trailing` com 2+ controles precisa de CSS paralelo
(contra a regra do design system), a timeline renderiza círculos como elipses
fora do trilho, e os cards do about destoam da home.

## Fix aplicado

- `Nav`: `.twui-nav-trailing { display: flex; align-items: center; gap: 12px; }`
- `TimelineItem`: `.twui-timeline-dot { display: block; ... }`
- `RuleCard`: `border: 1px solid var(--twui-rule); background: var(--twui-paper-raised); padding: 24px;`

## Escopo / fora de escopo

- dentro: os três componentes da lib
- fora: mudanças de layout nos apps consumidores

## Critérios de aceite

- [x] Controles do `trailing` lado a lado (claro e escuro)
- [x] Dots da timeline circulares e alinhados ao trilho
- [x] Cards do about com borda completa
- [x] `bun run check`, `bun run lint` e `bun run build` passam

## Docs a atualizar

- [x] CHANGELOG (entry 0.14.0)
