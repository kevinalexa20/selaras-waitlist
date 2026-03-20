<script lang="ts">
	import { lockIcon, sparkIcon, penIcon, revealIcon } from '$lib/icons';
	import { reveal } from '$lib/actions/reveal';
	import cardWaitlist from '$lib/assets/card-waitlist.png';

	const steps = [
		{
			icon: lockIcon,
			title: 'Bikin Ruang Privat',
			body: 'Undang pasanganmu masuk ke ruang digital kalian sendiri. Tempat aman yang terkunci hanya untuk kalian berdua.'
		},
		{
			icon: sparkIcon,
			title: 'Pilih Topik Penting',
			body: 'Dari kebiasaan finansial, love language, sampai rencana karir 5 tahun ke depan. Semua pertanyaan sudah disiapkan oleh pakar.'
		},
		{
			icon: penIcon,
			title: 'Jawab Masing-Masing',
			body: 'Tulis jawaban jujurmu tanpa takut terpengaruh. Pasanganmu nggak bisa lihat sebelum dia juga selesai menjawab. Privasi tetap terjaga.'
		},
		{
			icon: revealIcon,
			title: 'Buka Barengan',
			body: 'Momen reveal jawaban! Temukan di mana kalian sudah sejalan, dan bagian mana yang perlu diobrolin lebih lanjut secara mendalam.'
		}
	] as const;
</script>

<section class="band" id="cara-kerja">
	<div class="section-shell">
		<div class="how-section">
			<div class="section-heading" use:reveal>
				<h2>Kenalan Ulang Sama Pasangan, Tanpa Drama.</h2>
				<p>
					Selaras bukan aplikasi chatting biasa atau tes psikologi yang kaku. Ini cara baru
					buat diskusi.
				</p>
			</div>

			<div class="steps-flow">
				<!-- Step 1 -->
				<article class="step-item" use:reveal>
					<span class="step-icon" aria-hidden="true">{@html steps[0].icon}</span>
					<h3>{steps[0].title}</h3>
					<p>{steps[0].body}</p>
				</article>

				<span class="dot-separator" aria-hidden="true"></span>

				<!-- Step 2 -->
				<article class="step-item" use:reveal={{ delay: 80 }}>
					<span class="step-icon" aria-hidden="true">{@html steps[1].icon}</span>
					<h3>{steps[1].title}</h3>
					<p>{steps[1].body}</p>
				</article>

				<span class="dot-separator" aria-hidden="true"></span>

				<!-- Preview Panel between step 2 and 3 -->
				<div class="preview-panel" aria-hidden="true" use:reveal={{ delay: 160 }}>
					<div class="preview-shell">
						<img src={cardWaitlist} alt="Preview kartu pertanyaan Selaras" />
					</div>
				</div>

				<span class="dot-separator" aria-hidden="true"></span>

				<!-- Step 3 -->
				<article class="step-item" use:reveal={{ delay: 80 }}>
					<span class="step-icon" aria-hidden="true">{@html steps[2].icon}</span>
					<h3>{steps[2].title}</h3>
					<p>{steps[2].body}</p>
				</article>

				<span class="dot-separator" aria-hidden="true"></span>

				<!-- Step 4 -->
				<article class="step-item" use:reveal={{ delay: 160 }}>
					<span class="step-icon" aria-hidden="true">{@html steps[3].icon}</span>
					<h3>{steps[3].title}</h3>
					<p>{steps[3].body}</p>
				</article>
			</div>
		</div>
	</div>
</section>

<style>
	.band {
		padding: 28px 0;
	}

	.section-shell {
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	.how-section {
		display: grid;
		gap: 40px;
	}

	.section-heading {
		display: grid;
		gap: 12px;
		max-width: 56rem;
		justify-items: center;
		text-align: center;
		margin: 0 auto;
	}

	.section-heading h2 {
		font-size: clamp(2.35rem, 5.2vw, 4.1rem);
		line-height: 0.96;
		letter-spacing: -0.045em;
		max-width: 14ch;
	}

	.section-heading p {
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.72;
	}

	.steps-flow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		max-width: 560px;
		margin: 0 auto;
	}

	.step-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 10px;
		padding: 8px 16px;
	}

	.step-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		flex: 0 0 50px;
		border-radius: 50%;
		background: rgba(200, 111, 78, 0.12);
		color: var(--accent-strong);
	}

	.step-icon :global(svg) {
		width: 22px;
		height: 22px;
	}

	.step-item h3 {
		font-size: 1.5rem;
		letter-spacing: -0.03em;
	}

	.step-item p {
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.72;
		max-width: 38ch;
	}

	.dot-separator {
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
		opacity: 0.45;
	}

	.preview-panel {
		display: flex;
		justify-content: center;
		width: 100%;
		padding: 16px 0;
	}

	.preview-shell {
		max-width: 420px;
		width: 100%;
		transform: rotate(-4deg);
		filter: drop-shadow(0 18px 34px rgba(110, 74, 52, 0.1));
	}

	.preview-shell img {
		display: block;
		width: 100%;
		height: auto;
	}

	@media (max-width: 640px) {
		.band {
			padding: 20px 0;
		}

		.preview-shell {
			max-width: 340px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preview-shell {
			transform: none;
		}
	}
</style>
