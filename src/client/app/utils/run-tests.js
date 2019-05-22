import { _ } from '../lib';
import $contentManager from '../content-manager';
import CodeRunner from '../../viewer/code-runner';
import TestRunner from '../../viewer/runners/test';
import $lfs from '../lfs';

let $pending;
export default async function runTests(options) {
	clearTimeout($pending);

	// write the updated content
	await $lfs.write(options.file.path, options.file.current);

	// kick off right away
	if (options.immediate)
		return performTests(options);

	// delay a moment
	$pending = setTimeout(() => performTests(options), 500);
}

// handles executing the test
async function performTests(options) {
	const { file, onError, onDone, onInit, config, tests } = options;
	const { path } = file;

	// execute the file
	let code;
	let ex;
	try {
		await $contentManager.compile(path, {
			onError: error => ex = error,
			silent: true
		});

		// get the code to execute
		code = await $contentManager.get(path);
	}
	// failed to run
	catch (err) {
		ex = err;
	}

	// failed to compile
	if (ex)
		return onError.call(runner, 'compile', ex);

	// create the test
	const runner = CodeRunner.create(TestRunner);
	runner.code = code;
	runner.inject = '';

	// initialize
	onInit.call(runner, runner);
	runner.configure(config);
	runner.init();

	// setup the configuration
	// const setup = _.assign({}, config);
	runner.tests = [ ];
	_.each(tests, test => {
		const func = _.uniqueId('___TEST___');
		runner.tests.push({ name: func, action: () => test.call(runner, runner) });
		runner.inject += `\n\ntry { ${func}(); } catch (ex) { }\n\n`;
	});

	// setup the config
	runner.code = runner.code.replace('%%INJECT%%', `\n\n${runner.inject}`);

	// execute the code
	runner.run(runner.code, ex);
	onDone.call(runner, runner);
	
}
