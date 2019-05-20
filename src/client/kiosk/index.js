
import $ from 'jquery';

$(() => {
	$(document.body).addClass('kiosk');
	
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
		setTimeout(clearInput, 2000);
	});

	// removes existing input
	function clearInput() {
		$input.length = 0;
	}

	// failed to work
	function resetView() {
		$busy = false;
		$(document.body).removeClass('busy success error');
	}

	// handles an input value
	async function processInput() {
		if ($busy) return;
		resetView();

		$(document.body).addClass('busy');
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
			showError(ex.toString())
		}
	}

	// display an error message
	function setError(message) {
		$('.error').text(message);
		$(document.body).addClass('error');
	}

	// show the final result
	function displayResult(result) {

		// failed to log in
		if (!result.success)
			return setError(result.error);

		// it worked, show the result
		$('.auth-code').text(result.authCode.code);
		$(document.body).addClass('success');

		// remove all classes
		setTimeout(resetView, 5000);
	}

});