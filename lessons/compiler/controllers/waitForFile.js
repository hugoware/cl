
import { _ } from '../lib';


export default function configure(obj, config) {
	_.assign(obj, {

		controller: true,

		onOpenFile(file) {

			if (file.path === config.file) {
				this.progress.next();
				return true;
			}

		},

		onEnter() {
			this.progress.block();
			
			this.file.readOnly({ path: config.file });
			this.screen.highlight.fileBrowserItem(config.file);

			// get the actual name
			const name = config.fileName || config.file.split('/').pop();

			// check for content
			if (!config.content) {
				this.assistant.say({
					message: `Open the file named \`${name}\` by [define double_click double clicking] on it in the [define file_browser File Browser].`
				});
			}

			this.delay(15000, () => {
				this.assistant.say({
					message: `
						To open the \`${name}\` file, [define double_click double click] the item in the [define file_browser File Browser].
						To [define double_click double click], move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.`
					});
				});
		},

		onExit() {
			this.screen.highlight.clear();
		}

	}, config.extend);
}
