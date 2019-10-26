import _ from 'lodash';
import $multiparty from 'multiparty';
import $path from '../path';

export const name = 'echo';
export const route = '/echo';
export const priorty = 5;

export const acceptForm = true;

// determines the correct home view
export function handle(request, response) {
	process(request, (err, fields, files) => {

		// form data
		const data = {
			fields: [ ],
			files: [ ]
		};

		// process each
		processFields(data, fields);
		processFiles(data, files);

		// data helpers
		data.hasFiles = _.some(data.files);
		data.hasFields = _.some(data.fields);
		data.method = _.toUpper(request.method) || 'GET';
		data.type = _.get(_.trim(request.headers['content-type']).match(/^[^;]*/), '[0]');

		console.log(data.files[0]);
		// render the correct response
		return request.xhr
			? response.json(data)
			: response.render('site/echo', data);


	});


}


// checks each of the files
function processFiles(data, files) {
	console.log('processing', files);
	_.each(files, (values, key) => {
		const file = { key, values: [ ] };
		data.files.push(file);

		// process each item
		_.each(values, value => {

			// cache the resolved path
			const filename = $path.setTempPath(value.path);
			const item = { 
				path: `/__codelab__/tmp/${filename}`,
				name: value.originalFilename,
				type: value.headers['content-type'] || 'unknown',
				size: value.size,
				isEmpty: value.size === 0,
				hasFile: value.size > 0,
				isImage: /\.(jpe?g|gif|png|bmp)$/i.test(value.path)
			};

			// save the result
			file.values.push(item);
		});

	});
}


// process each of the fields
function processFields(data, fields) {
	_.each(fields, (values, key) => {

		// create the entry
		const field = { key, values: [ ] };
		data.fields.push(field);

		// add each value
		_.each(values, value => {
			value = _.trim(value);

			// create the entry
			const item = { value };
			field.values.push(item);

			// check for the type of data
			item.type = /^(on|true|false|off)$/i.test(value) ? 'boolean'
				: /^(\d+|\d+\.\d?)$/i.test(value) ? 'number'
				: /^\#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? 'color'
				: 'string';

			// specials
			if (item.type === 'color')
				_.assign(item, {
					isColor: true,
					textColor: getContrastedColor(value, true),
				});

		});
		
		// organize by name
		data.fields = _.orderBy(data.fields, 'key');
	});
}


// handles finding parsed form data
function process(request, handler) {

	// check if already processed
	const { form } = request;
	if (form)
		return handler(form.error, form.fields, form.files);

	// parse it now
	const parser = new $multiparty.Form();
	parser.parse(request, (err, fields, files) => {
		handler(err, fields, files);
	});
}

function getContrastedColor(hex, bw) {
	if (hex.indexOf('#') === 0) {
			hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
			throw new Error('Invalid HEX color.');
	}
	var r = parseInt(hex.slice(0, 2), 16),
			g = parseInt(hex.slice(2, 4), 16),
			b = parseInt(hex.slice(4, 6), 16);
	if (bw) {
			// http://stackoverflow.com/a/3943023/112731
			return (r * 0.299 + g * 0.587 + b * 0.114) > 186
					? '#000000'
					: '#FFFFFF';
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);
	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
}