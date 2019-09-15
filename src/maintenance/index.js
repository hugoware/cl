
import $config from '../config';
import $database from '../storage/database';

// maintenance tasks
import syncPaymentStatus from './sync-payment-status';
import disposeTempProjects from './dispose-temp-projects';

// perform maintenance scripts
async function run() {
	// await syncPaymentStatus();
	await disposeTempProjects();
}


// runs the testbench
(async function () {

	//load the default conifg
	const path = require('path').resolve(process.argv[2]);
	await $config.init(path);

	// load the database when needed
	await $database.init();

	// run the work
	await run();

	// just kill after 5 seconds since we're just testing code
	$database.disconnect();
	setTimeout(process.exit, 5000);
})();
