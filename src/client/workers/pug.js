import $lfs from '../app/lfs';

// imports
import $pug from 'pug';

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
	await $lfs.pull(['.pug', '.jade']);
	
	// generate the HTML
	try {
		const content = $pug.renderFile(file);
		self.postMessage(['compile:ok', {
			success: true,
			content
		}]);
	}
	// failed to compile
	catch(err) {
		
		// standardize message
		const error = err.toJSON();
		error.message = error.msg;
		error.filename = error.filename.replace(/^\/?/, '/');
		error.path = file;
		delete error.msg;

		// send back the failure
		self.postMessage(['compile:ok', { success: false, error }]);
	}
}

// notify this has been loaded
self.postMessage(['load:ok']);