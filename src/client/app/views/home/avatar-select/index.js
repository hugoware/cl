
import $state from '../../../state';
import $api from '../../../api';
import Component from '../../../component';

export default class AvatarSelect extends Component {

	constructor() {

		super({
			template: 'avatar-select'
		});

		this.listen('show-avatar-selection', this.onShowAvatarSelection);
		this.listen('activate-project', this.onHide);
		this.listen('open-dialog', this.onHide);
		this.ui.overlay.on('click', this.onHide);
		this.on('click', '.select', this.onSelectAvatar);
	}

	showAvatarSelection = () => {
		this.show();
	}

	// handles selecting an avatar
	onSelectAvatar = async element => {
		const selected = Component.locate(element.currentTarget, '[avatar]');
		const id = selected.attr('avatar');
		
		// check for the avatar ID
		try {
			const result = await $api.request('set-avatar', {
				userId: $state.user.id,
				avatarId: id
			});

			// the was okay
			this.broadcast('set-avatar', result.avatar);
		}
		// failed to set
		catch (err) {
			console.log('err');
		}
		finally {
			this.hide();
		}
	

	}

	onShowAvatarSelection = () => {
		this.show();
	}

	// hide the view entirely
	onHide = () => {
		this.hide();
	}

}