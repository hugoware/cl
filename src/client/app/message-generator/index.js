import { _, Cheerio, Showdown } from '../lib';
import $state from '../state';
import STANDARD_REPLACEMENTS from './replacements';

const converter = new Showdown.Converter();

/** creates a spoken message and display message from text */
export default function generateMessage(message) {

	// create categories
	let speak = [ ];
	let content = [ ];
	
	// start reading each line
	const lines = _.trim(message).split(/\n/g);
	for (let line of lines) {
		let hidden, delay, silent, snippet;
		const props = [];

		// replace inline dictionary works
		line = line.replace(/\[image ?[^\]]+\]/g, match => {
			let value = _.trim(match.substr(6));
			value = value.replace(/\]$/g, '');
			const parts = value.split(/ /);
			
			// adjust the key
			let src = _.trim(parts.shift());
			const resource = $state.lesson.getResource(src);
			if (!/^https?\:/i.test(src)) {
				src = `/__codelab__/lessons/${$state.project.lesson}/resources/${src}`;
			}

			// alt classes
			const inline = _.includes(parts, 'inline') ? 'inline' : '';
			const center = _.includes(parts, 'center') ? 'center' : '';
			const right = _.includes(parts, 'right') ? 'right' : '';
			const fade = _.includes(parts, 'fade') ? 'fade' : '';
			const frame = _.includes(parts, 'frame') ? 'frame' : '';

			// set the image url
			let width = '';
			let height = '';
			let containerHeight = '';
			if (resource) {
				containerHeight = `style="height: ${0 | (resource.height / 2)}"`
				width = `width="${0|(resource.width / 2)}"`;
				height = ``;
			}


			// check for a defined width
			_.each(parts, item => {
				const value = parseInt(item);
				if (!isNaN(value)) {
					width = `width="${value}px"`;
					height = "";
					containerHeight = "";
				}
			});

			// trigger showing the image
			const id = _.uniqueId('slide_image_');
			setTimeout(() => document.getElementById(id).className += ' show-image');

			// other attributes
			return `<div id="${id}" class="image ${center} ${right} ${inline} ${fade} ${frame}" ${containerHeight} >
				<img src="${src}" ${width} ${height} />
			</div>`;
		});

		// replace inline dictionary works
		line = line.replace(/\[define ?[^\]]+\]/g, match => {
			let value = _.trim(match.substr(7));
			value = value.replace(/\]$/g, '');
			const parts = value.split(/ /);
			const key = parts.shift();

			// find the value to display
			let display = _.trim(parts.join(' ') || '');

			// make sure this is real
			const definition = $state.lesson.getDefinition(key);

			// without a display name, use the provided one
			if (!display)
				display = definition.name;

			return `<span class="define" type="${key}" >${display}</span>`;
		});

		// extract instructions, if any
		line = line.replace(/^\[[^\]]+\]/, commands => {

			// extract a delay command
			commands = commands.replace(/delay: ?\d+/, match => {
				delay = parseInt(match.substr(6));
				return '';
			});

			// check for unspoken lines
			commands = commands.replace(/silent/, () => {
				silent = true;
				return '';
			});

			// check for hidden lines of text
			commands = commands.replace(/hidden/, () => {
				hidden = true;
				return '';
			});

			// check for a code snippet
			commands = commands.replace(/snippet ?[a-z_]+/, match => {
				snippet = _.trim(match.substr(7));
				return '';
			});

			// check for a code snippet
			if (snippet) {
				commands = _.trim(commands.substr(1, commands.length - 2));
				const params = commands.split(/:/g);

				// convert to an object
				for (let i = 1; i < params.length; i++) {
					const key = _.trim(params[i - 1].match(/[^\s]+$/));

					// if not the last one, remove
					// the trailing command
					let value = _.trim(params[i]);
					if (i !== params.length - 1)
						value = _.trim(value.replace(/[^\s]+$/, ''));

					// save the property
					props.push(`${key}="${value}"`);
				}
			}

			// don't use the commands
			return '';
		});

		// write the snippet content
		if (snippet)
			content.push(`<div class="snippet" type="${snippet}" ${props.join(' ')}/>`);

		// check for a delay
		if (!isNaN(delay))
			speak.push(delay);

		// check to add text or not
		if (!silent) {
			let markup = fixSpeech(line);
			markup = converter.makeHtml(markup);
			markup = Cheerio.load(markup).text();
			markup = replacePronunciation(markup, { spoken: true });
			speak.push(markup);
		}

		// if visible, add it to the content
		if (!hidden) {
			let markup = _.trim(converter.makeHtml(line));
			markup = replacePronunciation(markup, { content: true });
			content.push(markup);
		}

	}

	// finalize content
	speak = _.compact(speak);
	content = content.join('');
	
	// return the results
	return {
		speak,
		content
	};

}


// handles special replacement words for unusual pronunciation
function replacePronunciation(str, type) {
	return str.replace(/\|{2}[^\|]+\|[^\|{2}]+\|{2}/g, match => {
		const parts = match.substr(2, match.length - 4).split('|');
		return type.content ? parts[0] : parts[1];
	});
}

// format speech to replace common replacements for
// speech equivilents
function fixSpeech(str) {
	_.each(STANDARD_REPLACEMENTS, (replace, key) => {
		str = str.split(key).join(replace);
	});

	return str;
}


// replace inline dictionary works
function replaceDictionaryWords(line) {
	return line.replace(/\[define ?[^\]]+\]/g, match => {
		let value = _.trim(match.substr(7));
		value = value.replace(/\]$/g, '');
		const parts = value.split(/ /);
		const key = parts.shift();

		// find the value to display
		let display = _.trim(parts.join(' ') || '');

		// make sure this is real
		const definition = state.dictionary[key];
		if (!definition) throw `definition for ${key} is missing`;
		manifest.definitions[key] = definition;

		// without a display name, use the provided one
		if (!display)
			display = definition.name;

		return `<span class="define" type="${key}" >${display}</span>`;
	});
}


// // fixes phrases to make them read easier
// function fixSpeech(phrase, optionalSource) {
// 	if (_.isNumber(phrase))
// 		return phrase;

// 	// convert characters as needed
// 	const words = phrase.split(/ +/g);
// 	for (let i = 0; i < words.length; i++) {
// 		const word = (words[i]).toLowerCase();

// 		// check for replacements
// 		let replace = undefined; // state.replacements[word];
// 		if (!replace) replace = STANDARD_REPLACEMENTS[word];

// 		// save the change
// 		if (_.isString(replace))
// 			words[i] = replace;
// 	}

// 	return words.join(' ');
// }