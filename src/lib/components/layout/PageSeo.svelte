<script lang="ts">
	import { page } from '$app/state';

	let {
		siteName,
		title,
		description,
		type = 'website',
		locale = 'pt_BR'
	}: {
		siteName: string;
		title: string;
		description: string;
		type?: 'website' | 'article';
		locale?: string;
	} = $props();

	const canonical = $derived(`${page.url.origin}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={locale} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
