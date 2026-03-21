# Appwrite Setup untuk Selaras Waitlist

> Terakhir diperbarui: 22 Maret 2026

Dokumen ini menjelaskan setup minimum supaya landing page `selaras-waitlist` bisa menerima signup end-to-end.

## 1. Site

1. Buat project baru di Appwrite.
2. Buka menu `Sites`.
3. Connect repository `selaras-waitlist`.
4. Set build config:
   - Install command: `bun install`
   - Build command: `bun run build`
   - Output directory: `build`
5. Tambahkan environment variable untuk site:
   - `PUBLIC_WAITLIST_ENDPOINT`
   - `PUBLIC_WAITLIST_COUNT` (opsional)
   - `PUBLIC_PLAUSIBLE_DOMAIN` (opsional)
   - `PUBLIC_GA_MEASUREMENT_ID` (opsional)

## 2. Database

Buat database dan collection berikut.

### Database

- Nama bebas, contoh: `selaras`

### Collection: `waitlist`

| Field | Type | Required |
| --- | --- | --- |
| `email` | Email | yes |
| `name` | String | no |
| `source` | String | no |
| `created_at` | DateTime | yes |

Rekomendasi tambahan:

- buat index unik pada field `email`
- buat index standar pada field `created_at`

## 3. Function

Folder function ada di `appwrite/functions/waitlist`.

### Runtime

- Node.js runtime terbaru yang tersedia di Appwrite

### Entry point

- `src/main.js`

### Trigger

- HTTP

### Environment variable function

| Key | Required | Keterangan |
| --- | --- | --- |
| `APPWRITE_ENDPOINT` | yes | endpoint Appwrite |
| `APPWRITE_PROJECT_ID` | yes | project ID |
| `APPWRITE_API_KEY` | yes | API key dengan akses databases |
| `DATABASE_ID` | yes | database untuk collection waitlist |
| `COLLECTION_WAITLIST` | yes | ID collection waitlist |
| `RESEND_API_KEY` | yes (untuk email) | API key dari [Resend](https://resend.com) |
| `MAIL_FROM_EMAIL` | no | alamat pengirim, default `onboarding@resend.dev` |
| `MAIL_FROM_NAME` | no | nama pengirim, default `Selaras` |
| `ADMIN_NOTIFICATION_EMAIL` | no | email admin untuk notif signup baru |
| `ALLOWED_ORIGIN` | no | CORS whitelist, comma-separated, default `*` |
| `SITE_URL` | no | URL site untuk link di email, default `https://selaras.asia` |

## 4. Catatan penting tentang email

Function ini menggunakan [Resend](https://resend.com) sebagai email provider karena API-nya simpel dan developer-friendly.

Cara kerja:

- Menyimpan data signup ke Appwrite Databases
- Mengirim email konfirmasi ke user via Resend API
- Mengirim notifikasi ke admin (jika `ADMIN_NOTIFICATION_EMAIL` diisi)

Jika `RESEND_API_KEY` tidak diisi, signup tetap tersimpan ke database tapi email tidak terkirim.

## 5. Domain

Setelah site berhasil deploy:

1. Tambahkan custom domain `selaras.id` di Appwrite Sites.
2. Ikuti DNS record yang diberikan Appwrite.
3. Tunggu TLS aktif.

## 6. Test end-to-end

Setelah site dan function aktif:

1. Buka landing page.
2. Isi form dengan email testing.
3. Pastikan response sukses.
4. Cek document baru masuk ke collection `waitlist`.
5. Cek email konfirmasi masuk.
6. Cek email admin jika `ADMIN_NOTIFICATION_EMAIL` diisi.
