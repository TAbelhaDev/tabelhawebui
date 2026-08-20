<script module lang="ts">
	export type FileUploadMode = 'basic' | 'advanced';
	export type FileUploadErrorKind = 'size' | 'type' | 'limit';
	export type FileUploadError = { kind: FileUploadErrorKind; file: File };
	export type FileUploadProgress = (file: File, percent: number) => void;
	export type FileUploadHandler = (
		files: File[],
		report: FileUploadProgress
	) => void | Promise<void>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import ProgressBar from '../feedback/ProgressBar.svelte';

	let {
		mode = 'advanced',
		accept = '',
		maxFileSize = undefined,
		fileLimit = undefined,
		multiple = true,
		auto = false,
		disabled = false,
		invalid = false,
		customUpload = false,
		uploadHandler = undefined,
		files = $bindable([]),
		chooseLabel = 'Escolher arquivos',
		uploadLabel = 'Enviar',
		cancelLabel = 'Cancelar',
		showUploadButton = false,
		showCancelButton = false,
		onSelect = undefined,
		onRemove = undefined,
		onClear = undefined,
		onProgress = undefined,
		onUpload = undefined,
		onError = undefined,
		empty = undefined,
		content = undefined,
		file = undefined,
		header = undefined,
		toolbar = undefined,
		class: className = '',
		...rest
	}: {
		mode?: FileUploadMode;
		accept?: string;
		maxFileSize?: number;
		fileLimit?: number;
		multiple?: boolean;
		auto?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		customUpload?: boolean;
		uploadHandler?: FileUploadHandler;
		files?: File[];
		chooseLabel?: string;
		uploadLabel?: string;
		cancelLabel?: string;
		showUploadButton?: boolean;
		showCancelButton?: boolean;
		onSelect?: (chosen: File[]) => void;
		onRemove?: (file: File) => void;
		onClear?: () => void;
		onProgress?: (file: File, percent: number) => void;
		onUpload?: (files: File[]) => void;
		onError?: (error: FileUploadError) => void;
		empty?: Snippet;
		content?: Snippet;
		file?: Snippet<[file: File, progress: number | undefined]>;
		header?: Snippet;
		toolbar?: Snippet;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();

	let inputEl: HTMLInputElement | undefined = $state();
	let dragDepth = 0;
	let dragActive = $state(false);
	let uploading = $state(false);
	const progress = $state(new Map<File, number>());

	function matchesAccept(file: File): boolean {
		const patterns = accept
			.split(',')
			.map((pattern) => pattern.trim().toLowerCase())
			.filter(Boolean);
		if (patterns.length === 0) return true;
		const name = file.name.toLowerCase();
		const type = (file.type || '').toLowerCase();
		return patterns.some((pattern) => {
			if (pattern === '.*' || pattern === '*/*') return true;
			if (pattern.startsWith('.')) return name.endsWith(pattern);
			if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1));
			return type === pattern;
		});
	}

	function validate(file: File): FileUploadError | null {
		if (maxFileSize !== undefined && file.size > maxFileSize) {
			return { kind: 'size', file };
		}
		if (accept && !matchesAccept(file)) {
			return { kind: 'type', file };
		}
		return null;
	}

	function openPicker() {
		if (disabled) return;
		inputEl?.click();
	}

	function addFiles(incoming: File[] | FileList) {
		if (disabled) return;
		const candidates = multiple
			? Array.from(incoming)
			: [Array.from(incoming)[0]].filter((f): f is File => f !== undefined);
		const accepted: File[] = [];
		for (const candidate of candidates) {
			if (fileLimit !== undefined && files.length + accepted.length >= fileLimit) {
				onError?.({ kind: 'limit', file: candidate });
				continue;
			}
			const error = validate(candidate);
			if (error) {
				onError?.(error);
				continue;
			}
			accepted.push(candidate);
		}
		if (accepted.length === 0) return;
		files = [...files, ...accepted];
		onSelect?.(accepted);
		if (auto && customUpload && uploadHandler) {
			startUpload(accepted);
		}
	}

	function onInputChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		if (input.files) addFiles(input.files);
		input.value = '';
	}

	function removeFile(file: File) {
		files = files.filter((item) => item !== file);
		progress.delete(file);
		onRemove?.(file);
	}

	function clearFiles() {
		files = [];
		progress.clear();
		onClear?.();
	}

	async function startUpload(toUpload: File[]) {
		if (!customUpload || !uploadHandler) return;
		uploading = true;
		try {
			for (const item of toUpload) progress.set(item, 0);
			await uploadHandler(toUpload, (file, percent) => {
				progress.set(file, percent);
				onProgress?.(file, percent);
			});
		} finally {
			uploading = false;
		}
		onUpload?.(toUpload);
	}

	function onDragEnter(event: DragEvent) {
		event.preventDefault();
		dragDepth += 1;
		dragActive = true;
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		dragDepth -= 1;
		if (dragDepth <= 0) {
			dragDepth = 0;
			dragActive = false;
		}
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragDepth = 0;
		dragActive = false;
		if (disabled) return;
		if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files);
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<div
	class="twui-fileupload twui-fileupload-{mode} {className}"
	{...rest}
