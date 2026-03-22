export type SectionId = 'masalah' | 'cara-kerja' | 'topik' | 'waitlist';

export type CtaId = 'hero_primary' | 'hero_secondary' | 'header_cta';

export type FailReason =
	| 'missing_endpoint'
	| 'invalid_email'
	| 'network_error'
	| 'api_error'
	| 'unknown';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type FormFieldName = 'name' | 'email';

export interface SectionViewedProps {
	section_id: SectionId;
	section_index: number;
	time_since_load_ms: number;
}

export interface CtaClickedProps {
	cta_id: CtaId;
	cta_text: string;
	cta_destination: string | null;
}

export interface FormStartedProps {
	first_field: FormFieldName;
	time_since_load_ms: number;
}

export interface FormFieldFocusedProps {
	field_name: FormFieldName;
}

export interface WaitlistSubmittedProps {
	source: string;
	has_name: boolean;
}

export interface WaitlistSucceededProps {
	source: string;
	has_name: boolean;
}

export interface WaitlistFailedProps {
	source: string;
	has_name: boolean;
	reason: FailReason;
}

export interface UserIdentifySetProps {
	email: string;
	name: string | null;
	signup_source: string;
}

export interface UserIdentifySetOnceProps {
	signup_source: string;
	signup_date: string;
}
