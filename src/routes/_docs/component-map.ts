import {
  Accordion,
  AppShell,
  Badge,
  BracketLink,
  Button,
  Card,
  Carousel,
  ChatMessage,
  Checkbox,
  DatePicker,
  Dialog,
  Divider,
  Dropdown,
  ErrorPage,
  Eyebrow,
  Field,
  FileUpload,
  FloatingActionPill,
  Input,
  Label,
  Landing,
  Listbox,
  Message,
  MultiSelect,
  Nav,
  Panel,
  ProgressBar,
  Radio,
  Rating,
  RuleCard,
  SectionHeading,
  Select,
  Sidebar,
  Skeleton,
  Status,
  StatusPill,
  Stepper,
  TabCard,
  Table,
  Tabs,
  TagInput,
  TerminalWindow,
  Textarea,
  ThemeToggle,
  Toggle,
  Tooltip,
  Wordmark,
} from "$lib";
import type { Component } from "svelte";

// Componentes que precisam de preview custom (estrutura com snippets/estado).
import CardPreview from "./previews/CardPreview.svelte";
import TimelinePreview from "./previews/TimelinePreview.svelte";
import LandingPreview from "./previews/LandingPreview.svelte";
import DialogPreview from "./previews/DialogPreview.svelte";
import AccordionPreview from "./previews/AccordionPreview.svelte";
import TablePreview from "./previews/TablePreview.svelte";
import TabsPreview from "./previews/TabsPreview.svelte";
import StepperPreview from "./previews/StepperPreview.svelte";
import NavPreview from "./previews/NavPreview.svelte";
import CarouselPreview from "./previews/CarouselPreview.svelte";
import DropdownPreview from "./previews/DropdownPreview.svelte";
import SidebarPreview from "./previews/SidebarPreview.svelte";
import FieldPreview from "./previews/FieldPreview.svelte";
import ToasterPreview from "./previews/ToasterPreview.svelte";
import AppShellPreview from "./previews/AppShellPreview.svelte";

export const simpleComponents: Record<string, Component<any, any, any>> = {
  Accordion,
  Badge,
  BracketLink,
  Button,
  Carousel,
  ChatMessage,
  Checkbox,
  DatePicker,
  Dialog,
  Divider,
  Dropdown,
  ErrorPage,
  Eyebrow,
  Field,
  FileUpload,
  FloatingActionPill,
  Input,
  Label,
  Listbox,
  Message,
  MultiSelect,
  Nav,
  Panel,
  ProgressBar,
  Radio,
  Rating,
  RuleCard,
  SectionHeading,
  Select,
  Sidebar,
  Skeleton,
  Status,
  StatusPill,
  Stepper,
  TabCard,
  Table,
  Tabs,
  TagInput,
  TerminalWindow,
  Textarea,
  ThemeToggle,
  Toggle,
  Tooltip,
  Wordmark,
};

export const previewComponents: Record<string, Component<any, any, any>> = {
  Card: CardPreview,
  Timeline: TimelinePreview,
  Landing: LandingPreview,
  Dialog: DialogPreview,
  Accordion: AccordionPreview,
  Table: TablePreview,
  Tabs: TabsPreview,
  Stepper: StepperPreview,
  Nav: NavPreview,
  Carousel: CarouselPreview,
  Dropdown: DropdownPreview,
  Sidebar: SidebarPreview,
  Field: FieldPreview,
  Toaster: ToasterPreview,
  AppShell: AppShellPreview,
};
