import type { UserIdentifySetOnceProps, UserIdentifySetProps } from './types';
import { getAttributionProperties, registerGlobalProperties } from './properties';

let isReady = false;
let pageLoadStartedAt = 0;
let posthogClient: {
	init: (apiKey: string, options: Record<string, unknown>) => void;
	capture: (eventName: string, properties?: object) => void;
	identify: (
		distinctId: string,
		setProps: UserIdentifySetProps,
		setOnceProps: UserIdentifySetOnceProps
	) => void;
	register: (properties: Record<string, unknown>) => void;
	register_once: (properties: Record<string, unknown>) => void;
} | null = null;
let initPromise: Promise<void> | null = null;

export const initAnalytics = (apiKey: string, apiHost: string) => {
	if (typeof window === 'undefined') {
		return Promise.resolve();
	}

	if (!apiKey || isReady) {
		return Promise.resolve();
	}

	if (initPromise) {
		return initPromise;
	}

	initPromise = (async () => {
		const posthogModule = await import('posthog-js');
		posthogClient = posthogModule.default;

		posthogClient.init(apiKey, {
			api_host: apiHost,
			defaults: '2026-01-30',
			capture_pageview: false,
			capture_pageleave: true,
			autocapture: true,
			persistence: 'localStorage+cookie'
		});

		isReady = true;
		pageLoadStartedAt = Date.now();
		registerGlobalProperties(posthogClient);
	})().finally(() => {
		initPromise = null;
	});

	return initPromise;
};

export const capture = (eventName: string, properties?: object) => {
	if (!isReady || !posthogClient) {
		return;
	}

	posthogClient.capture(eventName, properties);
};

export const identifyUser = (
	distinctId: string,
	setProps: UserIdentifySetProps,
	setOnceProps: UserIdentifySetOnceProps
) => {
	if (!isReady || !distinctId || !posthogClient) {
		return;
	}

	posthogClient.identify(distinctId, setProps, setOnceProps);
};

export const capturePageView = () => {
	if (typeof window === 'undefined') {
		return;
	}

	const { utm_source, utm_medium, utm_campaign, referrer } = getAttributionProperties();

	capture('$pageview', {
		path: window.location.pathname,
		search: window.location.search,
		referrer,
		utm_source,
		utm_medium,
		utm_campaign
	});
};

export const getTimeSinceLoadMs = () => {
	if (pageLoadStartedAt === 0) {
		return 0;
	}

	return Date.now() - pageLoadStartedAt;
};
