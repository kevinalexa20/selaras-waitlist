<footer class="band footer-band">
	<div class="section-shell site-footer">
		<div>
			<a class="brand footer-brand" href="#top">Selaras</a>
			<p>(c) 2026 Selaras. Ruang bertumbuh bersama.</p>
		</div>

		<nav class="footer-nav" aria-label="Navigasi footer">
			<a href="#top">Tentang</a>
			<a href="#waitlist">Privasi</a>
			<a href="#cara-kerja">Panduan</a>
		</nav>
	</div>
</footer>

<style>
	.band {
		padding: 28px 0;
	}

	.section-shell {
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	.site-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		padding-top: 12px;
	}

	.brand {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.8rem;
		font-style: italic;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--accent);
		text-decoration: none;
	}

	.footer-brand {
		display: inline-block;
		margin-bottom: 8px;
	}

	.site-footer p {
		color: var(--muted);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		line-height: 1.72;
	}

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 18px;
	}

	.footer-nav a {
		color: var(--muted);
		font-size: 0.94rem;
		text-decoration: none;
		transition: color 160ms ease;
	}

	.footer-nav a:hover {
		color: var(--accent-strong);
	}

	@media (max-width: 640px) {
		.band {
			padding: 20px 0;
		}

		.site-footer {
			flex-direction: column;
			align-items: flex-start;
		}

		.footer-nav {
			justify-content: flex-start;
		}
	}
</style>
