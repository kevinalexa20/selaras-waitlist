<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const plausibleDomain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? '';
	const gaMeasurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';
	const gaSnippet = gaMeasurementId
		? `<scr` + `ipt async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></scr` + `ipt><scr` + `ipt>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaMeasurementId}');</scr` + `ipt>`
		: '';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	{#if plausibleDomain}
		<script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js"></script>
	{/if}
	{@html gaSnippet}
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		color-scheme: light;
		font-family: 'Instrument Sans', sans-serif;
		--bg: #f8eee7;
		--bg-soft: #fcf6f1;
		--surface: rgba(255, 249, 244, 0.9);
		--surface-strong: #f7ebe2;
		--surface-raised: #fffaf6;
		--text: #2f241f;
		--muted: #6f6057;
		--line: rgba(110, 84, 66, 0.12);
		--line-strong: rgba(110, 84, 66, 0.24);
		--accent: #c86f4e;
		--accent-strong: #b15d3e;
		--accent-soft: rgba(200, 111, 78, 0.13);
		--secondary: #6d7f67;
		--secondary-soft: rgba(109, 127, 103, 0.14);
		--tertiary: #edd7c7;
		--neutral: #554740;
		--success: #2f6f55;
		--error: #8c3f3b;
		--shadow: 0 24px 60px rgba(94, 62, 45, 0.08);

		/* Motion tokens */
		--motion-fast: 140ms;
		--motion-base: 220ms;
		--motion-slow: 420ms;
		--motion-hero: 620ms;
		--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
		--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
		--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

		background: var(--bg);
		color: var(--text);
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		background:
			radial-gradient(circle at top left, rgba(200, 111, 78, 0.12), transparent 22%),
			radial-gradient(circle at top right, rgba(109, 127, 103, 0.08), transparent 20%),
			radial-gradient(circle at 30% 100%, rgba(237, 215, 199, 0.34), transparent 28%),
			linear-gradient(180deg, #fcf6f1 0%, #f4e6da 100%);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(a) {
		color: inherit;
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	:global(h1),
	:global(h2),
	:global(h3) {
		font-family: 'Cormorant Garamond', serif;
		font-weight: 600;
		letter-spacing: -0.03em;
		margin: 0;
	}

	:global(p) {
		margin: 0;
	}

	:global(::selection) {
		background: rgba(200, 111, 78, 0.18);
	}

	/* Scroll reveal utility */
	:global(.reveal) {
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity var(--motion-slow) var(--ease-out-quart),
			transform var(--motion-slow) var(--ease-out-quart);
	}

	:global(.reveal.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		:global(*),
		:global(*::before),
		:global(*::after) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}
</style>
