
import Runner from '../runner';
(() => {

	const $runner = new Runner();
	const $output = document.getElementById('output');
	const $input = document.getElementById('input');

	// write log messages to the output
	// const $log = console.log;
	// console.log = (...args) => {
	// 	const line = document.createElement('div');
	// 	line.className = 'line';
	// 	line.innerText = args.join(' ');
	// 	$output.appendChild(line);
	// };

	// requesting user input values
	$runner.registerEvent('request_user_input', message => {
		$runner.pause();

		console.log('waiting for input', message);
		setTimeout(() => $runner.resume('HUGO'), 3000);
	});

	$runner.registerEvent('xhr_request', () => {
		$runner.pause();
		console.log('send_xhr_request');
	});

	// handles executing waiting code
	function runCode(code) {
		$runner.stop();

		// clear the output
		$output.innerHTML = '';

		// kick off the next request
		setTimeout(() => {
			$runner.load(code);
			$runner.run();
		}, 250);
	}

	window.__CODELAB__ = {

		// kicks off a code request
		run: code => runCode(code)

	};

})();