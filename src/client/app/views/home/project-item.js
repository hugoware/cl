import Component from '../../component';

export default class ProjectItem extends Component {

	constructor(data) {
		super({
			template: 'project-item'
		});

		this.data = data;
		
		// populate data
		this.attr('data-id', data.id);
		this.addClass(`type-${data.type}`);
		this.ui.name.text(data.name);
		this.ui.description.text(data.description);
		this.ui.modifiedAt.text(data.modifiedAt);
		this.toggleClassMap({
			'is-lesson': data.lesson,
			'is-project': !data.lesson,
		});

		
	}

}