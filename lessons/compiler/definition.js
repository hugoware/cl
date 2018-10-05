
import _ from 'lodash';
import showdown from 'showdown';
import $cheerio from 'cheerio';
const converter = new showdown.Converter();

// extracts and creates all dictionary definitions
export default function processDefinitions(state, manifest, definitions) {

	_.each(definitions, ({ definition }) => {
		manifest.definitions[definition.id] = definition;
	});

  // convert to markdown
  _.each(manifest.definitions, definition => {
    const html = converter.makeHtml(_.trim(definition.define));
    const dom = $cheerio(html);
    definition.define = dom.html();
  });

}