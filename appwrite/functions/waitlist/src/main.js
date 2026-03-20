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

	return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4e8dc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4e8dc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c86f4e 0%,#b35e40 100%);border-radius:24px 24px 0 0;padding:40px 32px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,248,241,0.7);">
                Early Access
              </p>
              <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:-0.02em;color:#fff8f1;line-height:1.2;">
                Kamu masuk daftar, ${name || 'Sobat'}! 🎉
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fffaf5;padding:32px;border-radius:0 0 24px 24px;border:1px solid rgba(157,118,94,0.12);border-top:none;">
              <p style="margin:0 0 16px;font-size:16px;color:#201915;line-height:1.65;">
                ${greeting}
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#5c4a3d;line-height:1.65;">
                Terima kasih sudah bergabung di waitlist <strong style="color:#201915;">Selaras</strong>.
                Kamu sekarang ada di daftar prioritas untuk mendapatkan akses lebih awal.
              </p>

              <!-- Highlight box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td style="background:rgba(200,111,78,0.08);border-left:4px solid #c86f4e;border-radius:0 12px 12px 0;padding:16px 20px;">
                    <p style="margin:0;font-size:14px;color:#5c4a3d;line-height:1.6;">
                      <strong style="color:#201915;">Apa selanjutnya?</strong><br>
                      Kami sedang menyiapkan ruang privat untuk pasangan Indonesia membahas topik penting secara jujur dan terarah.
                      Saat early access dibuka, kamu akan jadi yang <strong>pertama</strong> tahu.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:14px;color:#8a7565;line-height:1.6;">
                Sampai ketemu lagi,
              </p>
              <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#201915;">
                Tim Selaras
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a89484;line-height:1.5;">
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
<body style="margin:0;padding:0;background:#f4f0ec;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0ec;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="background:#201915;border-radius:20px 20px 0 0;padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,248,241,0.5);">
                      Selaras Admin
                    </p>
                    <h2 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff8f1;letter-spacing:-0.01em;">
                      📬 Waitlist Baru Masuk
                    </h2>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block;padding:6px 14px;border-radius:20px;background:rgba(200,111,78,0.2);color:#e8a68a;font-size:12px;font-weight:600;">
                      +1 signup
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fffaf5;padding:28px;border-radius:0 0 20px 20px;border:1px solid rgba(157,118,94,0.12);border-top:none;">

              <!-- Data rows -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(157,118,94,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Email</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#201915;">
                      <a href="mailto:${escapeHtml(email)}" style="color:#c86f4e;text-decoration:none;">${escapeHtml(email)}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(157,118,94,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Nama</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#201915;">${escapeHtml(name || '—')}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(157,118,94,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Source</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#201915;">
                      <span style="display:inline-block;padding:3px 10px;border-radius:8px;background:rgba(200,111,78,0.08);color:#b35e40;font-size:13px;font-weight:600;">
                        ${escapeHtml(source || 'direct')}
                      </span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a89484;">Waktu</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#201915;">${formattedDate} WIB</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a89484;">
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
			subject: 'Selaras — Kamu masuk daftar early access',
			html: confirmationTemplate(name)
		});

		if (ADMIN_NOTIFICATION_EMAIL) {
			await sendEmail({
				to: ADMIN_NOTIFICATION_EMAIL,
				subject: 'Selaras — Waitlist baru masuk',
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
