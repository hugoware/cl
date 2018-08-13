import $lfs from '../app/lfs';

// imports
import { HTMLHint as $htmlhint } from 'htmlhint';

// handle incoming messages
self.onmessage = async (msg) => {
	const command = msg.data[0];

	// check for the work to perform
	if (command === 'compile')
		compileFile(msg.data[1]);
};

// handles standard compiling of pug files
async function compileFile(file) {
	const html = await $lfs.read(file);

	// config sass
	const options = {
		// sourceMapFile: null,
		// sourceMapRoot: null,
		// sourceMapContents: false
	};

	// generate the CSS
	const messages = $htmlhint.verify(html, options);
	const hasErrors = (0|((messages || []).length)) > 0;
	
	// compiled successfully
	if (!hasErrors)
		self.postMessage(['compile:ok', { success: true, content: html }]);
	
	// there was an error
	else {

		// since there can be many errors we want to be
		// able to post multiple messages -- refactor later
		// const errors = [ ];
		for (const message of messages) {

			// make sure it's an error
			if (message.type !== 'error') continue;

			// take the error
			self.postMessage(['compile:ok', {
				success: false,
				content: html,
				error: {
					error: true,
					line: message.line,
					column: message.col,
					message: message.message,
					hint: message.rule ? message.rule.id : null,
					path: file
				}
			}]);
		}
		
	}
	
}

// notify this has been loaded
self.postMessage(['load:ok']);