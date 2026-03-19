# Appwrite Setup untuk Selaras Waitlist

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
| `EMAIL_PROVIDER` | no | `sendgrid`, `mailgun`, atau `none` |
| `MAIL_FROM_EMAIL` | jika email aktif | alamat pengirim |
| `MAIL_FROM_NAME` | no | default `Selaras` |
| `ADMIN_NOTIFICATION_EMAIL` | no | email admin untuk notif signup baru |
| `SENDGRID_API_KEY` | jika pakai SendGrid | API key SendGrid |
| `MAILGUN_API_KEY` | jika pakai Mailgun | API key Mailgun |
| `MAILGUN_DOMAIN` | jika pakai Mailgun | domain Mailgun |

## 4. Catatan penting tentang email

Issue awal menyebut Appwrite Messaging. Untuk waitlist anonim, Appwrite Messaging kurang pas karena email target umumnya terikat ke user Appwrite.

Supaya tetap sederhana, function ini:

- menyimpan data signup ke Appwrite Databases
- mengirim email langsung ke SendGrid atau Mailgun via HTTP API

Kalau nanti Anda tetap ingin memaksa Appwrite Messaging, Anda perlu menambah layer pembuatan user/target email terlebih dulu. Untuk MVP waitlist, itu tidak perlu.

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
