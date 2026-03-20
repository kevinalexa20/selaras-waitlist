import { Client, Databases, ID, Query } from 'node-appwrite';
import { Resend } from 'resend';

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID;
const COLLECTION_WAITLIST = process.env.COLLECTION_WAITLIST;
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL ?? 'onboarding@resend.dev';
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME ?? 'Selaras';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';
const SITE_URL = process.env.SITE_URL ?? 'https://selaras.asia';

const allowedOrigins = ALLOWED_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);

const getCorsOrigin = (req) => {
	if (ALLOWED_ORIGIN === '*') return '*';

	const requestOrigin = req.headers?.origin ?? req.headers?.Origin ?? '';
	if (allowedOrigins.includes(requestOrigin)) return requestOrigin;

	return allowedOrigins[0] || '*';
};

const buildCorsHeaders = (req) => ({
	'Access-Control-Allow-Origin': getCorsOrigin(req),
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (res, payload, statusCode = 200, req = null) => {
	const headers = req ? buildCorsHeaders(req) : {
		'Access-Control-Allow-Origin': allowedOrigins[0] || '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	};

	return res.json(payload, statusCode, headers);
};

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeHtml = (value) =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const createClient = () => {
	const client = new Client();

	client
		.setEndpoint(APPWRITE_ENDPOINT)
		.setProject(APPWRITE_PROJECT_ID)
		.setKey(APPWRITE_API_KEY);

	return new Databases(client);
};

const confirmationTemplate = (name) => {
	const greeting = name ? `Halo ${name},` : 'Halo,';
	const safeSiteUrl = escapeHtml(SITE_URL);

	return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f7ede5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#2f241f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#fbf4ee 0%,#f1e1d4 100%);padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <tr>
            <td style="padding:0 0 14px;text-align:center;">
              <p style="margin:0;font-size:16px;font-weight:700;letter-spacing:0.02em;color:#b96445;">
                Selaras
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#fffaf6;border:1px solid rgba(157,118,94,0.14);border-radius:28px;padding:36px 32px;box-shadow:0 20px 50px rgba(98,67,49,0.08);">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#b67a5b;">
                Early Access Selaras
              </p>
              <h1 style="margin:0 0 18px;font-size:30px;font-weight:700;line-height:1.18;letter-spacing:-0.03em;color:#2a1f1b;">
                Kamu sudah masuk daftar awal Selaras.
              </h1>
              <p style="margin:0 0 16px;font-size:16px;color:#2f241f;line-height:1.72;">
                ${greeting}
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#5c4a3d;line-height:1.72;">
                Terima kasih sudah mempercayakan langkah awal ini ke <strong style="color:#2f241f;">Selaras</strong>.
                Kamu sekarang sudah masuk daftar prioritas untuk mendapatkan akses lebih awal saat ruang privat kami dibuka.
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#5c4a3d;line-height:1.72;">
                Kami sedang menyiapkan pengalaman yang membantu pasangan membahas hal-hal penting dengan cara yang lebih hangat, jujur, dan terarah - mulai dari keuangan, nilai hidup, sampai masa depan bersama.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background:linear-gradient(180deg,rgba(200,111,78,0.09) 0%,rgba(232,217,197,0.22) 100%);border:1px solid rgba(200,111,78,0.16);border-radius:18px;padding:18px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b15d3e;">
                      Sambil menunggu
                    </p>
                    <p style="margin:0;font-size:14px;color:#5c4a3d;line-height:1.68;">
                      Simpan email ini ya. Begitu akses awal dibuka, kami akan mengabari kamu lebih dulu beserta langkah berikutnya.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="left">
                    <a href="${safeSiteUrl}" style="display:inline-block;padding:13px 20px;border-radius:999px;background:linear-gradient(135deg,#c86f4e 0%,#b15d3e 100%);color:#fff8f2;font-size:14px;font-weight:700;text-decoration:none;">
                      Lihat Update Selaras
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:14px;color:#7a675c;line-height:1.68;">
                Kalau ada satu topik yang paling ingin kamu bahas bareng pasangan lewat Selaras, cukup balas email ini. Kami senang mendengarnya.
              </p>

              <p style="margin:0;font-size:14px;color:#8a7565;line-height:1.6;">
                Hangat,
              </p>
              <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#201915;">
                Tim Selaras
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a89484;line-height:1.6;">
                Selaras hadir untuk membantu pasangan bertumbuh lewat percakapan yang lebih jujur, tenang, dan bermakna.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#b09a8a;line-height:1.5;">
                © 2026 Selaras · Ruang bertumbuh bersama
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const adminTemplate = ({ email, name, source, createdAt }) => {
	const formattedDate = new Date(createdAt).toLocaleString('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Asia/Jakarta'
	});

	return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f6eee7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6eee7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <tr>
            <td style="background:linear-gradient(135deg,#2f241f 0%,#4a3a31 100%);border-radius:24px 24px 0 0;padding:26px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,248,241,0.5);">
                      Selaras Admin
                    </p>
                    <h2 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff8f1;letter-spacing:-0.02em;line-height:1.2;">
                      Ada pendaftar baru di waitlist
                    </h2>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(200,111,78,0.2);color:#f2b79d;font-size:12px;font-weight:700;">
                      +1 signup
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#fffaf6;padding:30px;border-radius:0 0 24px 24px;border:1px solid rgba(157,118,94,0.12);border-top:none;">
              <p style="margin:0 0 18px;font-size:14px;color:#6f6057;line-height:1.68;">
                Pendaftar baru berhasil masuk ke daftar akses awal Selaras. Detailnya ada di bawah ini.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#fffdf9;border:1px solid rgba(157,118,94,0.1);border-radius:18px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid rgba(157,118,94,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Email</p>
                    <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#201915;line-height:1.5;">
                      <a href="mailto:${escapeHtml(email)}" style="color:#c86f4e;text-decoration:none;">${escapeHtml(email)}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid rgba(157,118,94,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Nama</p>
                    <p style="margin:6px 0 0;font-size:15px;color:#201915;line-height:1.5;">${escapeHtml(name || 'Tidak diisi')}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid rgba(157,118,94,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Source</p>
                    <p style="margin:6px 0 0;font-size:15px;color:#201915;">
                      <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(200,111,78,0.08);color:#b35e40;font-size:13px;font-weight:700;">
                        ${escapeHtml(source || 'direct')}
                      </span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Waktu</p>
                    <p style="margin:6px 0 0;font-size:15px;color:#201915;line-height:1.5;">${formattedDate} WIB</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a89484;line-height:1.5;">
                Notifikasi otomatis dari Selaras Waitlist
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const sendEmail = async ({ to, subject, html }) => {
	if (!RESEND_API_KEY) return;

	const resend = new Resend(RESEND_API_KEY);
	const { error } = await resend.emails.send({
		from: `${MAIL_FROM_NAME} <${MAIL_FROM_EMAIL}>`,
		to,
		subject,
		html
	});

	if (error) {
		throw new Error(`Resend error: ${error.message}`);
	}
};

export default async ({ req, res, log, error }) => {
	if (req.method === 'OPTIONS') {
		return json(res, { success: true }, 200, req);
	}

	if (req.method !== 'POST') {
		return json(res, { success: false, message: 'Method tidak didukung.' }, 405, req);
	}

	if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
		error('Konfigurasi Appwrite Function belum lengkap.');
		return json(res, { success: false, message: 'Server belum dikonfigurasi.' }, 500, req);
	}

	if (!DATABASE_ID || !COLLECTION_WAITLIST) {
		error('DATABASE_ID atau COLLECTION_WAITLIST belum diisi.');
		return json(res, { success: false, message: 'Database belum dikonfigurasi.' }, 500, req);
	}

	const payload = req.bodyJson ?? {};
	const email = sanitize(payload.email).toLowerCase();
	const name = sanitize(payload.name);
	const source = sanitize(payload.source) || 'direct';

	if (!email || !emailPattern.test(email)) {
		return json(res, { success: false, message: 'Email tidak valid.' }, 400, req);
	}

	try {
		const databases = createClient();
		const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_WAITLIST, [
			Query.equal('email', email),
			Query.limit(1)
		]);

		if (existing.total > 0) {
			return json(res, {
				success: true,
				message: 'Email ini sudah terdaftar di waitlist Selaras.'
			}, 200, req);
		}

		await databases.createDocument(DATABASE_ID, COLLECTION_WAITLIST, ID.unique(), {
			email,
			name,
			source
		});

		await sendEmail({
			to: email,
			subject: 'Selaras - Kamu sudah masuk daftar akses awal',
			html: confirmationTemplate(name)
		});

		if (ADMIN_NOTIFICATION_EMAIL) {
			await sendEmail({
				to: ADMIN_NOTIFICATION_EMAIL,
				subject: 'Selaras - Ada pendaftar baru di waitlist',
				html: adminTemplate({ email, name, source, createdAt: new Date().toISOString() })
			});
		}

		log(`Waitlist signup saved: ${email}`);

		return json(res, {
			success: true,
			message: 'Kamu sudah masuk daftar early access Selaras.'
		}, 200, req);
	} catch (caughtError) {
		error(caughtError instanceof Error ? caughtError.message : 'Unknown waitlist error');
		return json(
			res,
			{ success: false, message: 'Belum berhasil menyimpan data. Coba lagi beberapa saat lagi.' },
			500,
			req
		);
	}
};
