import posthog from 'posthog-js';

import type { UserIdentifySetOnceProps, UserIdentifySetProps } from './types';
import { getAttributionProperties, registerGlobalProperties } from './properties';

let isReady = false;
let pageLoadStartedAt = 0;

export const initAnalytics = (apiKey: string, apiHost: string) => {
	if (typeof window === 'undefined') {
		return;
	}

	if (!apiKey || isReady) {
		return;
	}

	posthog.init(apiKey, {
		api_host: apiHost,
		capture_pageview: false,
		capture_pageleave: true,
		autocapture: true,
		persistence: 'localStorage+cookie'
	});

	isReady = true;
	pageLoadStartedAt = Date.now();
	registerGlobalProperties();
};

export const capture = (eventName: string, properties?: object) => {
	if (!isReady) {
		return;
	}

	posthog.capture(eventName, properties);
};

export const identifyUser = (
	distinctId: string,
	setProps: UserIdentifySetProps,
	setOnceProps: UserIdentifySetOnceProps
) => {
	if (!isReady || !distinctId) {
		return;
	}

	posthog.identify(distinctId, setProps, setOnceProps);
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
