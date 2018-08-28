
import _ from 'lodash';

// extracts and creates all dictionary definitions
export default function processDefinitions(state, manifest, definitions) {
	manifest.definitions = { };
	
	_.each(definitions, ({ definition }) => {
		manifest.definitions[definition.id] = definition;
	});
}