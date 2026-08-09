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
export { default as Textarea } from "./components/Textarea.svelte";
export { default as Label } from "./components/Label.svelte";
export { default as Field } from "./components/Field.svelte";
export { default as Radio } from "./components/Radio.svelte";
export { default as Checkbox } from "./components/Checkbox.svelte";
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
export { default as Skeleton } from "./components/Skeleton.svelte";
export { default as Tooltip } from "./components/Tooltip.svelte";

// Feedback
export { default as Message } from "./components/Message.svelte";
export { default as ProgressBar } from "./components/ProgressBar.svelte";

// Overlay
export { default as Dialog } from "./components/Dialog.svelte";
export { default as Sidebar } from "./components/Sidebar.svelte";

// Navegação / estrutura
export { default as Tabs } from "./components/Tabs.svelte";
export { default as Accordion } from "./components/Accordion.svelte";
export { default as Stepper } from "./components/Stepper.svelte";
export { default as Carousel } from "./components/Carousel.svelte";

// Escolha
export { default as Toggle } from "./components/Toggle.svelte";
export { default as Rating } from "./components/Rating.svelte";
export { default as MultiSelect } from "./components/MultiSelect.svelte";
export { default as Listbox } from "./components/Listbox.svelte";

// Pill de status (toast fixo)
export { default as StatusPill } from "./components/StatusPill.svelte";

// Pill flutuante clicável (abre painel/dialog)
export { default as FloatingActionPill } from "./components/FloatingActionPill.svelte";

// Seções de landing
export { default as LandingHero } from "./components/LandingHero.svelte";
export { default as SectionHeading } from "./components/SectionHeading.svelte";
export { default as LandingSteps } from "./components/LandingSteps.svelte";
export { default as LandingFeatures } from "./components/LandingFeatures.svelte";
export { default as LandingRoadmap } from "./components/LandingRoadmap.svelte";
export { default as LandingFooter } from "./components/LandingFooter.svelte";
export { default as TerminalWindow } from "./components/TerminalWindow.svelte";

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
