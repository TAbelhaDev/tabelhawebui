# Absorção do PrimeNG — análise e plano de ação

> **O que é:** o [PrimeNG](https://github.com/primefaces/primeng) (MIT, ~100
> componentes) é o maior componente UI Angular do mercado. Este documento mapeia
> o que vale a pena **absorver** pro `tabelawebui` (Svelte 5, só tokens
> `--twui-*`, zero dependência) e o que **não** vale.
>
> **Método:** absorver **modelo de API, UX e acessibilidade** — não código
> (framework diferente: Angular ↔ Svelte). Cada componente nosso foi comparado
> com o equivalente deles pra ver se a abordagem deles traz vantagem.
> Referências: docs por componente em `https://primeng.dev/<nome>` e texto pra
> LLM em `https://primeng.dev/llms/components/<nome>.md`.

---

## 1. Cobertura atual ↔ PrimeNG (comparação)

| Nossa lib          | PrimeNG                                                                                             | Vantagem deles                                                                  | Absorver                               |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| `Button`           | `pButton` (`severity`, `outlined`/`text`/`link` booleanos, `size`, `icon`, `loading`, `badge`)      | `loading` (disabled + spinner); modificadores booleanos compõem melhor que enum | Sim: `loading`                         |
| `Card`             | `pCard` (`header`/`subheader`/`footer` templates)                                                   | Mesmo nível do nosso `Card` composto                                            | Não                                    |
| `Badge`/`Status`   | `pBadge` (`value`+`severity`+`size`), `pTag` (`severity`+`icon`+`rounded`)                          | `Tag` com `icon`                                                                | Parcial: `Status` aceitar `icon`       |
| `Input`/`Textarea` | `pInputText` (directive) com estado `invalid` (`aria-invalid`)                                      | Estado de erro/validação                                                        | Sim: prop `invalid` + `aria-invalid`   |
| `Label`            | label nativo do Angular                                                                             | —                                                                               | Não                                    |
| `Select`           | `pSelect` (`optionLabel`/`optionValue`, `filter` buscável, `editable`, `showClear`)                 | `filter`; opções heterogêneas sem mapear                                        | Parcial: `filter`                      |
| `Radio`/`Checkbox` | `pRadioButton`/`pCheckbox` (hidden input + indicador)                                               | Mesmo padrão que o nosso                                                        | Não                                    |
| `DatePicker`       | `pDatePicker` (`showTime`, `selectionMode` range, `disabledDays`/`disabledDates`, `numberOfMonths`) | Range, datetime, dias desabilitados                                             | Futuro (relevante pro tabelacal)       |
| `Toaster`/`toast`  | `pToast` (`position`, `sticky`, `life`, `closable`)                                                 | `position` configurável; `sticky`                                               | Sim: `position` + `sticky`             |
| `Timeline`         | `pTimeline` (`align`, `layout`, templates `opposite`/`marker`/`content`)                            | Flexível via templates                                                          | Não (o nosso é tailored pro portfolio) |
| `Divider`          | `pDivider` (`layout` h/v, `type` dashed/dotted, `align`, texto central)                             | Vertical, dashed/dotted, label central                                          | Sim (barato)                           |
| `Panel`            | `pPanel` (`header` + `toggleable`)                                                                  | Colapsável                                                                      | Sim: `toggleable`                      |
| `Dropdown`         | `pMenu`/`pContextMenu` (fecha em outside-click/Esc, teclado, foco)                                  | Nosso `<details>` **não** fecha clicando fora                                   | Sim: fechar por fora + Esc             |
| `Nav`              | `pBreadcrumb` (`model`, `home`, separator custom)                                                   | item `home`, separator custom                                                   | Parcial                                |
| `ThemeToggle`      | não tem (é serviço)                                                                                 | —                                                                               | Não                                    |
| `Table`            | `pTable` (sort/filter/selection/paginator/scroll/group/stateful)                                    | Modelo completo                                                                 | Sim (Tier 1)                           |

**Conclusão:** nossa lib está no nível deles nos componentes básicos; as
vantagens reais estão em (a) `Table` completo, (b) estados (erro/loading/vazio)
e (c) micro-UX de overlay (fechar por fora/Esc). Detalhado abaixo.

## 2. Melhorias priorizadas nos componentes que já temos

1. **`Dropdown`** — fechar no `pointerdown` fora + `Esc` (hoje `<details>` fica
   aberto até outro toggle). Também `aria-expanded`/foco no menu.
2. **`Input`/`Textarea`** — prop `invalid?: boolean` → borda `--twui-danger` +
   `aria-invalid`. (Padrão: forms do tabelaedu/TabelaFin.)
3. **`Button`** — prop `loading?: boolean` → disabled + spinner inline
   (barato, reusa o `--twui-*`).
4. **`Panel`** — `toggleable` (colapsável com chevron) e `title`/`header`.
5. **`Toaster`/`toast`** — `position` (top-right default) e `sticky`/`duration`
   explícito (já temos `duration` no store; falta expor `position`).
6. **`Divider`** — `layout: 'horizontal' | 'vertical'` e `type: solid|dashed`,
   com label central opcional.
