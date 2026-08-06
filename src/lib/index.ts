// tabelawebui — tema + chrome compartilhado dos apps web.
//
// Uso:
//   import '@tabela/webui/theme.css';  // uma vez no app (ou em cada app da família)
//   import { Card, Table, Badge, Button, Toaster } from 'tabelawebui';

import CardRoot from "./components/Card.svelte";
import CardHeader from "./components/CardHeader.svelte";
import CardTitle from "./components/CardTitle.svelte";
import CardDescription from "./components/CardDescription.svelte";
import CardContent from "./components/CardContent.svelte";
import CardFooter from "./components/CardFooter.svelte";

export { default as Table } from "./components/Table.svelte";
export { default as Badge } from "./components/Badge.svelte";
export { default as Panel } from "./components/Panel.svelte";
export { default as Status } from "./components/Status.svelte";
export { default as Input } from "./components/Input.svelte";
export { default as Label } from "./components/Label.svelte";
export { default as Select } from "./components/Select.svelte";
export { default as DatePicker } from "./components/DatePicker.svelte";
export { default as Toaster } from "./components/Toaster.svelte";
export { toast } from "./components/toast.svelte.js";
export { buttonVariants, default as Button } from "./components/Button.svelte";

// Chrome de página (portfolio)
export { default as TabCard } from "./components/TabCard.svelte";
export { default as Timeline } from "./components/Timeline.svelte";
export { default as TimelineItem } from "./components/TimelineItem.svelte";
export { default as RuleCard } from "./components/RuleCard.svelte";
export { default as Nav } from "./components/Nav.svelte";
export { default as ThemeToggle } from "./components/ThemeToggle.svelte";
export { default as Dropdown } from "./components/Dropdown.svelte";

// Utilitários
export { default as Divider } from "./components/Divider.svelte";
export { default as Eyebrow } from "./components/Eyebrow.svelte";
export { default as BracketLink } from "./components/BracketLink.svelte";

// Card composto: `<Card title="..." description="...">` (API simples) e
// `Card.Header` / `Card.Title` / `Card.Description` / `Card.Content` /
// `Card.Footer` (API composta shadcn) coexistem.
export const Card: typeof CardRoot & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
} = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
