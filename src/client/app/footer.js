import _ from 'lodash';
import Component from './component';

// allow fancy tooltips
import $showdown from 'showdown';
const $convert = new $showdown.Converter();

export default class Footer extends Component {

	constructor(options) {
		super(options, {
			ui: {
				tooltip: '.tooltip'
			}
		});

		// // listen for tooltips
		// Component.bind(document.body)
		// 	.on('mouseenter', '[tooltip]', event => {
		// 		const message = event.target.getAttribute('tooltip');
		// 		this.setTooltip(message);
		// 	})
		// 	.on('mouseleave', '[tooltip]', event => {
		// 		this.setTooltip(null);
		// 	});

	}

	// append a tooltip
	setTooltip = message => {
		console.log('set message');

		// no message to show
		if (!message)
			return this.ui.tooltip.html('');

		// convert and display
		const html = $convert.makeHtml(message);
		this.ui.tooltip.html(html);
	}

}