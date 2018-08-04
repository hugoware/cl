(() => {
	
	// save some local instances
	const _alert = window.alert;
	const _prompt = window.prompt;
	const _console = window.console;

	// access the notify function
	function notify(name, ...args) {
		const event = new Event('preview-message');
		event.name = name;
		event.args = args;
		window.top.dispatchEvent(event);
	}

	// executes each script on the page
	function evalScripts() {
		const scripts = document.getElementsByTagName('script');
		const total = scripts.length;
		for (let i = 0; i < total; i++)
			(node => {
				try { eval(node.innerHTML); }
				catch (ex) { handleError(ex); }
			})(scripts[i]);
	}

	// broadcast local script errors
	function handleError(err) {
		
		/** @type {ProjectError} */
		const ex = !isNaN(err.lineno)
			? {
				line: err.lineno,
				colno: err.colno,
				message: err.message
			}
			: { 
				message: err.message,
				detail: err.stack
			};

		notify('error', ex);
		return false;
	}

	// common helper scripts
	window.__CODELAB__ = { 
		evalScripts: () => setTimeout(evalScripts, 0)
	};

	// capture scripting errors
	window.addEventListener('error', handleError);

	// capture console messages
	window.console = { 
		log: (...args) => notify('console.log', ...args),
		warn: (...args) => notify('console.warn', ...args)
	};

	// capture alert messages
	window.alert = (...args) => notify('alert', ...args);
	window.prompt = (...args) => notify('prompt', ...args);

})();