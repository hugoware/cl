import _ from 'lodash';

// map of all actions
const actions = [ ];

/** Broadcasts global events */
export function broadcast(event, ...args) {

  // check each of the handlers
  for (const handler of actions) {
    if (handler.event === event)

      // perform the action -- if there is an
      // explicit `false` returned then we take
      // that to mean the chain should be stopped
      if (_.isFunction(handler.action))
        if (handler.action(...args) === false)
          break;
  }
  
}


/** Listens for global events */
export function listen(options, ...args) {
  let conditions = args[0];
  let action = args[1];

  // check if conditions were provided or not - it will
  // be the second argument (if any)
  if (_.isFunction(action)) {

    // create a compare function
    const compare = _.isFunction(conditions)
      ? conditions

      // search using the object params
      : (...args) => {
        const obj = args[0] || { };
        return _.every(conditions, (value, key) => obj[key] === value);
      };

    // replace the action to use
    const original = action;
    action = (...args) => {
      if (compare(...args))
        original(...args);
    };

  }
  // no conditions were provided
  else if (_.isFunction(conditions)) {
    action = conditions;
  }
  // invalid action
  else {
    console.warn('missing action for', options);
  }

  // if a single string, then create then
  // create an options object to use
  if (_.isString(options)) {
    options = { event: options };
  }

  // set defaults
  if (!('priority' in options)) options.priority = 999;
  options.id = _.uniqueId('event:');
  options.action = action;

  // save for later use
  actions.push(options);
  _.sortBy(actions, 'priority');

  // return the dispose handler
  return options.id;
}


/** Removes an existing action entirely */
export function remove(id) {
  _.remove(actions, event => event.id === id);
}


/** Performs an action once and then clears it */
export function once(event, action) {
  const id = listen(event, (...args) => {
    try { action(...args); }
    finally { clear(id); }
  });

  return id;
}

export default {
  broadcast,
  listen,
  remove,
  once,
}
