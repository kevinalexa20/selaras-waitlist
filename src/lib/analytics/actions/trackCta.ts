import { trackCtaClicked } from '../events';
import type { CtaId } from '../types';

type TrackCtaParams = {
	ctaId: CtaId;
};

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

export const trackCta = (node: HTMLElement, params: TrackCtaParams) => {
	const onClick = () => {
		const ctaText = normalizeText(node.textContent ?? '');
		const destination =
			node instanceof HTMLAnchorElement
				? node.getAttribute('href')
				: node.getAttribute('data-destination');

		trackCtaClicked({
			cta_id: params.ctaId,
			cta_text: ctaText,
			cta_destination: destination
		});
	};

	node.addEventListener('click', onClick);

	return {
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
};
