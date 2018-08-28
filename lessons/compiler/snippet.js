import _ from 'lodash';

// extracts and creates all dictionary snippets
export default function processSnippets(state, manifest, snippets) {
	manifest.snippets = { };
	
	_.each(snippets, ({ snippet }) => {	
		manifest.snippets[snippet.id] = snippet;

		// cleanup
		snippet.content = _.trim(snippet.content);
		const { length } = snippet.content;

		// update each highlighted zone
		_.each(snippet.zones, (zone, id) => {
			const parts = zone.split(/ +/);
			const start = parseInt(parts[0]);
			const end = parseInt(parts[1]);

			// verify the range
			const invalid = start >= length ? 'start exceeds length'
			 : end > length ? 'end exceeds length'
			 : start < 0 ? 'start before start'
			 : end < 0 ? 'end before start'
			 : end === start ? 'range is zero'
			 : end < start ? 'end is less than start'
			 : null;

			if (invalid)
				throw `zone: ${id} ${invalid}`;

			// save the snippet
			snippet.zones[id] = { start, end };
		});
	});

}