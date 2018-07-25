
import Component from '../../../component';

export default class TabBar extends Component {

	constructor() {
		super({
			template: 'tab-bar',
			ui: {
				items: '.items',
			}
		});

		this.listen('open-file', this.onOpenFile);
	}

	onOpenFile = file => {

		// // check if this is already active - if so, move 
		// // to the front and open it
		// const tab = this.tabs[file.id];
		// if (tab)
		// 	return tab.appendTo(this.ui.items);

		// // since it's not a tab, create it now
		// const tab = new TabBarItem();
		// tab.update(tab);
	}

}