>
	{#if header}
		<div class="twui-fileupload-header">{@render header()}</div>
	{/if}

	<button
		type="button"
		class="twui-fileupload-dropzone {dragActive ? 'twui-fileupload-dropzone-active' : ''} {invalid ? 'twui-fileupload-invalid' : ''}"
		disabled={disabled}
		onclick={openPicker}
		ondragenter={onDragEnter}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		ondrop={onDrop}
	>
		{#if files.length === 0}
			{#if empty}
				{@render empty()}
			{:else}
				<span class="twui-fileupload-choose-label">{chooseLabel}</span>
			{/if}
		{:else if content}
			{@render content()}
		{:else}
			<span class="twui-fileupload-choose-label">{chooseLabel}</span>
		{/if}
		{#if mode === 'basic' && files.length > 0}
			<span class="twui-fileupload-count" aria-hidden="true">{files.length}</span>
		{/if}
	</button>

	{#if mode === 'advanced' && files.length > 0}
		<ul class="twui-fileupload-list">
			{#each files as selected (selected)}
				{#if file}
					{@render file(selected, progress.get(selected))}
				{:else}
					<li class="twui-fileupload-item">
						<div class="twui-fileupload-item-info">
							<span class="twui-fileupload-item-name">{selected.name}</span>
							<span class="twui-fileupload-item-size">{formatSize(selected.size)}</span>
						</div>
						{#if progress.get(selected) !== undefined}
							<ProgressBar value={progress.get(selected)} label={false} />
						{/if}
						<button
							type="button"
							class="twui-fileupload-item-remove"
							disabled={disabled}
							aria-label={'Remover ' + selected.name}
							onclick={() => removeFile(selected)}
						>
							✕
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}

	{#if toolbar}
		<div class="twui-fileupload-toolbar">{@render toolbar()}</div>
	{/if}

	{#if mode === 'advanced' && files.length > 0 && (showUploadButton || showCancelButton)}
		<div class="twui-fileupload-actions">
			{#if showUploadButton}
				<button
					type="button"
					class="twui-fileupload-upload"
					disabled={disabled || uploading}
					onclick={() => startUpload(files)}
				>
					{uploadLabel}
				</button>
			{/if}
			{#if showCancelButton}
				<button
					type="button"
					class="twui-fileupload-cancel"
					disabled={disabled}
					onclick={clearFiles}
				>
					{cancelLabel}
				</button>
			{/if}
		</div>
	{/if}

	<input
		bind:this={inputEl}
		class="twui-fileupload-input"
		type="file"
		{accept}
		{multiple}
		disabled={disabled}
		tabindex="-1"
		aria-invalid={invalid}
		onchange={onInputChange}
	/>
</div>

<style>
	.twui-fileupload {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.twui-fileupload-dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 100%;
		min-height: 96px;
		padding: 16px;
		border: 1px dashed var(--twui-rule);
		background: var(--twui-paper);
		font-family: var(--twui-font-mono);
		font-size: 14px;
		color: var(--twui-ink);
		text-align: center;
		cursor: pointer;
		outline: none;
		transition:
			border-color 0.15s ease,
			background 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.twui-fileupload-dropzone:hover,
	.twui-fileupload-dropzone:focus-visible {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-fileupload-dropzone-active {
		border-color: var(--twui-accent);
		background: var(--twui-accent-soft);
		color: var(--twui-accent);
	}

	.twui-fileupload-dropzone:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-fileupload-invalid,
	.twui-fileupload-invalid:hover,
	.twui-fileupload-invalid:focus-visible {
		border-color: var(--twui-danger);
		color: var(--twui-danger);
	}

	.twui-fileupload-choose-label {
		font-family: var(--twui-font-mono);
		font-size: 13px;
		font-weight: 500;
	}

	.twui-fileupload-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 4px;
		border: 1px solid var(--twui-accent);
		border-radius: 9px;
		font-size: 10px;
		line-height: 1;
		color: var(--twui-accent);
	}

	.twui-fileupload-basic .twui-fileupload-dropzone {
		display: inline-flex;
		flex-direction: row;
		width: auto;
		min-height: 0;
		padding: 8px 12px;
		border-style: solid;
	}

	.twui-fileupload-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.twui-fileupload-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper);
	}

	.twui-fileupload-item-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.twui-fileupload-item-name {
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twui-fileupload-item-size {
		font-family: var(--twui-font-mono);
		font-size: 10px;
		color: var(--twui-ink-faint);
	}

	.twui-fileupload-item-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 22px;
		height: 22px;
		padding: 0;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono);
		font-size: 10px;
		line-height: 1;
		color: var(--twui-ink-soft);
		cursor: pointer;
	}

	.twui-fileupload-item-remove:hover {
		border-color: var(--twui-danger);
		color: var(--twui-danger);
	}

	.twui-fileupload-actions {
		display: flex;
		gap: 8px;
	}

	.twui-fileupload-upload,
	.twui-fileupload-cancel {
		padding: 6px 12px;
		border: 1px solid var(--twui-rule);
		background: var(--twui-paper-raised);
		font-family: var(--twui-font-mono);
		font-size: 12px;
		color: var(--twui-ink);
		cursor: pointer;
	}

	.twui-fileupload-upload:hover {
		border-color: var(--twui-accent);
		color: var(--twui-accent);
	}

	.twui-fileupload-cancel:hover {
		border-color: var(--twui-danger);
		color: var(--twui-danger);
	}

	.twui-fileupload-upload:disabled,
	.twui-fileupload-cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.twui-fileupload-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		border: 0;
		white-space: nowrap;
	}
</style>
