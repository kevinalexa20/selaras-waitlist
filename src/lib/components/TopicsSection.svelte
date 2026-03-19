<script lang="ts">
	import { walletIcon, familyIcon, valuesIcon, heartIcon } from '$lib/icons';

	const topicCards = [
		{ icon: walletIcon, title: 'Keuangan', body: 'Visi finansial & growth map.' },
		{ icon: familyIcon, title: 'Keluarga', body: 'Parenting & prioritas rumah.' },
		{ icon: valuesIcon, title: 'Iman & Nilai', body: 'Prinsip & spiritualitas.' },
		{ icon: heartIcon, title: 'Intimasi', body: 'Bahasa kasih & emosi.' }
	] as const;
</script>

<section class="band band-tint" id="topik">
	<div class="section-shell">
		<div class="topics-section">
			<div class="section-heading">
				<h2>Eksplorasi Berbagai Dimensi Rasa</h2>
				<p>Ribuan pertanyaan yang divalidasi pakar untuk membantu Anda memahami satu sama lain.</p>
			</div>

			<div class="topic-grid">
				{#each topicCards as topic}
					<article class="topic-card">
						<span class="icon-token topic-icon" aria-hidden="true">{@html topic.icon}</span>
						<h3>{topic.title}</h3>
						<p>{topic.body}</p>
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

	.band-tint {
		background: rgba(237, 219, 204, 0.74);
	}

	.section-shell {
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	.topics-section {
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
		max-width: 14ch;
	}

	.section-heading p {
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.72;
	}

	.topic-grid {
		display: grid;
		gap: 18px;
	}

	.topic-card {
		display: grid;
		justify-items: center;
		gap: 12px;
		padding: 26px 18px;
		text-align: center;
		background: rgba(255, 250, 245, 0.94);
		border: 1px solid rgba(157, 118, 94, 0.14);
		border-radius: 24px;
		box-shadow: 0 18px 34px rgba(110, 74, 52, 0.06);
	}

	.topic-card h3 {
		font-size: 1.5rem;
		margin-bottom: 0;
	}

	.topic-card p {
		color: var(--muted);
		font-size: 0.9rem;
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

	.topic-icon {
		width: 50px;
		height: 50px;
		border-radius: 16px;
	}

	@media (min-width: 860px) {
		.topic-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1080px) {
		.topic-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.band {
			padding: 20px 0;
		}

		.topic-card {
			padding: 16px;
		}
	}
</style>
