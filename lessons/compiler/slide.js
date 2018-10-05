import _ from 'lodash';
import showdown from 'showdown';
import $cheerio from 'cheerio';
const converter = new showdown.Converter();
import { fixSpeech } from './speech';


// creates a new slide
export default function processSlide(state, manifest, slide) {
	slide.type = 'slide';

	// get the content to use
	const { content, flags } = slide;

	// apply other tests
	applyFlagChanges(slide, flags);

	// create containers for content
	slide.speak = [ ];
	slide.content = [ ];

	// start reading each line
	const lines = _.trim(content).split(/\n/g);
	for (let line of lines) {
		let hidden;
		let delay;
		let silent;
		let snippet;
		const props = [ ];

		// replace inline dictionary works
		line = line.replace(/\[define ?[^\]]+\]/, match => {
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

			// check if this is hidden
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

		if (snippet)
			slide.content.push(`<div class="snippet" type="${snippet}" ${props.join(' ')}/>`);

		// check for a delay
		if (!isNaN(delay))
			slide.speak.push(delay);

		// check to add text or not
		if (!silent) {
			let speak = converter.makeHtml(line);
			speak = $cheerio.load(speak).text();
			slide.speak.push(speak);
		}

		// if visible, add it to the content
		if (!hidden) {
			const markup = converter.makeHtml(line);
			slide.content.push(_.trim(markup));
		}

	}

	// replace the final
	slide.speak = _.compact(slide.speak);
	slide.speak = _.map(slide.speak, val => fixSpeech(state, val));
	slide.content = slide.content.join('');
}


// checks for changes to the configuration
function applyFlagChanges(slide, flags) {
	if (!flags) return;

	const add = [ ];
	const remove = [ ];

	// modifies the flags
	const options = flags.split(/ +/g);
	for (const option of options) {
		const method = option[0];
		const param = option.substr(1);
		if (method === '+') add.push(param);
		else if (method === '-') remove.push(param);
	}

	// save the result
	const hasAdd = add.length > 0;
	const hasRemove = remove.length > 0;
	const hasConfig = hasAdd || hasRemove;

	// save the value
	if (hasConfig) {
		slide.flags = { };
		if (hasAdd) slide.flags.add = add;
		if (hasRemove) slide.flags.remove = remove;
	}
}

function convertSelector(str) {
  return _.trim(str).replace(/\$/g, '#');
}