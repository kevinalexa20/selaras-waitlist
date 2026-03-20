<script lang="ts">
	import logoSelaras from '$lib/assets/logo_selaras.png';
</script>

<footer class="band footer-band">
	<div class="section-shell site-footer">
		<div>
			<a class="brand footer-brand" href="#top" aria-label="Selaras">
				<img src={logoSelaras} alt="" width="1080" height="1080" />
			</a>
			<p>© 2026 Selaras. Ruang bertumbuh bersama.</p>
		</div>

		<nav class="footer-nav" aria-label="Navigasi footer">
			<a href="#masalah">Tentang</a>
			<a href="#cara-kerja">Cara Kerja</a>
			<a href="#topik">Topik</a>
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
		display: inline-flex;
		align-items: center;
		text-decoration: none;
	}

	.brand img {
		display: block;
		width: auto;
		height: 60px;
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
		transition: color var(--motion-base) var(--ease-out-quart);
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
