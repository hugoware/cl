/// <reference path="./types/index.js" />

import _ from 'lodash';
import $ from 'jquery';
import Promise from 'bluebird';
import $events from './events';
import $api from './api';
import $icons from './icons';

// map of templates/html
const $templates = { };

// shared context sources
const $contexts = { };

const PROXIED_SELF_METHODS = [
  'addClass',
  'removeClass',
	'toggleClass',
	'toggleClassMap',
	'changeClass',
  'remove',
  'empty',
  'css',
  'hide',
  'show',
  'data',
  'on',
  'off',
  'text',
  'html',
];

const PROXIED_DOM_METHODS = [
  'append',
  'prepend',
  'appendTo',
  'prependTo'
];

const PROXIED_RETURN_METHODS = [
  'next',
  'prev',
  'hasClass',
  'is',
  'find',
  'attr',
];


export default class Component {

  /** shortcut to test the `is` condition for an element
   * @param {JQuery|Component|HTMLElement} element the element to test
   * @param {string} selector the test to perform
   * @returns {boolean} did this match the test or not
   */
  static is(element, selector) {
    if (element instanceof Component) return element.is(selector);
    return $(element).is(selector);
  }

  /** finds the nearest object matching a selector in relationship to the provided element 
   * @param {JQuery|Component|HTMLElement|string} element the element to try and search from
   * @returns {string} the closest `data-id` attribute found
  */
  static getId(element) {
    const target = Component.locate(element, '[data-id]');
    return target.attr('data-id');
  }

  /** finds the context for a component 
   * @param {JQuery|Component|HTMLElement|string} element the element to try and search from
   * @returns {Component} the matching component, if any
   */
  static getContext(element) {
    if (element instanceof Component) element = element.$[0].parentNode;
		const context = Component.locate(element, '[cl-context]');
		const id = context.attr('cl-context') || '';
		// return $contexts[id];
    return context.data('instance');
  }

  /** finds the nearest object matching a selector in relationship to the provided element 
   * @param {JQuery|Component|HTMLElement|string} element the element to try and search from
   * @param {string} find the selector to try and locate
   * @returns {JQuery}
  */
  static locate(element, find) {
    const target = $(element);
    return target.is(find) ? target : target.closest(find);
  }

  /** gets or creates a component from the argument
   * @param {string|HTMLElement|Component} target the object to try and bind to
   * @returns {JQuery}
   */
  static bind(target) {
    if (target instanceof Component) return target;
    return $(_.isString(target) ? `<${target} />` : target);
	}
	
	/** shortcut to create a simple HTML component
	 * @returns {Component}
	 */
	static create(tag = 'div') {
		const dom = document.createElement(tag);
		const instance = $(dom);
		return new Component({ $: instance });
	}

  /** gets the associated Component instance from a j!uery element */
  static getInstance(selector, context) {
    context = context instanceof Component ? context.$ : null;

    const element = _.isString(selector)
        ? (context ? context.find(selector) : $(selector))
        : selector;

    return element.data('instance');
  }


	/** checks to find an existing key before instantiating a component 
   * @param {Component} type the type to instantiate. if needed 
	 * @param {JQuery|HTMLElement|Component} source the container to search within
   * @param {string} key the key of the element to find
   * @param {object} [data] constructor arguments for the instance, if created
	 * @returns {Component} the return type
	*/
	static findOrCreate(type, source, key, ...ctor) {

		// try and find the instance
		source = source instanceof Component ? source : $(source);
		const matching = source.find(`[cl-key="${key}"]`);
		let instance = matching.data('instance');

		// if found
		if (instance) return instance;

		// create a new one
		instance = new type(...ctor);
    instance.attr('cl-key', key);
    return instance;
	}

	/** creates a new Component
	 * @param {ComponentOptions} options Binding directions for a component
	 */
  constructor(options) {
		
		// loads from a template
		let dom;
    if (options.template) {
      const html = $templates[options.template]
        = $templates[options.template]
        = $(`#template--${options.template}`).html();

      // if this wasn't found
      if (!html)
        console.warn(`[template] missing: ${options.template}`);

      dom = $(html);
    }
    // just create using an HTML tag
		else if (options.tag)
			dom = $(document.createElement(options.tag));
			
    // select the state within
		else if (options.selector)
      dom = $(options.context || document.body).find(options.selector);

    // already providing the target
		else if (options.$)
      dom = options.$;

    // if there's a context, replace it
    if (options.context) {
      dom.contents().appendTo(options.context);
      this.$ = options.context;
    }
    else {
      /** @type {JQuery} */
      this.$ = dom.is('.cl-template') ? dom.contents() : dom;
    }

		// finalize context
		const id = _.uniqueId('ctx-');
		this.$.attr('cl-context', id);
		// $contexts[id] = this;

		/** @type {Object<string, JQuery>} */
		this.ui = { };

    // wire up, non-complex jquery actions
    _.each(PROXIED_SELF_METHODS, name => {
      if (!this[name])
        this[name] = (...args) => {
          try { 
            this.$[name](...args);
            return this;
          }
          catch (err) {
            console.warn(`Error with proxied Component method '${name}'`);
            throw err;
          }
        };
    });

		// wire up dom related funcitons
    _.each(PROXIED_DOM_METHODS, name => {
      if (!this[name])
        this[name] = (element, ...args) => {
          try {
            if (element instanceof Component) element = element.$;
            this.$[name](element, ...args);
            return this;
          }
          catch (err) {
            console.warn(`Error with proxied Component DOM method '${name}'`);
            throw err;
          }
        };
    });

		// wire up methods that return a value
    _.each(PROXIED_RETURN_METHODS, name => {
      if (!this[name])
        this[name] = (...args) => {
          try {
            return this.$[name](...args);
          }
          // make these errors more clear
          catch (err) {
            console.warn(`Error with proxied Component return method '${name}'`);
            throw err;
          }
        };
    });

    // check for UI mapping
    if (options.ui)
      mapComponentUI(this.$, this.ui, options.ui);

    // check for alt-bindings
    this.find('[bind]')
      .each((index, item) => {
        const element = $(item);
        const id = element.attr('bind');

        // remove and save the mapping
        element.attr('bind', null);
        this.ui[id] = element;
      });

    // check for icon components
    this.find('[icon]')
      .each((index, item) => {
				const element = $(item);
				const id = element.attr('icon');
				const args = element.attr('icon-args');
				try {
					const icon = $icons[id] ? $icons[id](args) : $icons.icon(id, args);
					element.append(icon);
				}
				catch (err) {
					console.warn(`could not find icon ${id}`);
				}
      });

    // automatically bind IDs
    this.find('[bind-ui]')
      .each((index, item) => {
        const element = $(item);
        const id = element.attr('bind-ui');

        // remove and save the mapping
        this.ui[id] = element;
      });

    // share api access
    this.api = $api;
    this.events = $events;

		// save the local instance
    this.data('instance', this);
  }

