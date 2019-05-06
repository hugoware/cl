import $state from '../../../../../state';
import Component from '../../../../../component';

export default class MediaViewer extends Component {

	constructor() {
		super({
			template: 'workspace-media-viewer',

			ui: {
				audio: '.audio audio',
			}
		});

		this.listen('activate-file', this.onActivateFile);
	}

	onActivateFile = file => {
		const { type, path } = file;

		// not an image preview
		if (type !== 'media')
			return;

		// replace the image
		const domain = $state.getProjectDomain();
		const url = domain + encodeURI(path);

		// attaches the image
		this.ui.audio.attr('src', url);
		// this.busy = true;
		// this.ui.image.hide();
		// this.ui.image.attr('src', url);
		// this.ui.image.on('load', this.onImageLoad);
	}

}