import _ from 'lodash';
import $showdown from 'showdown';
import $config from './config';
import $path from './path';
import $fsx from 'fs-extra';
import $yaml from 'js-yaml';

// create the converter
const $converter = new $showdown.Converter();
function toMarkdown(str) {
	return $converter.makeHtml(str);
}

// creates a simple loader function
function getContentLoader(name, action) {
  let cached;
  const generate = () => {

    // already cached
    if (cached)
      return cached;

    // read the content
		const path = $path.resolveResource(`content/${name}.yml`);
		const data = $fsx.readFileSync(path);
		const content = data.toString();
		const doc = $yaml.load(content);

		// format the doc as required
		if (action) 
			action(doc);

		// save for later
		if ($config.isProduction)
			cached = doc;

		// give back the document
		return doc;
	};

	
	// if prod, go ahead 
	if (!$config.isProduction)
		return generate;

	// otherwise, cache now
	generate();
	return () => cached;
}


// create each converter
const getSiteContent = getContentLoader('site', doc => {

	// child markdown valuess
	_.each(doc.faq, item => item.answer = toMarkdown(item.answer));
	_.each(doc.policies, item => {
		item.summary = toMarkdown(item.summary);
		item.content = toMarkdown(item.content || '');
	});
	
	_.each(doc.enrollment_notes, item => {
		item.message = toMarkdown(_.trim(item.message)).replace(/^\<p\>|\<\/p\>$/g, '')
	});

	// apply remaining markdown
	_.each(doc, (value, key) => {

		// already managed
		if (_.includes(['faq', 'enrollment_notes', 'plans', 'policies', 'features'], key)) return;

		// update values
		const html = toMarkdown(_.trim(value));
		const result = html.replace(/^\<p\>|\<\/p\>$/g, '');
		doc[key] = result;
	});

});

const getFaqContent = getContentLoader('faq');
const getShowcaseContent = getContentLoader('showcase');

// each of the site content area
export default {
  get site() { return getSiteContent(); },
  get faq() { return getFaqContent(); },
  get showcase() { return getShowcaseContent(); }
};