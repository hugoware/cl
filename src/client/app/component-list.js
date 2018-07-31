import _ from 'lodash';
import { JQuery } from 'jquery';
import Component from './component';

export default class ComponentList extends Component {

	constructor(options, ...args) {
		super(options, ...args);

		/** @type {Component[]} */
		this.items = [ ];

		// check if the container is provided
		options = options || { };
		const listSelector = options.list || options.container;

		/** @type {JQuery} */
		this.list = listSelector ? this.find(listSelector) : this.$;
	}

	/** checks if there are any items in the list
	 * @returns {boolean}
	 */
	get isEmpty() {
		return !_.some(this.items);
	}

	/** returns the first item found in the item array 
	 * @returns {Component}
	 */
	get firstItem() {
		return this.items[0];
	}

	/** returns the last item found in the item array 
	 * @returns {Component}
	 */
	get lastItem() {
		return this.items[this.items.length - 1];
	}

	/** finds the index of an item
	 * @param {Component} item the item to locate
	 * @returns {number} the position found
	 */
	indexOfItem(item) {
		return _.indexOf(this.items, item);
	}

	/** finds the item before the specified index
	 * @param {Component} item the item to find
	 * @returns {Component} the found item before the argument
	 */
	itemBefore(item) {
		const index = this.indexOfItem(item);
		return this.items[index - 1];
	}

	/** finds the item after the specified index
	 * @param {Component} item the item to find
	 * @returns {Component} the found item after the argument
	 */
	itemAfter(item) {
		const index = this.indexOfItem(item);
		return this.items[index + 1];
	}

	/** adds an item to this list
	 * @param {Component} items the item or items to add to the list
	 */
	appendItem(...items) {
		this.removeItem(...items);
		this.items.push(...items);
	}

	/** adds an item to the front of the array
	 * @param {Component} items the item or items to add at the front
	 */
	prependItem(...items) {
		this.remove(...items);
		this.items.unshift(...items);
	}

	/** removes an item from the list
	 * @param {Component} items the item to remove
	 */
	removeItem(...items) {
		_.each(items, item => _.remove(this.items, item));
	}

	/** finds a single item matching the filter 
	 * @param {Predicate} predicate the matching criteria
	 * @returns {Component} the matching component, if any
	*/
	findItem(predicate) {
		return _.find(this.items, predicate);
	}

	/** finds all item matching the filter 
	 * @param {Predicate} predicate the matching criteria
	 * @returns {Component[]} all matching items
	*/
	filterItems(predicate) {
		return _.filter(this.items, predicate);
	}

	/** renders the list of items */
	refresh() {

		// move all items to the top
		let last;
		_.eachRight(this.items, item => {
			item.prependTo(this.list);
			if (!last) last = item.$;
		});

		// remove everything after this point
		last.nextAll().remove();
	}

}