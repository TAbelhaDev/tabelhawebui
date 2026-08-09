# FloatingActionPill

> Pill flutuante clicável (aciona painel/dialog) no canto da tela. Estilo idêntico ao StatusPill, mas com comportamento de ação em vez de status display-only.

- **autor**: tabelafin
- **data**: 2026-08-08
- **prioridade**: medium

## O que

Componente `FloatingActionPill` parecido com o `StatusPill` (pill fixa no canto, com a sombra dura `var(--twui-shadow-offset)`) mas **clicável**: botão que abre um painel/dialog/chat ao invés de só exibir informação estática. Usado no tabelafin para o acesso ao chat de IA (a pill flutuante substituiu o botão da sidebar).

## Por que / contexto

Sem esse request, cada app que precisa de um botão flutuante de ação duplica o mesmo CSS do StatusPill trocando a semântica de `<div role="status">` por `<button>`, mais a posição fixa e o efeito de press no clique. Hoje o tabelafin tem isso inline:

```svelte
<button
  class="fixed bottom-20 left-4 z-40 border border-rule bg-paper-raised px-4 py-2 font-mono text-xs text-ink shadow-[3px_3px_0_0_var(--twui-rule)] transition-all hover:text-accent active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:bottom-6"
  onclick={() => (chatOpen = true)}>...</button>
```

Um componente da lib centraliza: posições, efeito de sombra, feedback de press, a11y (`<button>`, `aria-expanded`, `aria-label`).

## API proposta

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		position = 'bottom-left',
		expanded = false,
		expandedLabel = 'Fechar',
		children,
		class: className = ''
	}: {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		expanded?: boolean;
		label: string;
		expandedLabel?: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<button
	type="button"
	class="twui-floating-action-pill twui-floating-action-pill-{position} {className}"
	aria-label={expanded ? expandedLabel : label}
	aria-expanded={expanded}
	{...restProps}
	onclick={...}
>
	{@render children()}
</button>
```

**Props:**

- `position` (`'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`, default `'bottom-right'`) — canto fixo da tela (mesmo vocabulário do `StatusPill`)
- `label` (string, required) — `aria-label` do botão
- `expanded` (boolean, default `false`) — se o painel que ele abre está aberto (dedos `aria-expanded`)
- `children` (Snippet) — conteúdo da pill
- Qualquer prop de componente `button` (repassada via `{...restProps}`)

**Exemplo de uso:**

```svelte
<FloatingActionPill position="bottom-left" label="Abrir chat de IA" expanded={chatOpen} onclick={() => (chatOpen = !chatOpen)}>
	<ChatIcon /> Chat IA
</FloatingActionPill>
```

## Escopo / fora de escopo

- dentro: pill flutuante clicável com sombra offset, posições fixas, `aria-expanded`, feedback de press, export do `src/lib/index.ts`
- fora: não implementa o painel/dialog (fica no consumer), não gerencia foco, não tem variantes de tamanho além da pill padrão

## Critérios de aceite

- [ ] Exportado do `src/lib/index.ts`
- [ ] Renderiza `<button>` (não `<div>`), com `aria-label` e `aria-expanded`
- [ ] Posições iguais às do `StatusPill`
- [ ] Sombra dura `var(--twui-shadow-offset)` + estado de press (offset some ao clicar)
- [ ] Usa só CSS vars do tema (`--twui-rule`, `--twui-paper-raised`, `--twui-ink`, `--twui-accent`)
- [ ] `bun run check`, `bun run lint` e `bun run build` passam

## Docs a atualizar

- [ ] README (tabela de componentes)
- [ ] CHANGELOG (entry novo)
