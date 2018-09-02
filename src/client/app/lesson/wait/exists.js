
// evaluates if a selector exists or not
export default class Exists {

	constructor(selector) {
		this.selector = selector;
	}

	// checks if the selector exists or not
	validate() {
		this.selector.refresh();
		return !this.selector.isMissing;
	}

	// clean up - if any
	dispose() { }

}