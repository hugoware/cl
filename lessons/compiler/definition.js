
import _ from 'lodash';
import showdown from 'showdown';
import $cheerio from 'cheerio';
const converter = new showdown.Converter();

// extracts and creates all dictionary definitions
export default function processDefinitions(state, manifest, definitions) {
	const defs = _.assign({ }, manifest.defs);
	delete manifest.defs;

	// include required - this should be limited
	// to used defs in required libraries
	defs['double_click'] = true;
	defs['file_browser'] = true;


	// start by finding all definitions used
	_.each(manifest.lesson, slide => {
		const all = `${slide.content} ${slide.hint} ${slide.title} ${slide.explain}`;
		const matches = all.match(/\[define\s+[^( |\])]+/g);
		_.each(matches, match => {
			const key = _.trim(match.substr(7));
			defs[key] = true;
		});
	});

	// copy their values to the slide, favoring local defs
	// over global defs
	_.each(defs, (v, key) => {
		const def = state.dictionary[key];
		const override = _.find(definitions, item => item.definition.id === key);

		defs[key] = override ? override.definition : def;
		if (!defs[key])
			throw `missing def: ${key}`;
	});

	// console.log(definitions);
	// console.log(manifest, definitions, state);
	// console.log(defs);
	// 
	manifest.definitions = defs;


	// _.each(definitions, ({ definition }) => {
	// 	manifest.definitions[definition.id] = definition;
	// });

 //  // convert to markdown
 //  _.each(manifest.definitions, definition => {
 //    const html = converter.makeHtml(_.trim(definition.define));
 //    const dom = $cheerio(html);
 //    definition.define = dom.html();
 //  });

}