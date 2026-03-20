<script lang="ts">
	import { onMount } from 'svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import HowItWorks from '$lib/components/HowItWorks.svelte';
	import TopicsSection from '$lib/components/TopicsSection.svelte';
	import WaitlistSection from '$lib/components/WaitlistSection.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	type WaitlistState =
		| { status: 'idle' }
		| { status: 'submitting' }
		| { status: 'success'; message: string }
		| { status: 'error'; message: string };

	const waitlistEndpoint = import.meta.env.PUBLIC_WAITLIST_ENDPOINT?.trim() ?? '';
	const waitlistCount = import.meta.env.PUBLIC_WAITLIST_COUNT?.trim() ?? '';
	const waitlistLabel = waitlistCount
		? `${waitlistCount}+ pasangan sudah antre akses awal`
		: 'Batch pertama dibuka sangat terbatas';

	let name = $state('');
	let email = $state('');
	let source = $state('direct');
	let waitlistState = $state<WaitlistState>({ status: 'idle' });

	onMount(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			const querySource = params.get('utm_source')?.trim();
			const storedSource = window.localStorage.getItem('selaras_waitlist_source')?.trim();

			if (querySource) {
				source = querySource;
				window.localStorage.setItem('selaras_waitlist_source', querySource);
				return;
			}

			if (storedSource) {
				source = storedSource;
			}
		} catch {
			// localStorage tidak tersedia (private browsing / disabled) — lanjut dengan default
		}
	});

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!waitlistEndpoint) {
			waitlistState = {
				status: 'error',
				message: 'Form belum aktif. Isi PUBLIC_WAITLIST_ENDPOINT dulu sebelum deploy.'
			};
			return;
		}

		const trimmedEmail = email.trim();
		if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
			waitlistState = { status: 'error', message: 'Masukkan alamat email yang valid.' };
			return;
		}

		waitlistState = { status: 'submitting' };

		try {
			const response = await fetch(waitlistEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.trim(),
					name: name.trim() || undefined,
					source
				})
			});

			const payload = (await response.json().catch(() => null)) as
				| { success?: boolean; message?: string }
				| null;

			if (!response.ok || !payload?.success) {
				throw new Error(payload?.message ?? 'Form belum berhasil dikirim. Coba lagi sebentar.');
			}

			waitlistState = {
				status: 'success',
				message: payload.message ?? 'Kamu sudah masuk daftar early access Selaras.'
			};

			name = '';
			email = '';
		} catch (error) {
			waitlistState = {
				status: 'error',
				message:
					error instanceof Error
						? error.message
						: 'Terjadi kendala saat mengirim form. Coba lagi beberapa saat lagi.'
			};
		}
	}
</script>

<svelte:head>
	<title>Selaras - Early Access untuk Pasangan Indonesia</title>
	<meta
		name="description"
		content="Selaras membantu pasangan Indonesia membahas masa depan, keuangan, nilai hidup, dan percakapan penting lain dengan cara yang lebih hangat, privat, dan terarah."
	/>
	<meta property="og:title" content="Selaras - Early Access" />
	<meta
		property="og:description"
		content="Ruang privat untuk kamu dan pasangan menyamakan visi, satu pertanyaan setiap kalinya."
	/>
	<meta property="og:image" content="https://selaras.asia/og-image.png" />
	<meta property="og:url" content="https://selaras.asia" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://selaras.asia/og-image.png" />
</svelte:head>

<main class="landing" id="top">
	<div class="intro-shell">
		<SiteHeader />
		<HeroSection {waitlistLabel} />
	</div>

	<ProblemSection />
	<HowItWorks />
	<TopicsSection />

	<WaitlistSection
		bind:name
		bind:email
		{source}
		{waitlistState}
		{waitlistLabel}
		onsubmit={handleSubmit}
	/>

	<SiteFooter />
</main>

<style>
	.landing {
		padding: 14px 12px 64px;
	}

	.intro-shell {
		display: grid;
		gap: 34px;
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	@media (max-width: 640px) {
		.landing {
			padding-inline: 10px;
			padding-bottom: 44px;
		}
	}
</style>
