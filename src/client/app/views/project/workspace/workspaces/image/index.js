import $state from '../../../../../state';
import Component from '../../../../../component';

export default class ImageViewer extends Component {

	constructor() {
		super({
			template: 'workspace-image-viewer',

			ui: {
				image: '.editor img',

				fitToView: '.actions .fit',
				actualSize: '.actions .actual'
			}
		});

		this.ui.fitToView.on('click', this.onSelectFitToView);
		this.ui.actualSize.on('click', this.onSelectActualSize);

		this.listen('activate-file', this.onActivateFile);
	}

	onActivateFile = file => {
		const { type, path } = file;

		// not an image preview
		if (type !== 'image')
			return;

		// replace the image
		const domain = $state.getProjectDomain();
		const url = domain + path;

		// attaches the image
		this.busy = true;
		this.ui.image.attr('src', url);
		this.ui.image.on('load', this.onImageLoad);
	}

	// handles when the image has finished loading
	onImageLoad = event => {
		this.busy = false;
	}

	// fits the image to match the view size
	onSelectFitToView = () => {
		this.toggleClass('fit', true);
	}

	// shows the image at actual size
	onSelectActualSize = () => {
		this.toggleClass('fit', false);
	}

}