	/** Returns the busy state for this Component 
	 * @returns {boolean} is the component busy
	*/
  get busy() {
    return this.is('.busy');
  }

	/** Returns the busy state for this Component 
	 * @param {boolean} busy sets the busy state
	*/
  set busy(busy) {
		busy = !!busy;
		if (this.busy === busy) return;
		this.toggleClass('busy', busy);
  }

	/** Returns if the component is visible or not
	 * @returns {boolean} is the component visible
	*/
  get isVisible() {
    return this.is(':visible');
  }

	/** Returns if the component is hidden or not
	 * @returns {boolean} is the component hidden
	*/
  get isHidden() {
    return !this.isVisible;
  }

  /** Handles listening for incoming events
	 * @param {string} event The name of the event
	 * @param {function} action The action to perform
	 */
  listen = (event, action) => {
    const id = $events.listen(event, action);
		this[`__listen_${id}`] = id;
  }

  /** Handles broadcasting new events
	 * @param {string} event The name of the event
	 * @param {any[]} args The arguments to pass to events
	 */
  broadcast = (event, ...args) => {
    $events.broadcast(event, ...args);
  }
  
  /** performs an animation 
	 * @param {Object} props Key/value pair of properties and their animated values
	 * @param {Object} options Additional animation configuration options
	*/
  animate = async (props, options = { }) => {
    return new Promise(resolve => {
      options.complete = resolve;
      this.$.animate(props, options);
    });
  }

  /** tries to find the nearest matching selector to this component, including itself
   * @param {string} find the selector to search for
   * @returns {JQuery}
   */
  locate = find => {
    return this.is(find) ? this : this.closest(find);
	}

	/** checks if the component contains the selector
	 * @param {string} selector the selector to match
	 * @returns {boolean} was the selector found
	 */
	contains = selector => {
		return this.$.find(selector).length > 0;
	}
	
  /** handles binding data to the component
	 * @param {Object} data Binding parameters - the key is a selector to use and the value is the value, or an object, to apply
	 */
  bind = data => {
    _.each(data, (value, selector) => {

      // check if including the component itself
      let andSelf;
      selector = selector.replace(/\$/, () => {
        andSelf = true;
        return '';
      });

      // clean up selectors, just in case
      selector = selector.replace(/\s*,\s*/g, '')
        .replace(/,+/g, ',');

      // find the target
      let target = this.$;
      const hasSelector = _.trim(selector) !== '';

      // has a selector (not just itself)
      if (hasSelector) {
        target = target.find(selector);

        // targted itself
        if (andSelf)
          target = target.add(this.$);
      }

      // update as required
      if (_.isFunction(value))
        return value(target);

      // if it's an object, might have extra
      // instructions
      else if (_.isObject(value)) {

        // replace attributes
        _.each(value.attr, (val, key) => {
          target.attr(key, val);
        });

        // assign css
        if ('css' in value)
          target.addClass(value.css);

        // assign styling
        if ('style' in value)
          target.css(value.style);
      }

      // replaced with a value
      else if (!_.isNil(value))
        target.text(value);
    });

    return this;
	}

	/** raises a standard event that can be listened to by other components
	 * @param {string} key the name of the event to raise
	 * @param {object} [args] the arguments to include in the event
	 */
	raiseEvent = (key, args) => {
		const event = $.Event(key, args);
		this.$.trigger(event);
	}
	
	/** cleans up this element and removes all events */
  dispose = () => {

    // clean up events
    for (const key in this) {
      const item = this[key];

      // clean up event listeners
      if (/^__listen_/.test(key))
        $events.remove(item);
    }

	}

}


// maps selectors to an object
function mapComponentUI(context, target, selectors) {
  _.each(selectors, (selector, key) => {

			// if including a component
			if (_.isArray(selector)) {
				const ctor = selector[2] || { };
				const type = selector[1];
				selector = selector[0];

				// get the target to use
				ctor.$ = context.find(selector);
				target[key] = new type(ctor);
			}
			// normal behavior
			else {
				target[key] = _.isObject(selector)
					? mapComponentUI(context, { }, selector)
					: context.find(selector);
			}

  });

  return target;
}