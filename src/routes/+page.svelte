<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import {
		capturePageView,
		getUtmSource,
		identifyUser,
		initAnalytics,
		trackWaitlistFailed,
		trackWaitlistSubmitted,
		trackWaitlistSucceeded,
		type FailReason
	} from '$lib/ph';
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

	const waitlistEndpoint = env.PUBLIC_WAITLIST_ENDPOINT?.trim() ?? '';
	const waitlistCount = env.PUBLIC_WAITLIST_COUNT?.trim() ?? '';
	const posthogKey = env.PUBLIC_POSTHOG_KEY?.trim() ?? '';
	const posthogHost = env.PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';
	const waitlistLabel = waitlistCount
		? `${waitlistCount}+ pasangan sudah antre akses awal`
		: 'Batch pertama dibuka sangat terbatas';

	let name = $state('');
	let email = $state('');
	let source = $state('direct');
	let waitlistState = $state<WaitlistState>({ status: 'idle' });

	onMount(() => {
		source = getUtmSource();
		void initAnalytics(posthogKey, posthogHost).then(() => {
			capturePageView();
		});
	});

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const hasName = Boolean(trimmedName);

		trackWaitlistSubmitted({ source, has_name: hasName });

		if (!waitlistEndpoint) {
			trackWaitlistFailed({ source, has_name: hasName, reason: 'missing_endpoint' });
			waitlistState = {
				status: 'error',
				message: 'Form belum aktif. Isi PUBLIC_WAITLIST_ENDPOINT dulu sebelum deploy.'
			};
			return;
		}

		if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
			trackWaitlistFailed({ source, has_name: hasName, reason: 'invalid_email' });
			waitlistState = { status: 'error', message: 'Masukkan alamat email yang valid.' };
			return;
		}

		waitlistState = { status: 'submitting' };

		const requestBody = {
			email: trimmedEmail,
			name: trimmedName || undefined,
			source
		};

		try {
			const response = await fetch(waitlistEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			const rawText = await response.text();

			let payload: { success?: boolean; message?: string } | null = null;
			try {
				payload = JSON.parse(rawText);
			} catch {
				payload = null;
			}

			if (!response.ok || !payload?.success) {
				const errMsg = payload?.message ?? `HTTP ${response.status}: ${rawText.slice(0, 200)}`;
				throw new Error(errMsg);
			}

			waitlistState = {
				status: 'success',
				message: payload.message ?? 'Kamu sudah masuk daftar early access Selaras.'
			};

			trackWaitlistSucceeded({ source, has_name: hasName });
			identifyUser(
				trimmedEmail,
				{
					email: trimmedEmail,
					name: trimmedName || null,
					signup_source: source
				},
				{
					signup_source: source,
					signup_date: new Date().toISOString()
				}
			);

			name = '';
			email = '';
		} catch (error) {
			const reason: FailReason =
				error instanceof TypeError ? 'network_error' : error instanceof Error ? 'api_error' : 'unknown';

			trackWaitlistFailed({ source, has_name: hasName, reason });
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


