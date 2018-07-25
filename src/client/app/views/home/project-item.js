import Component from '../../component';

export default class ProjectItem extends Component {

	constructor(data) {
		super({
			template: 'project-item'
		});

		this.data = data;
		
		this.bind({
			'.name': data.name,
			'.description': data.description,
			'.modifiedAt': data.modifiedAt,
			'$': {
				attr: { 'data-id': data.id }
			}

		});
	}

}