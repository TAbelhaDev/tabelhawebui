<script lang="ts">
	let {
		role,
		content = '',
		streaming = false,
		name,
		class: className = ''
	}: {
		role: 'user' | 'assistant';
		content?: string;
		streaming?: boolean;
		name?: string;
		class?: string;
	} = $props();

	const defaultNames = { user: 'Você', assistant: 'IA' };
	const label = $derived(name ?? defaultNames[role]);
	const showTyping = $derived(streaming && content === '');
</script>

<div
	class="twui-chat-message twui-chat-message-{role} {showTyping ? 'twui-chat-message-typing' : ''} {className}"
	role="status"
	aria-label={showTyping ? `${label} está digitando` : `${label}`}
>
	{#if !showTyping}
		<span class="twui-chat-message-bubble">{content}</span>
	{:else}
		<span class="twui-chat-message-bubble twui-chat-message-bubble-typing" aria-hidden="true">
			<span class="twui-chat-message-dot"></span>
			<span class="twui-chat-message-dot"></span>
			<span class="twui-chat-message-dot"></span>
		</span>
	{/if}
</div>

<style>
	.twui-chat-message {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		max-width: 85%;
	}

	.twui-chat-message-user {
		align-items: flex-end;
		align-self: flex-end;
	}

	.twui-chat-message-bubble {
		padding: 8px 12px;
		border: 1px solid var(--twui-rule);
		font-family: var(--twui-font-serif, Georgia, serif);
		font-size: 14px;
		line-height: 1.5;
		color: var(--twui-ink);
		box-shadow: var(--twui-shadow-offset, 3px 3px 0 0 var(--twui-rule));
		white-space: pre-wrap;
	}

	.twui-chat-message-user .twui-chat-message-bubble {
		background: var(--twui-accent-soft);
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-chat-message-assistant .twui-chat-message-bubble {
		background: var(--twui-paper-raised);
	}

	.twui-chat-message-bubble-typing {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.twui-chat-message-dot {
		width: 5px;
		height: 5px;
		border-radius: 9999px;
		background: currentColor;
		opacity: 0.35;
		animation: twui-chat-message-blink 1.2s ease-in-out infinite;
	}

	.twui-chat-message-dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.twui-chat-message-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes twui-chat-message-blink {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 1;
		}
	}
</style>