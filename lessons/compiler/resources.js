import _ from 'lodash';
import $fsx from 'fs-extra';
import $path from 'path';
import $image from 'image-size';

export default function processResources(state, manifest, root) {
	root = $path.resolve(root, 'resources');

	// it's okay without resources
	// if (!$fsx.existsSync(root))
	// 	return;

	const resources = [ ];

	// gathers items
	(function walk(parent) {
		const path = $path.resolve(root, parent);
		const items = $fsx.readdirSync(path);

		_.each(items, item => {
			const file = $path.resolve(path, item);
			const relative = `${parent}${parent ? '/' : ''}${item}`;
			const stat = $fsx.statSync(file);

			if (stat.isDirectory())
				walk(relative);

			// get image info
			else if (/\.(png|jpe?g)$/i.test(item)) {

				const size = $image(file);
				const image = _.assign({}, size, { path: relative });
				resources.push(image);
			}
		});
	}(''))

	manifest.resources = resources;

}