7. **`Status`** — prop `icon` (snippet) além do `●` atual.
8. **`Select`** — `filter` (buscável no popover) quando `options` crescer;
   `optionLabel`/`optionValue` pra objetos heterogêneos.

## 3. Plano de implementação (novos)

### Tier 1 — fazer (alta prioridade)

| Componente                                                                         | Modelo PrimeNG a seguir                                                                                                                                                                            |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Table v2** — sort, filtro global, selection, empty/loading, paginator controlado | `sortField`/`sortOrder` + `aria-sort`; `filters`+`globalFilterFields`; selection single/multiple; `emptymessage` → snippet `empty`; paginator `first`/`rows`/`onPageChange` + `rowsPerPageOptions` |
| `Tabs`                                                                             | `value` bindable, `disabled`, navegação por teclado                                                                                                                                                |
| `Toggle` (switch)                                                                  | hidden checkbox + `switch` role + `checked` bindable + `invalid`                                                                                                                                   |
| `Dialog`                                                                           | overlay + `aria-modal` + focus trap + Esc/outside                                                                                                                                                  |
| `Tooltip`                                                                          | `data-tooltip` + CSS `::after` (sem dep)                                                                                                                                                           |
| `Skeleton`                                                                         | shimmer com tokens                                                                                                                                                                                 |
| `ProgressBar`                                                                      | `value` + determinada/indeterminada                                                                                                                                                                |

### Tier 2 — queridos (adicionados por decisão do Ian)

| Componente         | Modelo PrimeNG a seguir                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `Message`          | `severity` (info/success/warn/error) + `variant` (simple) + `size` + `closable` + `life`; `role="alert"` (aria-live assertive) |
| `Accordion`        | múltiplos painéis, `value`/multiple, `disabled`, chevron                                                                       |
| `Rating`           | `value`/`readonly`/`cancel`; estrelas com tokens                                                                               |
| `Sidebar`/`Drawer` | `visible` bindable, `position` (left/right/top/bottom), overlay + `aria-modal`                                                 |
| `Stepper`          | passos com `value`/`linear`, para onboarding (tabelaedu)                                                                       |
| `Carousel`         | `value`/`page` + navegação; pra landing                                                                                        |
| `MultiSelect`      | `options`+`optionLabel`/`optionValue`, `display` (comma/chip), `showClear`, `filter`, combobox+listbox a11y                    |
| `Listbox`          | `options`, `multiple`+`checkbox`, `checkmark`, `filter`, listbox role                                                          |

### Tier 3 — sob demanda (quando um app precisar)

`Fieldset`, `Avatar`, `Chip`, `SplitButton`, `Breadcrumb`, `ContextMenu`,
`ProgressSpinner`, `EmptyState`.

## 4. NÃO vale (registrado, fora de escopo)

- **Data pesada** (dados da família são pequenos): `VirtualScroller`, `Tree`,
  `TreeTable`, `DataView`, `PickList`, `OrderList`, `OrgChart`.
- **Integração Angular** (sem equivalente em Svelte): `KeyFilter`,
  `FloatLabel`, `IftaLabel`, `IconField`, `InputGroup`, `ClassNames`,
  `StyleClass`, `UseStyle`, `Bind`, `Fluid`, `AutoFocus`, `AnimateOnScroll`,
  `Ripple` (estética material), serviços (`DynamicDialog`, `MessageService`).
- **Enterprise/específico**: `FileUpload`, `Editor`, `Chart` (wrapper de dep),
  `ColorPicker`, `InputMask`, `InputNumber`, `InputOtp`, `InputTags`,
  `Password` (meter), `CascadeSelect`, `AutoComplete`, `Knob`, `Slider`,
  `SelectButton`, `ToggleButton`.
- **Menu/app shell**: `Menubar`, `MegaMenu`, `PanelMenu`, `TieredMenu`, `Dock`,
  `SpeedDial`, `ScrollTop`.
- **Media**: `Galleria`, `Image`, `ImageCompare`, `BlockUI`, `Inplace`,
  `ScrollPanel`, `Terminal`.

## 5. Padrões cross-cutting que valem copiar

1. **Modelo de `Table`** — sort/filter/selection/paginator/empty/loading num
   componente, cada feature opcional.
2. **Paginator controlado** — `first`/`rows`/callback (permite server-side).
3. **a11y** — `aria-sort`, `aria-live` no report, `aria-current`,
   `aria-modal`+focus trap no dialog, roles combobox/listbox, hidden native
   input (checkbox/radio/switch) pra navegação por teclado.
4. **i18n via props/labels** — eles centralizam em `locale`; a gente faz por
   prop (nossa convenção já).

## 6. Ordem sugerida

1. Melhorias nos existentes (seção 2) + **Table v2**.
2. `Tabs`, `Toggle`, `Skeleton`, `ProgressBar` (baratos, tabelaedu destrava).
3. `Dialog` + `Tooltip` (overlay, tira dep do bits-ui).
4. Tier 2 (Message, Accordion, Rating, Sidebar/Drawer, Stepper, Carousel,
   MultiSelect, Listbox) conforme demanda dos apps.
