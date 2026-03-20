/**
 * Svelte action: adds `reveal` class on mount, then `is-visible` when
 * element enters viewport via IntersectionObserver.
 *
 * Usage:
 *   <div use:reveal>            — default (no delay)
 *   <div use:reveal={{ delay: 100 }}>  — stagger delay in ms
 */
export const reveal = (
	node: HTMLElement,
	params?: { delay?: number }
) => {
	node.classList.add('reveal');

	const delay = params?.delay ?? 0;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;

			if (delay > 0) {
				setTimeout(() => node.classList.add('is-visible'), delay);
			} else {
				node.classList.add('is-visible');
			}

			observer.unobserve(node);
		},
		{ threshold: 0.15 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
};
