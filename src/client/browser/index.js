(() => {
	
	// save some local instances
	const $alert = window.alert;
	const $prompt = window.prompt;
	const $console = window.console;
	const $addEventListener = window.addEventListener;
	const $removeEventListener = window.removeEventListener;

	// tracking all events
	const $events = { };

	// access the notify function
	function notify(name, ...args) {
		const event = new Event('preview-message');
		event.name = name;
		event.args = args;
		window.top.dispatchEvent(event);
	}

	// kicks off an event
	function triggerEvent(name, args) {
		const event = document.createEvent('Event');

		// manually trigger the event
		if ($events[name])
			for (const handler of ($events[name] || [ ]))
				handler(event);
	}

	// remove pending events
	function clearTrackedEventListeners() {
		for (const key in $events) {

			// remove each event
			for (const handler of $events[key])
				$removeEventListener(key, handler);

			// remove the item
			delete $events[key];
		}
	}

	// tracking added events for the window - the purpose
	// of this code is to make sure we remove all of these
	// events before we evaluate new code
	function addEventListener(event, handler) {

		// save the event to remove
		$events[event] = $events[event] || [ ];
		$events[event].push(handler); 
		
		// add the event normally
		$addEventListener(event, handler);
	}

	// handles loading external script files
	function createScript(src) {
		const script = document.createElement('script');
		script.src = src;
		return script;
	}

	// executes each script on the page
	function evalScripts() {

		// remove any existing handlers on the window
		// other handlers should be removed by the page
		// being reloaded
		clearTrackedEventListeners();

		// load each script on the page
		const scripts = document.getElementsByTagName('script');
		const total = scripts.length;
		for (let i = 0; i < total; i++)
			(node => {
				try { 

					// check for a source
					const src = node.getAttribute('src');
					if (!src) eval(node.innerHTML);

					// replace the script with an external one
					else {
						const script = createScript(src);
						const { parentNode } = node;
						parentNode.insertBefore(script, node);
						parentNode.removeChild(node);
					}
				}
				catch (ex) {
					handleError(ex);
				}
			})(scripts[i]);

		// after completely evaled, run any onload events
		triggerEvent('load');
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

	// capture alert messages
	window.alert = window.top.alert;
	window.prompt = window.top.prompt;
	window.addEventListener = addEventListener;

})();