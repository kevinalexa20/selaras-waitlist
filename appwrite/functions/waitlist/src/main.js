import { Client, Databases, ID, Query } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID;
const COLLECTION_WAITLIST = process.env.COLLECTION_WAITLIST;
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER ?? 'none';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? '';
const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL ?? '';
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME ?? 'Selaras';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? '';
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';

const allowedOrigins = ALLOWED_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);

const getCorsOrigin = (req) => {
	if (ALLOWED_ORIGIN === '*') return '*';

	const requestOrigin = req.headers?.origin ?? req.headers?.Origin ?? '';
	if (allowedOrigins.includes(requestOrigin)) return requestOrigin;

	// Fallback: jika hanya 1 origin di-set, pakai itu langsung
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
		<div style="font-family: Arial, sans-serif; color: #201915; line-height: 1.6;">
			<p>${greeting}</p>
			<p>Terima kasih sudah masuk waitlist Selaras.</p>
			<p>
				Kami sedang menyiapkan ruang privat untuk pasangan Indonesia membahas topik penting
				secara lebih jujur dan terarah. Saat early access dibuka, kamu akan jadi salah satu
				orang pertama yang kami kabari.
			</p>
			<p>Sampai ketemu lagi,<br />Tim Selaras</p>
		</div>
	`;
};

const adminTemplate = ({ email, name, source, createdAt }) => `
	<div style="font-family: Arial, sans-serif; color: #201915; line-height: 1.6;">
		<p>Waitlist baru masuk.</p>
		<ul>
			<li>Email: ${escapeHtml(email)}</li>
			<li>Nama: ${escapeHtml(name || '-')}</li>
			<li>Source: ${escapeHtml(source || 'direct')}</li>
			<li>Waktu: ${escapeHtml(createdAt)}</li>
		</ul>
	</div>
`;

const sendWithSendGrid = async ({ to, subject, html }) => {
	if (!SENDGRID_API_KEY || !MAIL_FROM_EMAIL) {
		throw new Error('SENDGRID_API_KEY dan MAIL_FROM_EMAIL wajib diisi.');
	}

	const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${SENDGRID_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: {
				email: MAIL_FROM_EMAIL,
				name: MAIL_FROM_NAME
			},
			personalizations: [
				{
					to: [{ email: to }]
				}
			],
			subject,
			content: [
				{
					type: 'text/html',
					value: html
				}
			]
		})
	});

	if (!response.ok) {
		throw new Error(`SendGrid gagal dengan status ${response.status}.`);
	}
};

const sendWithMailgun = async ({ to, subject, html }) => {
	if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !MAIL_FROM_EMAIL) {
		throw new Error('MAILGUN_API_KEY, MAILGUN_DOMAIN, dan MAIL_FROM_EMAIL wajib diisi.');
	}

	const formData = new URLSearchParams();
	formData.append('from', `${MAIL_FROM_NAME} <${MAIL_FROM_EMAIL}>`);
	formData.append('to', to);
	formData.append('subject', subject);
	formData.append('html', html);

	const token = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
	const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${token}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formData.toString()
	});

	if (!response.ok) {
		throw new Error(`Mailgun gagal dengan status ${response.status}.`);
	}
};

const sendEmail = async (payload) => {
	if (EMAIL_PROVIDER === 'none') {
		return;
	}

	if (EMAIL_PROVIDER === 'sendgrid') {
		await sendWithSendGrid(payload);
		return;
	}

	if (EMAIL_PROVIDER === 'mailgun') {
		await sendWithMailgun(payload);
		return;
	}

	throw new Error(`EMAIL_PROVIDER tidak didukung: ${EMAIL_PROVIDER}`);
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
			// $createdAt di-auto-populate oleh Appwrite sebagai system field
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
