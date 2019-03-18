import { _ } from './lib';

export const index_start = test => test
	.doctype('html')._n
	.tag('html')._n
	._t.tag('head')._n
	._t._t.tag('title').text('Animal Facts').close('title')._n
	._t.close('head')._n
	._t.tag('body')._n
	._t$._t$._n
	._t._t.tag('h1').text('Animal Facts').close('h1')._n
	._t._t.tag('p').text('The best place to learn animal facts!').close('p');

export const index_end = test => test
	._t.close('body')._n
	.close('html');

export const animals_start = test => test
	.doctype('html')._n
	.tag('html')._n
	._t.tag('head')._n
	._t._t.tag('title').text('Animal List').close('title')._n
	._t.close('head')._n
	._t.tag('body')._n
	._t$._t$._n
	._t._t.tag('h1').text('Animal List').close('h1')._n
	._t._t.tag('p').text('Click on an animal to learn more!').close('p');

export const return_home_link = test => test
	._t._t.open('a')._s.attrs([
		[ 'href', '/index.html' ]
	])._s$.close('>')._n
	._t._t._t.text('Go to home')._n
	._t._t.close('a');

export const animals_end = test => test
	._t.close('body')._n
	.close('html');


// start checking the name
export const animal_fact = (test, allowed) => {
	let selected;

	const links = [
		'href',
		..._.map(allowed, key => `/${key}.html`),

		match => {
			selected = match.substr(0, match.length - 5).substr(1);
		}
	];

	// create the opening link
	test._t._t.open('a')._s.attrs([ links ])._s$.close('>')._n;

	// create the correct url for the image
	test._t._t._t.open('img')._s
		.attrs([
			[ 'src', `/${selected}.png` ]
		])._s$
		.close('/>')._n

	// then the closing link
		._t._t.close('a')._n;

	// remove the image from the list
	const index = allowed.indexOf(selected);
	allowed.splice(index, 1);

	return selected;
};

