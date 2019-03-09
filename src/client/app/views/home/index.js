import { _ } from '../../lib';
import $api from '../../api';
import $nav from '../../nav';
import $state from '../../state';
import $icon from '../../icons';
import { cancelEvent } from '../../utils';

import View from '../';
import HomeProjectItem from './project-item';
import AvatarSelection from './avatar-select';
import Component from '../../component';

const LESSON_FILTERS = ['code', 'web'];
const DEFAULT_LESSON_FILTER = LESSON_FILTERS[0];

// tracking the last view between switching
let $previousView = null;
let $previousFilter = null;

export default class HomeView extends View {

	constructor() {
		super({ 
			template: 'home-view',

			ui: {
				about: '.about',
				createProject: '.actions .create-project',
				filterOptions: '.filter .item',
				defaultFilterOption: '.filter .item.default',
			}
		});

		// set the default filter
		this.clearFilter($previousFilter);
		this.on('click', '.filter .item', this.onUpdateFilter);

		// add the avatar selector
		this.avatarSelection = new AvatarSelection();
		this.avatarSelection.appendTo(document.body);

		// listen for item events
		this.on('click', '.project-item .action.remove', this.onRemoveProject);
		this.on('click', '.project-item .action.publish', this.onShareProject);
		this.on('click', '.project-item .action.reset', this.onResetLesson);
		this.on('click', '.project-item .action.edit', this.onEditProject);
		this.on('click', '.project-item .action.open', this.onOpenInNewWindow);
		this.on('click', '.project-item', this.onSelectProject);
		
		this.ui.createProject.on('click', this.onCreateProject);
		this.ui.avatar.on('click', this.onShowAvatarSelection);
		this.ui.showProjects.on('click', this.onShowProjects);
		this.ui.showLessons.on('click', this.onShowLessons);

		this.listen('set-avatar', this.onSetAvatar);
		this.listen('reset-project-item', this.onResetProjectItem);
		this.listen('remove-project', this.onProjectRemoved);
		this.listen('edit-project', this.onProjectEdited);
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

	/** returns the total number of projects
	 * @returns {number}
	 */
	get projectCount() {
		return _.size(_.get(this.data, 'projects'));
	}

	/** returns the total number of projects
	 * @returns {number}
	 */
	get hasPendingLessons() {
		const lessons = _.get(this.data, 'lessons');
		const total = _.size(lessons);
		const pending = _.filter(lessons, 'done').length;
		return (total || 0) !== (pending || 0);
	}

	/** returns the total number of lessons
	 * @returns {number}
	 */
	get lessonCount() {
		return _.size(_.get(this.data, 'lessons'))
	}

	/** set the current view */
	async onActivate() {
		this.busy = true;
		this.clearFilter();

		// get the summary for this view
		try {
			const data = await $api.request('get-home-summary');
			applyData(this, data);

			// update some info
			this.ui.projectCount.text(this.projectCount);
			this.ui.lessonCount.text(this.lessonCount);
			this.toggleClass('has-pending-lessons', this.hasPendingLessons);

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

	// handles filter updates
	onUpdateFilter = event => {
		const filter = event.target.getAttribute('data-filter');
		this.setFilter(filter === 'all' ? null : filter, this.isLessonsSection);
	}

	// removes the current filter
	clearFilter = () => {
		this.setFilter(null);
	}

	// sets a new filter
	setFilter = (filter, isLessonsSection) => {
		this.removeClass('filter-web filter-game filter-mobile filter-code no-lessons');
		this.ui.filterOptions.removeClass('selected');

		// save the filter
		$previousFilter = filter;
		
		// use the default
		if (!filter) {
			this.ui.defaultFilterOption.addClass('selected');
			this.find('.project-item').show();
		}
		// there's a filter value
		else {
			const item = this.find(`[data-filter="${filter}"]`)
			item.addClass('selected');

			// hide all items
			this.find('.project-item').hide();

			// then show the correct values
			const matching = this.find(`.project-item[data-type="${filter}"]`);
			matching.show();

			// if none of them are locked, then that means we don't
			// have any pending locked lessons
			if (isLessonsSection && !matching.is('.is-locked') && !matching.is('.is-new'))
				this.addClass('no-lessons');

		}

		// lastly, make sure something is visible
		const items = this.find('.project-item:visible');
		this.toggleClass('is-empty', items.length === 0);
	}

	// clears the active view
	setView = view => {
		$previousView = view;
		const isProjects = view === 'projects';
		const isLessons = view === 'lessons';

		// track the view
		this.isLessonsSection = isLessons;

		// update page info
		const title = isProjects ? 'Projects' : 'Lessons';
		const description = isProjects
			? 'Projects are your own personal creations'
			: 'Lessons are tutorials that teach you new skills';

		// set the default filter
		if (isLessons && !(_.includes(LESSON_FILTERS, $previousFilter)))
			$previousFilter = DEFAULT_LESSON_FILTER;

		// animate the change?
		this.removeClass('is-ready');
		setTimeout(() => {
			this.addClass('is-ready');
			this.toggleClassMap({
				'is-projects': isProjects,
				'is-lessons': isLessons
			});

			// set the title
			this.ui.title.text(title);
			this.ui.description.text(description);

			// remove existing items
			this.ui.list.empty();
			let source = this.data[view];

			// are these for lessons
			if (!isProjects)
				source = _.orderBy(source, [ 'type', 'number' ]);
			
			// add each project item
			let $previous;
			_.each(source, data => {
				const item = new HomeProjectItem(data, $previous);
				item.appendTo(this.ui.list);
				$previous = data;
			});

			// apply the filter, if any
			this.setFilter($previousFilter, isLessons);

		}, 300);

	}

	// decides the best view to display
	setDefaultView = () => {
		this.setView($previousView || 'projects');
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

		// make sure it's not locked
		if (Component.within(event.target, '.locked'))
			return;

		// mark as busy before transitioning
		if (this.busy) return;
		this.busy = true;

		this.removeClass('is-ready');
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
	onOpenInNewWindow = async event => {
		const id = getProjectId(event);
		$state.openProjectPreviewWindow({ id });
		return cancelEvent(event);
	}

	// shows the edit dialog
	onEditProject = async event => {
		if (this.busy) return;
		const data = getProjectData(event, this);
		this.broadcast('open-dialog', 'project-settings', data);
		return cancelEvent(event);
	}

	// tries to remove a project entry
	onRemoveProject = async event => {
		if (this.busy) return;
		const data = getProjectData(event, this);
		this.broadcast('open-dialog', 'remove-project', data);
		return cancelEvent(event);
	}
	
	// displays share options
	onShareProject = async event => {
		if (this.busy) return;
		const data = getProjectData(event, this);
		this.broadcast('open-dialog', 'share-project', data);
		return cancelEvent(event);
	}
	
	// displays reset options
	onResetLesson = async event => {
		if (this.busy) return;
		const data = getProjectData(event, this);
		this.broadcast('open-dialog', 'reset-lesson', data);
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

	// finds and removes a project
	onProjectRemoved = id => {
		const removed = this.find(`[data-id="${id}"]`);
		removed.addClass('removed');
	}

	// handles when project data is changed
	onProjectEdited = data => {
		const element = this.find(`[data-id="${data.id}"]`);
		const context = Component.getContext(element);

		// update the data then refresh
		_.assign(context.data, data);
		context.refresh();
	}

}

// finds a project ID
function getProjectId(event) {
	const project = Component.locate(event.target, '[data-id]');
	return project.attr('data-id');
}

// finds a project data item
function getProjectData(event, instance) {
	const id = getProjectId(event);
	const { projects, lessons } = instance.data;
	return _.find(projects, { id }) || _.find(lessons, { id });
}

// revise data for UI
function applyData(instance, data) {
	instance.data = data;

	// descending order
	data.lessons = _.sortBy(data.lessons, 'sequence');
	
	// update each of the numbers
	const numbers = { };
	_.each(data.lessons, lesson => {
		lesson.number = numbers[lesson.type] = (numbers[lesson.type] || 0) + 1; 
	});
}
