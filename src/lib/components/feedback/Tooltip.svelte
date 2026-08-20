<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		position = 'top',
		children,
		class: className = ''
	}: {
		label: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
		class?: string;
	} = $props();

	// The bubble used to be a ::after pseudo-element fed by attr(data-tooltip).
	// Pseudo-elements are not in the accessibility tree, so the label was
	// invisible to screen readers. It is now a real element referenced by
	// aria-describedby.
	const id = $props.id();

	// WCAG 1.4.13 (Content on Hover or Focus) requires the bubble to be
	// dismissible without moving the pointer or focus. Escape hides it until
	// the trigger is left and entered again. The listener is on the window
	// rather than the wrapper: a keydown handler on a static span would make it
	// an interactive element without a role.
	let active = $state(false);
	let dismissed = $state(false);
	const visible = $derived(active && !dismissed);

	function enter() {
		active = true;
		dismissed = false;
	}

	function leave() {
		active = false;
		dismissed = false;
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && active) dismissed = true;
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

<!--
	The wrapper is not the interactive element — whatever the caller renders
	inside it is (a button, a link, an icon with tabindex). It only observes
	hover and focus to toggle a bubble that is already wired up through
	aria-describedby, so it needs no role of its own; giving it one would
	announce a control that does not exist.
-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="twui-tooltip twui-tooltip-{position} {className}"
	class:twui-tooltip-visible={visible}
	aria-describedby={id}
	onpointerenter={enter}
	onpointerleave={leave}
	onfocusin={enter}
	onfocusout={leave}
>
	{@render children()}
	<span class="twui-tooltip-bubble" role="tooltip" {id}>{label}</span>
</span>

<style>
	.twui-tooltip {
		position: relative;
		display: inline-flex;
	}

	.twui-tooltip-bubble {
		position: absolute;
		z-index: 50;
		padding: 4px 8px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono);
		font-size: 11px;
		/* A long label used to run off the viewport under white-space: nowrap. */
		max-width: min(16rem, 60vw);
		width: max-content;
		color: var(--twui-ink);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.12s ease;
	}

	.twui-tooltip-visible .twui-tooltip-bubble {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.twui-tooltip-bubble {
			transition: none;
		}
	}

	.twui-tooltip-top .twui-tooltip-bubble {
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
	}

	.twui-tooltip-bottom .twui-tooltip-bubble {
		top: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
	}

	.twui-tooltip-left .twui-tooltip-bubble {
		right: calc(100% + 6px);
		top: 50%;
		transform: translateY(-50%);
	}

	.twui-tooltip-right .twui-tooltip-bubble {
		left: calc(100% + 6px);
		top: 50%;
		transform: translateY(-50%);
	}
</style>
