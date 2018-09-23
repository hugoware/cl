import _ from 'lodash';
import $api from '../../api';
import $nav from '../../nav';
import $icon from '../../icons';
import { cancelEvent } from '../../utils';

import View from '../';
import HomeProjectItem from './project-item';
import AvatarSelection from './avatar-select';
import Component from '../../component';

export default class HomeView extends View {

	constructor() {
		super({ 
			template: 'home-view',

			ui: {
				about: '.about',
				createProject: '.actions .action.create-project'
			}
		});

		// add the avatar selector
		this.avatarSelection = new AvatarSelection();
		this.avatarSelection.appendTo(document.body);

		// listen for item events
		this.on('click', '.project-item .action.remove', this.onRemoveProject);
		this.on('click', '.project-item .action.publish', this.onShareProject);
		this.on('click', '.project-item .action.reset', this.onResetLesson);
		this.on('click', '.project-item .action.edit', this.onEditProject);
		this.on('click', '.project-item', this.onSelectProject);
		
		this.ui.createProject.on('click', this.onCreateProject);
		this.ui.avatar.on('click', this.onShowAvatarSelection);
		this.ui.showProjects.on('click', this.onShowProjects);
		this.ui.showLessons.on('click', this.onShowLessons);

		this.listen('set-avatar', this.onSetAvatar);
		this.listen('reset-project-item', this.onResetProjectItem);
	}

	/** tests if any projects are found
	 * @returns {boolean}
	 */
	get hasProjects() {
		return !!(this.data && _.some(this.data.projects))
	}

	/** tests if any lessons are found
	 * @returns {boolean}
	 */
	get hasLessons() {
		return !!(this.data && _.some(this.data.lessons))
	}

	/** set the current view */
	async onActivate() {
		this.busy = true;
		this.removeClass('projects lessons');

		// get the summary for this view
		try {
			this.data = await $api.request('get-home-summary');

			// remove existing items
			this.ui.projectList.empty();
			this.ui.lessonList.empty();

			// add each item
			_.each({
				lessons: this.ui.lessonList,
				projects: this.ui.projectList 
			}, (list, source) => {

				// add each project item
				const projects = this.data[source];
				_.each(projects, project => {
					const item = new HomeProjectItem(project);
					item.appendTo(list);
				});
			});

			// set the user stats
			const { first, avatar } = this.data.user;
			this.ui.name.text(first);
			this.onSetAvatar(avatar);

			// activate an appropriate view
			this.setDefaultView();
		}
		catch (err) {
			console.log('err', err);
		}
	}

	// replaces the user avatar
	onSetAvatar = avatar => {
		const icon = $icon.avatar(avatar);
		this.ui.avatar.empty()
			.append(icon);
	}

	// clears the active view
	setView = view => {
		this.removeClass('loading no-projects no-lessons projects lessons');
		setTimeout(() => this.addClass(view), 0);
	}

	// decides the best view to display
	setDefaultView = () => {
		this.setView('projects');
	}

	// handle errors
	showError = err => {
		alert('TODO: err');
		console.log('err', err);
	}

	// display the popup for selecting a new avatar
	onShowAvatarSelection = () => {
		this.avatarSelection.showAvatarSelection();
	}

	onCreateProject = () =>
		this.broadcast('open-dialog', 'create-project')

	onSelectProject = event => {
		const id = getProjectId(event);
		$nav.go(`project/${id}`);
	}

	// handles when a project item is confirmed to reset
	onResetProjectItem = id => {
		const project = this.find(`[data-id="${id}"]`);
		project.removeClass('is-finished in-progress');
		project.addClass('is-new');
	}

	// tries to remove a project entry
	onEditProject = async event => {
		const id = getProjectId(event);
		this.broadcast('open-dialog', 'project-settings', { id });
		return cancelEvent(event);
	}

	// tries to remove a project entry
	onRemoveProject = async event => {
		const id = getProjectId(event);
		this.broadcast('open-dialog', 'remove-project', { id });
		return cancelEvent(event);
	}
	
	onShareProject = async event => {
		const id = getProjectId(event);
		this.broadcast('open-dialog', 'share-project', { id });
		return cancelEvent(event);
	}
	
	onResetLesson = async event => {
		const id = getProjectId(event);
		this.broadcast('open-dialog', 'reset-lesson', { id });
		return cancelEvent(event);
	}

	// displays all projects, if any
	onShowProjects = () => {
		this.setView(this.hasProjects ? 'projects' : 'no-projects');
	}

	// displays all lessons
	onShowLessons = () => {
		this.setView(this.hasLessons ? 'lessons' : 'no-lessons');
	}

}

function getProjectId(event) {
	const project = Component.locate(event.target, '[data-id]');
	return project.attr('data-id');
}