import { getTimeSinceLoadMs, trackSectionViewed, type SectionId } from '$lib/analytics';

type TrackSectionParams = {
	sectionId: SectionId;
	sectionIndex: number;
};

const viewedSections = new Set<SectionId>();

export const trackSection = (node: HTMLElement, params: TrackSectionParams) => {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) {
				return;
			}

			if (entry.intersectionRatio < 0.5) {
				return;
			}

			if (viewedSections.has(params.sectionId)) {
				observer.unobserve(node);
				return;
			}

			viewedSections.add(params.sectionId);
			trackSectionViewed({
				section_id: params.sectionId,
				section_index: params.sectionIndex,
				time_since_load_ms: getTimeSinceLoadMs()
			});
			observer.unobserve(node);
		},
		{ threshold: [0.5] }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
};
