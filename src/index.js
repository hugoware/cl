import _ from 'lodash';
import $config from './config';
import $server from './server';
import $database from './storage/database';
import $lessons from './storage/lessons';
import $path from './path';
import { resolveError } from './utils';

// initializes the app
async function init() {
	try {

		// load the configuration
		const path = $path.resolve(process.argv[2]);
		await $config.init(path);
		
		// starts the database
		await $database.init();
		
		// preload lesson content
		await $lessons.init();
		
		// loads the server config
		await $server.init();
	}
	// handle an errors
	catch(err) {
		err = resolveError(err);
		console.log('err', err);
	}
}

// start the app
init();