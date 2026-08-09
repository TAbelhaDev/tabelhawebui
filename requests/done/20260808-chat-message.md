# ChatMessage

> Bubbles de mensagem de chat presentacionais (role + streaming state), sem
> lógica de API/SSE. Vem do uso real no tabelafin; aqui só o render dos bubbles.

- **autor**: tabelafin
- **data**: 2026-08-08
- **prioridade**: medium

## O que

Componente `ChatMessage` que renderiza um bubble de mensagem de chat: role
(`user` | `assistant`), conteúdo, e estado de streaming (indicador de
digitação/espera). Pensado pra listas de conversa tipo "Chat IA".

## Por que / contexto

Sem ele, cada app duplica o mesmo markup de bubble + indicação de streaming:

```svelte
<div class="{msg.role === 'user' ? 'items-end' : 'items-start'}">
  <span>Você / IA</span>
  <div class="max-w-[85%] rounded px-3 py-2 {msg.role === 'user'
    ? 'bg-accent-soft text-accent'
    : 'bg-paper-raised text-ink'}">
    {msg.content}
  </div>
</div>
```

Hoje isso está inline no tabelafin (`ChatWidget`), com o mesmo problema de
contraste já resolvido: papel do usuário usa `accent-soft`, assistant usa
`paper-raised` — mas ainda é CSS duplicado que deveria viver na lib.

Importante: **fora de escopo** o widget/containers de chat (isso fica no app
ou outro componente). Aqui apenas o bubble, nos dois roles, com a diferença
de ênfase e o estado vazio.

## API proposta

```svelte
<ChatMessage
  role="user"
  content="oi teste"
  streaming={false}
  name="Você"
/>
```

**Props:**

- `role` (`'user' | 'assistant'`, required) — posicionamento e estilo do bubble
- `content` (string) — texto da mensagem
- `streaming` (boolean, default `false`) — quando `true` e `content` vazio,
  mostra o indicador (`animate-pulse` com ellipsis)
- `name` (string, default `'user'`→`'Você'`, `'assistant'`→`'IA'`) — label do
  autor (`aria-label` do bubble)

**Estilo (follow the theme tokens):**

- `user`: alinhado `flex-end`, bubble `var(--twui-accent-soft)` + `var(--twui-accent)`
- `assistant`: alinhado `flex-start`, bubble `var(--twui-paper-raised)` + `var(--twui-ink)`
- Nome: `var(--twui-ink-faint)` mono 12px
- Streaming sem conteúdo: apenas o ellipsis pulsando, sem bubble preenchido

## Escopo / fora de escopo

- dentro: bubble simples com role/name/streaming, export do `src/lib/index.ts`
- fora: logica de API/SSE/fetch, lista de mensagens, autoscroll de conversa,
  input/form, containers (Dialog/Panel) — o `ChatMessage` não gerencia a
  lista nem o stream; o consumer guarda `messages` e itera

## Critérios de aceite

- [ ] Exportado do `src/lib/index.ts`
- [ ] Renderiza sempre `role="user"|"assistant"` com estilos distintos (soft-theme)
- [ ] `streaming` com content vazio mostra indicador pulsante; com content,
      mostra o texto normalmente
- [ ] Nome opcional com default por role
- [ ] Usa só CSS vars do tema (`--twui-accent`, `--twui-accent-soft`,
      `--twui-paper-raised`, `--twui-ink`, `--twui-ink-faint`)
- [ ] `bun run check`, `bun run lint` e `bun run build` passam

## Docs a atualizar

- [ ] README (tabela de componentes)
- [ ] CHANGELOG (entry novo)
