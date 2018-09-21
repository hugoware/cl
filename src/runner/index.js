
import workerScript from './worker.ts';
import browserScript from './browser.ts';
import consoleScript from './modules/console.ts';

const $modules = {
	console: consoleScript
};

function trim(str) {
	return (str || '').toString().replace(/^\s*|\s*$/g, '');
}

// handles building the runner script
export default class Runner {

	constructor(mode) {

		// console.log('worker', workerScript);
		// console.log('browser', browserScript);
		// console.log('io', ioScript);

		this.script = workerScript;

	}

	compile(code) {
		
		// code = `\n${code}\n`;

		// code = code.replace(/\n ?import +[^\;|$]+;?[^\n]+/g, match => {
		// 	const key = trim(match).substr(6).replace(/[^a-zA-Z0-9\_]/g, '');
		// 	const mod = $modules[key] || `throw "missing module ${key}";`;
		// 	return `\n${mod}\n`;
		// });

		// this.script = this.script.replace(/\/{2}__CODE__/, code);

		// const lines = code.split(/\n/g);
		// _.each(lines, line => {

		// 	// check for an import
		// 	line = _.trim(line);

		// 	if () {
		// 		console.log('is import', )
		// 	}

		// });


	}

}