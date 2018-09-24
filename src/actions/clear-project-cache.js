
import $fsx from 'fs-extra';
import $cache from '../cache';
import $path from '../path';

// removes compiled files for a project depending on type
export default async function clearProjectCache(id) {

	// try and get the project
	const project = await $cache.projects.get(id);
	if (!project) return;

	// depending on the type, clean up
	if (project.type === 'web') return;

	// delete the folder for now
	const path = $path.resolveCache(`/projects/${id}`);
	await $fsx.remove(path);
	await $fsx.ensureDir(path);

}