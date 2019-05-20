import { _ } from '../lib';

export default function configure(obj, config) {
	
	_.assign(obj, {

		controller: true,

		onEnter() {
			this.progress.block();

			const waiting = this.events.listen('expand-objectives-list', () => {
				this.progress.next();
				this.events.clear();
			});
		},

		onExit() {
			this.events.clear();
		}

	});

	
}