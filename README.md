# Selaras Waitlist

Landing page validasi demand untuk Selaras, dibangun dengan SvelteKit dan disiapkan untuk deploy ke Appwrite Sites.

## Stack

- SvelteKit static site untuk landing page
- Appwrite Function untuk menerima submit waitlist
- Appwrite Databases untuk menyimpan data signup
- SendGrid atau Mailgun via Appwrite Function untuk email konfirmasi

## Jalankan lokal

```sh
bun install
bun run dev
```

## Environment landing page

Salin `.env.example` menjadi `.env`, lalu isi:

```sh
PUBLIC_WAITLIST_ENDPOINT=
PUBLIC_WAITLIST_COUNT=
PUBLIC_PLAUSIBLE_DOMAIN=
PUBLIC_GA_MEASUREMENT_ID=
```

Keterangan:

- `PUBLIC_WAITLIST_ENDPOINT`: URL HTTP Appwrite Function untuk submit form
- `PUBLIC_WAITLIST_COUNT`: angka opsional untuk social proof
- `PUBLIC_PLAUSIBLE_DOMAIN`: domain Plausible opsional
- `PUBLIC_GA_MEASUREMENT_ID`: measurement ID GA4 opsional

## Build

```sh
bun run build
```

Output static akan berada di folder `build` agar cocok dengan Appwrite Sites.

## Appwrite setup

Lihat `docs/appwrite-setup.md` untuk:

- schema collection `waitlist`
- env var Appwrite Function
- langkah deploy site, function, dan domain
- catatan email provider
