import { getTimeSinceLoadMs } from '../client';
import { trackFormFieldFocused, trackFormStarted } from '../events';
import type { FormFieldName } from '../types';

const isTrackedField = (value: string): value is FormFieldName => {
	return value === 'name' || value === 'email';
};

export const trackForm = (node: HTMLElement) => {
	let hasStarted = false;
	const focusedFields = new Set<FormFieldName>();

	const onFocusIn = (event: FocusEvent) => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) {
			return;
		}

		if (!isTrackedField(target.name)) {
			return;
		}

		if (!hasStarted) {
			hasStarted = true;
			trackFormStarted({
				first_field: target.name,
				time_since_load_ms: getTimeSinceLoadMs()
			});
		}

		if (focusedFields.has(target.name)) {
			return;
		}

		focusedFields.add(target.name);
		trackFormFieldFocused({ field_name: target.name });
	};

	node.addEventListener('focusin', onFocusIn);

	return {
		destroy() {
			node.removeEventListener('focusin', onFocusIn);
		}
	};
};
