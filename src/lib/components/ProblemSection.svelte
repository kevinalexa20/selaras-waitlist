<script lang="ts">
	import { warningIcon, quoteIcon } from '$lib/icons';

	const painCards = [
		{
			icon: warningIcon,
			body: 'Faktanya, kita semua butuh itu. Banyak hubungan kandas bukan karena orang ketiga, tapi karena gagal ngobrolin hal-hal fundamental sebelum menikah.'
		},
		{
			icon: quoteIcon,
			body: 'Sayangnya, mulai deep talk dari nol itu susah, canggung, dan kadang berujung berantem karena salah paham. Sekarang, kamu nggak perlu bikin spreadsheet manual lagi.'
		}
	] as const;
</script>

<section class="band band-soft" id="masalah">
	<div class="section-shell">
		<div class="problem-section">
			<div class="section-heading">
				<h2>"Udah ngerasa cocok, tapi kok pas ngomongin hal serius jadi kaku ya?"</h2>
				<p>
					Masih ingat viralnya pasangan yang bikin Google Sheets buat nyatet obrolan serius
					mereka?
				</p>
			</div>

			<div class="problem-grid">
				{#each painCards as card}
					<article class="note-card">
						<span class="icon-token muted-icon" aria-hidden="true">{@html card.icon}</span>
						<p>{card.body}</p>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.band {
		padding: 28px 0;
	}

	.band-soft {
		background: rgba(244, 228, 216, 0.58);
	}

	.section-shell {
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	.problem-section {
		display: grid;
		gap: 34px;
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
	}

	.section-heading p {
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.72;
	}

	.problem-grid {
		display: grid;
		gap: 20px;
	}

	.note-card {
		display: grid;
		gap: 18px;
		padding: 24px;
		background: rgba(255, 250, 245, 0.94);
		border: 1px solid rgba(157, 118, 94, 0.14);
		border-radius: 24px;
		box-shadow: 0 18px 34px rgba(110, 74, 52, 0.06);
	}

	.note-card p {
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.72;
	}

	.icon-token {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 42px;
		flex: 0 0 42px;
		border-radius: 14px;
		background: rgba(200, 111, 78, 0.12);
		color: var(--accent-strong);
	}

	.icon-token :global(svg) {
		width: 20px;
		height: 20px;
	}

	.muted-icon {
		background: rgba(200, 111, 78, 0.08);
	}

	@media (min-width: 860px) {
		.problem-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.band {
			padding: 20px 0;
		}

		.note-card {
			padding: 16px;
		}
	}
</style>
