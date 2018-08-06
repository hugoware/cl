
import _ from 'lodash';
import io from 'socket.io-client';
import Promise from 'bluebird';
// import UploadHelper from '~/common/upload';

// normal time to wait for a request
const DEFAULT_TIMEOUT = 5000;

let $socket;
const $listening = { }

/** Handles initializing the local API
 * @param {string} namespace The namespace to monitor
 * @param {object} options The options for configuring 
*/
export async function init(namespace, args) {
  return new Promise((resolve, reject) => {
		$socket = io(namespace, args);
    $socket.on('connect', async () => {
      try {
        const connect = await request('authenticate');
        resolve(connect);
      }
      catch (err) {
        reject(err);
      }
    });
  })
}

// export function createUpload() {
//   return new UploadHelper($socket);
// }

/** Handles listening for an event
 * @param {string} event The event name to listen for
 * @param {function} handle The action to perform for the event
 */
export function listen(event, handle) {
  const id = _.uniqueId();
  $listening[id] = { event, handle };
  $socket.on(event, handle);
  return id;
}


/** Disables listening for an event
 * @param {string} id The ID of the event to ignore
 */
export function ignore(id) {
  const { event, handle } = $listening[id];
  if (event && handle) $socket.off(event, handle);
  delete $listening[id];
}


/** performs a request that expects a response
 * @param {string} event The name of the request event to send
 * @param {...args} args Remaining arguments for the request
 */
export async function request(event, ...args) {
  
  // if the first argument is a complex object then
  // it's for extra params
  let timeout = DEFAULT_TIMEOUT;
  if (_.isObject(event)) {
    timeout = _.isNumber(event.timeout) ? event.timeout : timeout;
    event = event.event;
	}
	
  // send back the promise
  return new Promise((resolve, reject) => {
    const process = { };
    const successEvent = `${event}:ok`;
    const errorEvent = `${event}:err`;
		
		// the request is rejected
		process.reject = (...args) => {
			if (process.handled) return;
			process.dispose();
			reject(...args);
		};

		// handle resolution
    process.resolve = (...args) => {			
			if (process.handled) return;
			process.dispose();
			resolve(...args);
		};

		// handle timeouts
		process.timeout = setTimeout(() => {
			process.reject({ err: 'timeout' });
		}, timeout);

		// clears the request
		process.dispose = () => {
			process.handled = true;
			clearTimeout(process.timeout);
			$socket.off(successEvent, process.resolve);
			$socket.off(errorEvent, process.reject);
		};

    // listen for the responses
    $socket.on(successEvent, process.resolve);
    $socket.on(errorEvent, process.reject);

    // send the request
    $socket.emit.apply($socket, [event].concat(args));
  });
}

/** performs a standard request to the API
 * @param {string} event the action to invoke
 * @param {any[]} args the arguments to include
 */
export async function transaction(event, ...args) {
	const options = args.pop();

	// perform the request
	try {
		const result = await request(event, ...args);
		if (_.isFunction(options.success))
			options.success(result);
	}
	// handle errors
	catch(ex) {
		// process the error : ex = ''
		if (_.isFunction(options.error))
			options.error(ex);
	}
	// finalize the request
	finally {
		if (_.isFunction(options.always))
			options.always();
	}
}

// share helpers
export default {
  init,
  // createUpload,
  transaction,
  request,
  listen,
  ignore
};