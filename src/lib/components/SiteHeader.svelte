<script lang="ts">
	import { heartIcon, slidersIcon } from '$lib/icons';

	const navLinks = [
		{ label: 'Masalah', href: '#masalah' },
		{ label: 'Cara Kerja', href: '#cara-kerja' },
		{ label: 'Topik', href: '#topik' }
	] as const;
</script>

<header class="site-header">
	<a class="brand" href="#top">Selaras</a>

	<div class="header-center">
		<nav class="primary-nav" aria-label="Navigasi utama">
			{#each navLinks as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<a class="header-cta" href="#waitlist">Amankan Akses Awal</a>
	</div>

	<div class="header-icons">
		<a class="icon-link" href="#topik" aria-label="Lihat topik utama">
			{@html heartIcon}
		</a>
		<a class="icon-link" href="#cara-kerja" aria-label="Lihat cara kerja Selaras">
			{@html slidersIcon}
		</a>
	</div>
</header>

<style>
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		padding: 16px 24px;
		border-bottom: 1px solid var(--line);
	}

	.brand {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.7rem;
		font-style: italic;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--accent);
		text-decoration: none;
		flex-shrink: 0;
	}

	.header-center {
		display: none;
		align-items: center;
		gap: 28px;
	}

	.primary-nav {
		display: flex;
		align-items: center;
		gap: 26px;
	}

	.primary-nav a {
		color: var(--muted);
		font-size: 0.92rem;
		font-weight: 500;
		text-decoration: none;
		transition: color 160ms ease;
	}

	.primary-nav a:hover {
		color: var(--accent-strong);
	}

	.header-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		padding: 0 20px;
		border-radius: 22px;
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
		background: linear-gradient(135deg, #c86f4e 0%, #b35e40 100%);
		color: #fff8f1;
		border: none;
		box-shadow: 0 4px 12px rgba(179, 94, 64, 0.18);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.header-cta:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(179, 94, 64, 0.24);
	}

	.header-icons {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.icon-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		color: var(--muted);
		text-decoration: none;
		transition:
			color 160ms ease,
			transform 180ms ease;
	}

	.icon-link :global(svg) {
		width: 18px;
		height: 18px;
	}

	.icon-link:hover {
		color: var(--accent-strong);
		transform: translateY(-1px);
	}

	@media (min-width: 860px) {
		.header-center {
			display: flex;
		}
	}

	@media (max-width: 859px) {
		.site-header {
			flex-wrap: wrap;
		}

		.header-icons {
			margin-left: auto;
		}

		.header-cta {
			display: inline-flex;
			order: 3;
			width: 100%;
			margin-top: 4px;
		}
	}

	@media (max-width: 640px) {
		.site-header {
			padding: 12px 16px;
		}
	}
</style>
