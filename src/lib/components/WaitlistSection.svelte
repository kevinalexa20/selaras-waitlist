<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { trackForm } from '$lib/ph/actions/trackForm';
	import { trackSection } from '$lib/ph/actions/trackSection';

	type WaitlistState =
		| { status: 'idle' }
		| { status: 'submitting' }
		| { status: 'success'; message: string }
		| { status: 'error'; message: string };

	let {
		name = $bindable(''),
		email = $bindable(''),
		source,
		waitlistState,
		waitlistLabel,
		onsubmit
	}: {
		name: string;
		email: string;
		source: string;
		waitlistState: WaitlistState;
		waitlistLabel: string;
		onsubmit: (event: SubmitEvent) => void;
	} = $props();
</script>

<section class="band cta-band" id="waitlist" use:trackSection={{ sectionId: 'waitlist', sectionIndex: 3 }}>
	<div class="section-shell">
		<div class="cta-panel" use:reveal>
			<div class="cta-copy">
				<h2>Siap bangun fondasi hubungan yang lebih kuat?</h2>
				<p>
					Selaras sedang dalam tahap pengembangan akhir. Jadilah yang pertama nyobain
					platform ini dan dapatkan <strong>Akses Gratis Seumur Hidup</strong> untuk fitur premium kami.
				</p>
			</div>

			<form class="waitlist-form" {onsubmit} novalidate use:trackForm>
				<div class="field-grid">
					<label>
						<span>Nama</span>
						<input bind:value={name} name="name" type="text" autocomplete="name" placeholder="Boleh dikosongkan" />
					</label>

					<label>
						<span>Email</span>
						<input
							bind:value={email}
							name="email"
							type="email"
							autocomplete="email"
							placeholder="nama@contoh.com"
							required
						/>
					</label>
				</div>

				<div class="form-actions">
					<button type="submit" disabled={waitlistState.status === 'submitting'}>
						{#if waitlistState.status === 'submitting'}
							Mengirim...
						{:else}
							Masukin Saya ke Waitlist
						{/if}
					</button>
				</div>

				<p class="microcopy">{waitlistLabel}. Tidak ada spam, hanya kabar penting.</p>

				{#if waitlistState.status === 'success'}
					<p class="feedback success" role="status">{waitlistState.message}</p>
				{:else if waitlistState.status === 'error'}
					<p class="feedback error" role="alert">{waitlistState.message}</p>
				{/if}
			</form>
		</div>
	</div>
</section>

<style>
	.band {
		padding: 28px 0;
	}

	.cta-band {
		padding-top: 44px;
	}

	.section-shell {
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	.cta-panel {
		max-width: 860px;
		margin: 0 auto;
		padding: clamp(28px, 5vw, 44px);
		border-radius: 30px;
		background: linear-gradient(135deg, #c66e4c 0%, #b45a3d 100%);
		box-shadow: 0 28px 48px rgba(119, 66, 45, 0.24);
		color: #fff8f2;
	}

	.cta-copy {
		display: grid;
		gap: 14px;
		max-width: 38rem;
		margin: 0 auto;
		text-align: center;
	}

	.cta-copy h2 {
		font-size: clamp(2.35rem, 5.2vw, 4.1rem);
		line-height: 0.96;
		letter-spacing: -0.045em;
	}

	.cta-copy p {
		color: rgba(255, 245, 238, 0.84);
		font-size: 1rem;
		line-height: 1.72;
	}

	.waitlist-form {
		display: grid;
		gap: 16px;
		margin-top: 28px;
		padding: 18px;
		border-radius: 22px;
		background: rgba(255, 248, 243, 0.12);
		border: 1px solid rgba(255, 244, 238, 0.18);
	}

	.field-grid {
		display: grid;
		gap: 14px;
	}

	label {
		display: grid;
		gap: 8px;
	}

	label span {
		font-size: 0.92rem;
		font-weight: 600;
		color: #fff8f2;
	}

	input {
		width: 100%;
		min-height: 50px;
		padding: 0 15px;
		border-radius: 14px;
		border: 1px solid rgba(255, 242, 235, 0.42);
		background: rgba(255, 251, 247, 0.96);
		color: var(--text);
		font: inherit;
		outline: none;
		transition:
			border-color var(--motion-base) var(--ease-out-quart),
			box-shadow var(--motion-base) var(--ease-out-quart),
			transform var(--motion-fast) var(--ease-out-quart);
	}

	input:focus {
		outline: none;
		border-color: rgba(255, 239, 231, 0.88);
		box-shadow: 0 0 0 4px rgba(255, 241, 235, 0.18);
		transform: translateY(-1px);
	}

	.form-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		justify-content: center;
	}

	button,
	.ghost-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0 18px;
		border-radius: 14px;
		font-size: 0.95rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			transform var(--motion-base) var(--ease-out-quart),
			box-shadow var(--motion-base) var(--ease-out-quart),
			background-color var(--motion-base) var(--ease-out-quart),
			border-color var(--motion-base) var(--ease-out-quart),
			opacity var(--motion-base) var(--ease-out-quart);
	}

	button {
		background: linear-gradient(135deg, #c86f4e 0%, #b35e40 100%);
		color: #fff8f1;
		border: 1px solid transparent;
		box-shadow: 0 14px 28px rgba(179, 94, 64, 0.2);
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.ghost-button {
		background: rgba(255, 249, 243, 0.92);
		color: var(--text);
		border: 1px solid rgba(157, 118, 94, 0.18);
		box-shadow: 0 10px 24px rgba(115, 76, 55, 0.06);
		min-width: 230px;
	}

	.form-actions button,
	.form-actions .ghost-button {
		flex: 1 1 220px;
	}

	button:hover,
	.ghost-button:hover {
		transform: translateY(-1px);
	}

	button:active,
	.ghost-button:active {
		transform: translateY(0) scale(0.985);
	}

	.microcopy,
	.feedback {
		text-align: center;
		font-size: 0.9rem;
		line-height: 1.72;
	}

	.microcopy {
		color: rgba(255, 243, 235, 0.78);
	}

	.feedback {
		animation: feedback-in var(--motion-slow) var(--ease-out-quart) forwards;
	}

	@keyframes feedback-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.feedback.success {
		color: #fff4d3;
	}

	.feedback.error {
		color: #ffe0da;
	}

	@media (min-width: 860px) {
		.field-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.band {
			padding: 20px 0;
		}

		.cta-panel {
			padding: 14px;
		}

		.waitlist-form {
			padding: 16px;
		}
	}
</style>


