
// helpers
export const $e = selector => document.getElementById(selector);
export const $cx = (...args) => {
	const cx = []
	for (const arg of args) {

		// complex arg
		if (arg instanceof Object || typeof arg === 'object') {
			for (const cs in arg)
				if (!!arg[cs]) cx.push(cs);
		}
		// as is
		else if (!!arg)
			cx.push(arg);
	}

	return cx.join(' ');
}

export function cancelEvent(event) {
	if (event.stopPropagation) event.stopPropagation();
	if (event.preventDefault) event.preventDefault();
	return false;
}