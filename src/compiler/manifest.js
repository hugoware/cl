// import $database from '../storage/database';

const DEFAULT_TEMPLATE = {
	"short_name": "SHORT_NAME",
	"name": "NAME",

	"lang": "en-US",

	"theme_color": "#0C90F5",
	"icons": [
		{
			"src": "\/__codelab__\/site\/icons\/android-icon-36x36.png",
			"sizes": "36x36",
			"type": "image\/png",
			"density": "0.75"
		},
		{
			"src": "\/__codelab__\/site\/icons\/android-icon-48x48.png",
			"sizes": "48x48",
			"type": "image\/png",
			"density": "1.0"
		},
		{
			"src": "\/__codelab__\/site\/icons\/android-icon-72x72.png",
			"sizes": "72x72",
			"type": "image\/png",
			"density": "1.5"
		},
		{
			"src": "\/__codelab__\/site\/icons\/android-icon-96x96.png",
			"sizes": "96x96",
			"type": "image\/png",
			"density": "2.0"
		},
		{
			"src": "\/__codelab__\/site\/icons\/android-icon-144x144.png",
			"sizes": "144x144",
			"type": "image\/png",
			"density": "3.0"
		},
		{
			"src": "\/__codelab__\/site\/icons\/android-icon-192x192.png",
			"sizes": "192x192",
			"type": "image\/png",
			"density": "4.0"
		}
	],

	"start_url": "/?standalone",
	"display": "standalone",
	// "orientation": "portrait"
};

// handles creating a manifest for a project file
export default function generateManifest(request, response, project) {

	// // grab the user info
	// const users = await $database.users.find({ id: project.ownerId })
	// 	.project({ first: 1, anonymous: 1 })
	// 	.toArray();

	// // shouldn't happen
	// if (!_.some(users))
	// 	return response.end();

	// populat ethe data
	const manifest = Object.assign({ }, DEFAULT_TEMPLATE, {
		name: project.name,
		short_name: project.name
	});

	// write the manifest
	response.json(manifest);
}
