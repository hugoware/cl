
import $ from 'jquery';
const TIMEOUT = 7000;

$(() => {
	let $pending;
	const root = $(document.body);
	root.addClass('kiosk');
	
	// actively doing something
	let $busy;
	
	// active input
	const $input = [ ];

	// just listen for input anywhere
	window.addEventListener('keydown', event => {
		if (event.keyCode === 13)
			return processInput();
		$input.push(event.key);

		// cancel the input entirely
		resetView();
		setTimeout(clearInput, 1000);
	});

	function resetView() {
		clearTimeout($pending);
		root.removeClass('error success busy');
		$busy = false;
	}

	// removes existing input
	function clearInput() {
		$input.length = 0;
	}

	// handles an input value
	async function processInput() {
		if ($busy) return;
		resetView();

		root.addClass('busy');
		$busy = true;
		
		// get the code to send
		const keycode = $input.join('');
		clearInput();

		// request the login
		try {
			const result = await $.post('/kiosk', { keycode });
			displayResult(result);
		}
		catch (ex) {
			showError(ex)
		}
		finally {
			$busy = false;
		}
	}

	// display an error message
	function showError(ex) {
		root.addClass('error');
		$pending = setTimeout(resetView, TIMEOUT);
		console.error('Login failed:', ex);
	}

	// show the final result
	function displayResult(result) {

		// failed to log in
		if (!result.success)
			return showError(result);

		// it worked, show the result
		resetView();
		$('.auth-code').text(result.authCode.code);
		root.addClass('success');

		// remove all classes
		$pending = setTimeout(resetView, TIMEOUT);
	}

});