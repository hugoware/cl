import _ from 'lodash';
import $api from '../../api';
import $nav from '../../nav';
import { cancelEvent } from '../../utils';

import View from '../';
import HomeProjectItem from './project-item';
import Component from '../../component';

export default class HomeView extends View {

	constructor() {
		super({ 
			template: 'home-view',

			ui: {
				createProject: '.actions .action.create-project'
			}
		});

		// listen for item events
		this.ui.createProject.on('click', this.onCreateProject);
		this.on('click', '.project .action.remove', this.onRemoveProject);
		this.on('click', '.project .action.publish', this.onPublishProject);
		this.on('click', '.project', this.onSelectProject);

	}

	async onActivate() {

		// get the summary for this view
		try {
			const summary = await $api.request('get-home-summary');

			// clear an activate the project list
			this.ui.projectList.empty();
			_.each(summary.projects, project => {
				const item = new HomeProjectItem(project);
				item.appendTo(this.ui.projectList);
			});

			console.log('tried to activate');
		}
		catch (err) {
			console.log('err', err);
		}
	}

	onCreateProject = () => this.broadcast('open-dialog', 'create-project')

	onSelectProject = event => {
		const id = getProjectId(event);
		$nav.go(`project/${id}`);
	}

	onRemoveProject = event => {
		const id = getProjectId(event);
		console.log('will remove', id);
		return cancelEvent(event);
	}
	
	onPublishProject = event => {
		const id = getProjectId(event);
		console.log('will publish', id);
		return cancelEvent(event);
	}

}

function getProjectId(event) {
	const project = Component.locate(event.target, '[data-id]');
	return project.attr('data-id');
}