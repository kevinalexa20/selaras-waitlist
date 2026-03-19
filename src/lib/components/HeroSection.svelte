<script lang="ts">
	import heroImage from '$lib/assets/asset-1.png';

	let { waitlistLabel }: { waitlistLabel: string } = $props();
</script>

<section class="hero" aria-labelledby="hero-title">
	<p class="eyebrow-pill">Memperkenalkan Rasa: Selaras</p>
	<h1 id="hero-title">
		Berhenti <span>Nebak-Nebak</span> Isi Kepala Pasanganmu.
	</h1>
	<p class="hero-lede">
		Bahas masa depan, keuangan, sampai batasan dengan mertua tanpa rasa awkward.
		Selaras adalah ruang privat untuk kamu dan pasangan menyamakan visi, satu
		pertanyaan setiap kalinya.
	</p>

	<a class="cta-button" href="#waitlist">👉 Amankan Akses Awal (Gratis!)</a>

	<p class="support-copy">Slot early access terbatas. Tanpa kartu kredit.</p>

	<a class="text-link" href="#cara-kerja">Lihat Cara Kerja</a>

	<figure class="hero-visual">
		<div class="visual-frame">
			<img
				src={heroImage}
				alt="Pasangan duduk berdampingan sambil saling menatap dengan tenang."
				width="1024"
				height="1024"
				loading="eager"
			/>
		</div>
	</figure>
</section>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 18px;
		padding: 40px 0 10px;
	}

	.eyebrow-pill {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		min-height: 34px;
		padding: 0 14px;
		border-radius: 999px;
		background: rgba(236, 184, 160, 0.35);
		color: var(--accent-strong);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		font-size: clamp(3.35rem, 7.7vw, 5.8rem);
		line-height: 0.93;
		letter-spacing: -0.055em;
		max-width: 14ch;
	}

	h1 span {
		color: var(--accent);
		font-style: italic;
	}

	.hero-lede {
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.72;
		max-width: 38ch;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 52px;
		padding: 0 28px;
		border-radius: 16px;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		background: linear-gradient(135deg, #c86f4e 0%, #b35e40 100%);
		color: #fff8f1;
		border: 1px solid transparent;
		box-shadow: 0 14px 28px rgba(179, 94, 64, 0.2);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			background-color 180ms ease;
	}

	.cta-button:hover {
		transform: translateY(-1px);
	}

	.support-copy {
		color: var(--muted);
		font-size: 0.85rem;
		line-height: 1.72;
	}

	.text-link {
		color: var(--text);
		font-size: 0.95rem;
		font-weight: 700;
		text-decoration: none;
		transition: color 160ms ease;
	}

	.text-link:hover {
		color: var(--accent-strong);
	}

	.hero-visual {
		margin: 16px 0 0;
		width: 100%;
		max-width: 480px;
	}

	.visual-frame {
		position: relative;
		padding: 16px;
		border-radius: 38px;
		background: linear-gradient(180deg, rgba(245, 236, 228, 0.85) 0%, rgba(232, 219, 207, 0.9) 100%);
		box-shadow: 0 34px 58px rgba(102, 64, 42, 0.14);
	}

	.visual-frame::before {
		content: '';
		position: absolute;
		inset: -26px auto auto -26px;
		width: 180px;
		height: 180px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0));
		transform: rotate(45deg);
		pointer-events: none;
	}

	.visual-frame img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 28px;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}

	@media (max-width: 640px) {
		.hero {
			gap: 16px;
			padding-top: 24px;
		}

		.visual-frame {
			padding: 14px;
		}
	}
</style>
