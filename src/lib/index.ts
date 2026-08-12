// tabelawebui — tema + chrome compartilhado dos apps web.
//
// Uso:
//   import '@tabeladev/tabelawebui/theme.css';  // uma vez no app (ou em cada app da família)
//   import { Card, Table, Badge, Button, Toaster } from '@tabeladev/tabelawebui';

import CardRoot from "./components/card/Card.svelte";
import CardHeader from "./components/card/CardHeader.svelte";
import CardTitle from "./components/card/CardTitle.svelte";
import CardDescription from "./components/card/CardDescription.svelte";
import CardContent from "./components/card/CardContent.svelte";
import CardFooter from "./components/card/CardFooter.svelte";

import TimelineRoot from "./components/timeline/Timeline.svelte";
import TimelineItem from "./components/timeline/TimelineItem.svelte";
import type { TimelineItemProps } from "./components/timeline/TimelineItem.svelte";

import type {
  ButtonSize,
  ButtonVariant,
} from "./components/actions/Button.svelte";

import type { SelectOption } from "./components/forms/Select.svelte";

import type {
  FileUploadError,
  FileUploadHandler,
  FileUploadMode,
} from "./components/forms/FileUpload.svelte";

// Componentes compostos: `Card.Header`/`Card.Footer`, `Timeline.Item` — um
// único export por módulo, sem exports avulsos das partes.
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

export const Timeline: typeof TimelineRoot & {
  Item: typeof TimelineItem;
} = Object.assign(TimelineRoot, { Item: TimelineItem });

export namespace Timeline {
  export type ItemProps = TimelineItemProps;
}

// Dados
export { default as Table } from "./components/table/Table.svelte";

// Ações
export {
  buttonVariants,
  default as Button,
} from "./components/actions/Button.svelte";

export namespace Button {
  export type Variant = ButtonVariant;
  export type Size = ButtonSize;
}

// Formulários
export { default as Input } from "./components/forms/Input.svelte";
export { default as Textarea } from "./components/forms/Textarea.svelte";
export { default as Label } from "./components/forms/Label.svelte";
export { default as Field } from "./components/forms/Field.svelte";
export { default as Radio } from "./components/forms/Radio.svelte";
export { default as Checkbox } from "./components/forms/Checkbox.svelte";
export { default as Select } from "./components/forms/Select.svelte";
export { default as DatePicker } from "./components/forms/DatePicker.svelte";
export { default as FileUpload } from "./components/forms/FileUpload.svelte";

export namespace Select {
  export type Option = SelectOption;
}

export namespace FileUpload {
  export type Error = FileUploadError;
  export type Mode = FileUploadMode;
  export type Handler = FileUploadHandler;
}

// Escolha
export { default as Toggle } from "./components/choice/Toggle.svelte";
export { default as Rating } from "./components/choice/Rating.svelte";
export { default as MultiSelect } from "./components/choice/MultiSelect.svelte";
export { default as Listbox } from "./components/choice/Listbox.svelte";

// Feedback
export { default as Badge } from "./components/feedback/Badge.svelte";
export { default as Status } from "./components/feedback/Status.svelte";
export { default as StatusPill } from "./components/feedback/StatusPill.svelte";
export { default as Message } from "./components/feedback/Message.svelte";
export { default as ProgressBar } from "./components/feedback/ProgressBar.svelte";
export { default as ErrorPage } from "./components/feedback/ErrorPage.svelte";
export { default as Skeleton } from "./components/feedback/Skeleton.svelte";
export { default as Tooltip } from "./components/feedback/Tooltip.svelte";
export { default as Toaster } from "./components/feedback/Toaster.svelte";
export { toast } from "./components/feedback/toast.svelte.js";

// Overlay
export { default as Dialog } from "./components/overlay/Dialog.svelte";
export { default as Sidebar } from "./components/overlay/Sidebar.svelte";
export { default as Dropdown } from "./components/overlay/Dropdown.svelte";
export { default as FloatingActionPill } from "./components/overlay/FloatingActionPill.svelte";

// Navegação / estrutura
export { default as Tabs } from "./components/navigation/Tabs.svelte";
export { default as Accordion } from "./components/navigation/Accordion.svelte";
export { default as Stepper } from "./components/navigation/Stepper.svelte";
export { default as Carousel } from "./components/navigation/Carousel.svelte";
export { default as Nav } from "./components/navigation/Nav.svelte";
export { default as ThemeToggle } from "./components/navigation/ThemeToggle.svelte";
export { default as TabCard } from "./components/navigation/TabCard.svelte";

// Layout
export { default as Panel } from "./components/layout/Panel.svelte";
export { default as RuleCard } from "./components/layout/RuleCard.svelte";
export { default as Divider } from "./components/layout/Divider.svelte";
export { default as Eyebrow } from "./components/layout/Eyebrow.svelte";
export { default as BracketLink } from "./components/layout/BracketLink.svelte";
export { default as SectionHeading } from "./components/layout/SectionHeading.svelte";
export { default as TerminalWindow } from "./components/layout/TerminalWindow.svelte";

// Chat
export { default as ChatMessage } from "./components/chat/ChatMessage.svelte";

// Seções de landing
export { default as LandingHero } from "./components/landing/LandingHero.svelte";
export { default as LandingSteps } from "./components/landing/LandingSteps.svelte";
export { default as LandingFeatures } from "./components/landing/LandingFeatures.svelte";
export { default as LandingRoadmap } from "./components/landing/LandingRoadmap.svelte";
export { default as LandingFooter } from "./components/landing/LandingFooter.svelte";
