import _ from 'lodash';
import $fsx from 'fs-extra';
import $database from '../storage/database';
import $moment from 'moment';
import { resolveProject } from '../path';
import audit from '../audit'
import { PROJECT_TYPE_TEMP, PROJECT_TYPE_PERMANENT } from '../storage/database/index';

const EXPIRATION_DATE_COUNT = 15;

// check the status of each account
export default function disposeTempProjects() {
	return new Promise(async (resolve, reject) => {
		let removed = 0;

		// find all expired projects
		const projects = await $database.projects
			.find({ lesson: { $exists: false }})
			.project({ _id: 0, id: 1, status: 1, removed: 1, modifiedAt: 1 })
			.toArray();
		
		// get the day to remove from
		const expired = $moment(+new Date)
			.add(-EXPIRATION_DATE_COUNT, 'days')
			.valueOf();

		// dispose and clear out each
		for (const project of projects) {
			const { id, status = PROJECT_TYPE_PERMANENT } = project;

			// check the timestamp
			let { modifiedAt = 0 } = project;
			if (_.isString(modifiedAt))
				modifiedAt = $moment(modifiedAt).valueOf();

			// check for deletable projects
			const canRemove = !!project.removed || status === PROJECT_TYPE_TEMP;

			// check the times
			if (canRemove && modifiedAt < expired) {

				// if so, remove it now
				const path = resolveProject(id);
				$fsx.removeSync(path);

				// delete the entry
				await $database.projects.remove({ id });
				removed++;
			}
		}

		// write the cleanup
		audit.log('dispose-temp-projects', 'admin', { removed });
		resolve();
	});
		
}