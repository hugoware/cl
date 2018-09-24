
import _ from 'lodash';
import Component from "./component";
import $state from './state'

export default class Header extends Component {

	// creates the new header
	constructor(config) {
		config = _.assign({ }, config, {
			ui: {
				name: '.name',
				description: '.description',
				newWindow: '.open-in-window',
				shareProject: '.share-project',
				projectSettings: '.settings',
			}
		});

		// prepare the component
		super(config);

		// events
		this.listen('reset', this.onReset);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('rename-project', this.onRenameProject);
		this.listen('lesson-finished', this.onFinishLesson);

		// listen for actions
		this.ui.projectSettings.on('click', this.onClickProjectSettings);
		this.ui.newWindow.on('click', this.onClickNewWindow);
		this.ui.shareProject.on('click', this.onClickShareProject);
	}

	// clear the view
	onReset = () => {
		this.removeClass('has-project');
	}

	onActivateProject = project => {
		this.project = project;

		// update the view
		this.addClass('has-project');
		this.ui.name.text(project.name);
		this.ui.description.text(project.description);

		// manage a couple other things
		const isLesson = 'lesson' in project;
		const isFinished = !!project.finished;
		this.toggleClassMap({
			'is-lesson': isLesson,
			'is-finished': !isLesson || isFinished,
			'is-type-web': project.type === 'web',
			'is-type-mobile': project.type === 'mobile',
			'is-type-code': project.type === 'code',
			'is-type-game': project.type === 'game'
		});

	}

	// clear the header data
	onDeactivateProject = () => {
		this.removeClass('has-project');
		delete this.project;
	}

	// open a new window with the project
	onClickNewWindow = () => {
		const hasModified = $state.hasUnsavedFiles();

		// if modified, then show a confirmation
		if (hasModified) {
			this.broadcast('open-dialog', 'unsaved-changes', {
				reason: 'preview',
				confirm: () => $state.openProjectPreviewWindow()
			});
		}
		else $state.openProjectPreviewWindow();

	}

	// show the project settings dialog
	onClickProjectSettings = () => {
		if (!this.project) return;
		const { id } = this.project;
		this.broadcast('open-dialog', 'project-settings', { id });
	}

	// show the share dialog
	onClickShareProject = () => {
		if (!this.project) return;
		const { id } = this.project;
		this.broadcast('open-dialog', 'share-project', { id });
	}

	// handles when a project name changes
	onRenameProject = (id, name) => {
		if (!this.project) return;
		if (this.project.id === id)
			this.ui.name.text(name);
	}

	// allow sharing now
	onFinishLesson = () => {
		this.addClass('is-finished');
	}

}