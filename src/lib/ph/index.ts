export { capturePageView, getTimeSinceLoadMs, identifyUser, initAnalytics } from './client';
export { getUtmSource } from './properties';
export type {
	CtaId,
	FailReason,
	FormFieldName,
	SectionId,
	CtaClickedProps,
	FormFieldFocusedProps,
	FormStartedProps,
	SectionViewedProps,
	WaitlistFailedProps,
	WaitlistSubmittedProps,
	WaitlistSucceededProps,
	UserIdentifySetOnceProps,
	UserIdentifySetProps
} from './types';

import { capture } from './client';
import type {
	CtaClickedProps,
	FormFieldFocusedProps,
	FormStartedProps,
	SectionViewedProps,
	WaitlistFailedProps,
	WaitlistSubmittedProps,
	WaitlistSucceededProps
} from './types';

export const trackSectionViewed = (properties: SectionViewedProps) => {
	capture('section_viewed', properties);
};

export const trackCtaClicked = (properties: CtaClickedProps) => {
	capture('cta_clicked', properties);
};

export const trackFormStarted = (properties: FormStartedProps) => {
	capture('form_started', properties);
};

export const trackFormFieldFocused = (properties: FormFieldFocusedProps) => {
	capture('form_field_focused', properties);
};

export const trackWaitlistSubmitted = (properties: WaitlistSubmittedProps) => {
	capture('waitlist_submitted', properties);
};

export const trackWaitlistSucceeded = (properties: WaitlistSucceededProps) => {
	capture('waitlist_succeeded', properties);
};

export const trackWaitlistFailed = (properties: WaitlistFailedProps) => {
	capture('waitlist_failed', properties);
};
