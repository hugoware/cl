
/** default logging */
export default function log(...args) {
	console.log(...args);
}

/** warning log */
log.warn = (...args) => {
	console.warn(args);
}

/** writes exception messages */
log.exception = log.ex = (file, ex) => {
	console.log(`[unexpected error]`, file, '\n', ex);
};

