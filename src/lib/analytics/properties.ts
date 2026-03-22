import posthog from 'posthog-js';

import type { DeviceType } from './types';

const WAITLIST_SOURCE_KEY = 'selaras_waitlist_source';

const trimOrNull = (value: string | null): string | null => {
	if (!value) {
		return null;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
};

const getDeviceType = (): DeviceType => {
	const width = window.innerWidth;
	if (width < 640) {
		return 'mobile';
	}

	if (width < 1024) {
		return 'tablet';
	}

	return 'desktop';
};

const getUtmParams = () => {
	const params = new URLSearchParams(window.location.search);
	return {
		utm_source: trimOrNull(params.get('utm_source')),
		utm_medium: trimOrNull(params.get('utm_medium')),
		utm_campaign: trimOrNull(params.get('utm_campaign'))
	};
};

export const getUtmSource = (): string => {
	if (typeof window === 'undefined') {
		return 'direct';
	}

	const { utm_source } = getUtmParams();

	if (utm_source) {
		try {
			window.localStorage.setItem(WAITLIST_SOURCE_KEY, utm_source);
		} catch {
			// localStorage unavailable (private mode or disabled)
		}
		return utm_source;
	}

	try {
		const storedSource = trimOrNull(window.localStorage.getItem(WAITLIST_SOURCE_KEY));
		if (storedSource) {
			return storedSource;
		}
	} catch {
		// localStorage unavailable (private mode or disabled)
	}

	return 'direct';
};

export const getAttributionProperties = () => {
	if (typeof window === 'undefined') {
		return {
			utm_source: 'direct',
			utm_medium: null as string | null,
			utm_campaign: null as string | null,
			referrer: null as string | null
		};
	}

	const params = getUtmParams();
	const source = getUtmSource();

	return {
		utm_source: source,
		utm_medium: params.utm_medium,
		utm_campaign: params.utm_campaign,
		referrer: trimOrNull(document.referrer)
	};
};

export const registerGlobalProperties = () => {
	if (typeof window === 'undefined') {
		return;
	}

	const { utm_source, utm_medium, utm_campaign, referrer } = getAttributionProperties();
	const device_type = getDeviceType();

	posthog.register_once({
		utm_source,
		utm_medium,
		utm_campaign,
		referrer
	});

	posthog.register({
		utm_source,
		utm_medium,
		utm_campaign,
		referrer,
		device_type
	});
};
