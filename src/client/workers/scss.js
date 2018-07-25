import $lfs from '../app/lfs';

// imports
import $sass from 'sass.js/dist/sass.sync.js';

// handle incoming messages
self.onmessage = async (msg) => {
	const command = msg.data[0];

	// check for the work to perform
	if (command === 'compile')
		compileFile(msg.data[1]);
};

// handles standard compiling of pug files
async function compileFile(file) {
	// pull in all files that will be requested using
	// readFileSync -- limitation of pug
	await $lfs.pull(['.sass', '.scss', '.css'], item => {
		const { path, content } = item;
		$sass.writeFile(path, content);
	});

	// config sass
	const options = {
		sourceMapFile: null,
		sourceMapRoot: null,
		sourceMapContents: false
	};

	// generate the CSS
	await $sass.compileFile(file, options, result => {

		// compiled successfully
		if ('text' in result)
			self.postMessage(['compile:ok', {
				success: true,
				content: result.text
			}]);
		
		// there was an error
		else
			self.postMessage(['compile:ok', {
				success: false, 
				error: {
					line: result.line,
					column: result.column,
					message: result.message,
					file: result.file.replace(/^\/?sass/i, '')
				}
			}]);

	});
}

// notify this has been loaded
self.postMessage(['load:ok']);