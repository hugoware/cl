
import { _ } from '../lib';


export default function configure(obj, config) {
	_.assign(obj, {

		controller: true,

		onChangeTab(file) {

			if (file.path === config.file) {
				this.progress.next();
				return true;
			}

		},

		onEnter() {
			this.progress.block();
			
			this.file.readOnly({ path: config.file });
			this.screen.highlight.tab(config.file);

			// get the actual name
			const name = config.file.split('/').pop();

			this.delay(15000, () => {
				this.assistant.say({
					message: `
						Switch to the \`${name}\` file by clicking on the highlighted [define codelab_tab tab] in the [define codelab_editor]`
					});
				});
		},

		onExit() {
			this.screen.highlight.clear();
		}

	}, config.extend);

	// initialization
	if (obj.init)
		obj.init(obj);
}
